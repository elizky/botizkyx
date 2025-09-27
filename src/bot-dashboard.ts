// src/bot-dashboard.ts
import { TwitterService } from './services/twitterService';
import logger from './utils/logger';
import config from './config/config';
import { TweetResult } from './types/twitter.types';
import { PrismaClient } from '@prisma/client';

export class BotDashboard {
  private twitterService: TwitterService;
  private prisma: PrismaClient;
  private isRunning: boolean = false;

  constructor() {
    this.twitterService = new TwitterService(config.twitter);
    
    // Conectar a la base de datos del dashboard
    this.prisma = new PrismaClient();
  }

  async inicializar(): Promise<boolean> {
    try {
      logger.info(`🚀 Iniciando ${config.bot.name} v${config.bot.version} (Dashboard Mode)`);
      logger.info(`📝 Descripción: ${config.bot.description}`);
      
      // Verificar conexión con Twitter (con manejo de rate limit)
      try {
        const conexion = await this.twitterService.verificarConexion();
        
        if (conexion.success) {
          logger.info(`✅ Bot inicializado correctamente`);
          logger.info(`👤 Conectado como: @${conexion.username}`);
          return true;
        }
        
        return false;
      } catch (error: any) {
        // Si es rate limit, continuamos de todas formas
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          logger.warn('⚠️ Rate limit en verificación de conexión, pero continuando...');
          logger.info('✅ Bot inicializado (modo rate limit)');
          return true;
        }
        
        // Si es otro error, lo lanzamos
        throw error;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error inicializando bot:', errorMessage);
      return false;
    }
  }

  async obtenerSiguienteMensaje(): Promise<string | null> {
    try {
      const mensaje = await this.prisma.message.findFirst({
        where: { isPosted: false },
        orderBy: { createdAt: 'asc' }
      });

      if (mensaje) {
        logger.info(`📝 Mensaje encontrado: "${mensaje.content}"`);
        return mensaje.content;
      }

      logger.info('📝 No hay mensajes pendientes en la cola');
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error obteniendo mensaje de la base de datos:', errorMessage);
      return null;
    }
  }

  async marcarComoPosteado(id: number): Promise<void> {
    try {
      await this.prisma.message.update({
        where: { id },
        data: { isPosted: true, postedAt: new Date() }
      });
      logger.info(`✅ Mensaje ${id} marcado como posteado`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error marcando mensaje como posteado:', errorMessage);
    }
  }

  async publicarTweet(texto: string): Promise<TweetResult | null> {
    try {
      const resultado = await this.twitterService.publicarTweet(texto);
      
      if (resultado.success) {
        logger.info(`✅ Tweet publicado exitosamente`);
        return resultado;
      }
      
      return null;
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      // Manejar diferentes tipos de errores
      if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        logger.warn('⚠️ Rate limit alcanzado al publicar tweet');
        throw new Error('429: Rate limit exceeded');
      } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
        logger.error('❌ Error de autenticación al publicar tweet');
        throw new Error('401: Authentication failed');
      } else if (errorMessage.includes('duplicate')) {
        logger.warn('⚠️ Tweet duplicado detectado');
        throw new Error('duplicate: Duplicate content');
      } else {
        logger.error('❌ Error publicando tweet:', errorMessage);
        throw error;
      }
    }
  }

  async ejecutar(): Promise<boolean> {
    try {
      this.isRunning = true;
      logger.info('🤖 Ejecutando bot (Dashboard Mode)...');
      
      // Obtener siguiente mensaje de la cola
      const mensaje = await this.obtenerSiguienteMensaje();
      
      if (!mensaje) {
        logger.info('📝 No hay mensajes pendientes. Bot finalizado.');
        return true;
      }

      // Obtener el ID del mensaje para marcarlo como posteado
      const mensajeCompleto = await this.prisma.message.findFirst({
        where: { 
          content: mensaje,
          isPosted: false 
        },
        orderBy: { createdAt: 'asc' }
      });

      if (!mensajeCompleto) {
        logger.warn('⚠️ Mensaje no encontrado en la base de datos');
        return false;
      }

      // Publicar el tweet
      try {
        const resultado = await this.publicarTweet(mensaje);
        
        if (resultado) {
          // Marcar como posteado
          await this.marcarComoPosteado(mensajeCompleto.id);
          logger.info('✅ Bot ejecutado exitosamente');
          return true;
        }
        
        return false;
      } catch (error: any) {
        // Manejar errores específicos de Twitter API
        if (error.message?.includes('429') || error.message?.includes('rate limit')) {
          logger.warn('⚠️ Rate limit alcanzado. El mensaje permanecerá en la cola.');
          logger.info('📝 El bot se ejecutará nuevamente en la próxima vez');
          return true; // Consideramos exitoso para que no falle el job
        } else if (error.message?.includes('duplicate')) {
          logger.warn('⚠️ Tweet duplicado. Marcando como posteado para evitar repetición.');
          await this.marcarComoPosteado(mensajeCompleto.id);
          return true;
        } else {
          logger.error('❌ Error inesperado al publicar tweet:', error.message);
          throw error;
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error ejecutando bot:', errorMessage);
      return false;
    } finally {
      this.isRunning = false;
    }
  }

  async detener(): Promise<void> {
    logger.info('🛑 Deteniendo bot...');
    this.isRunning = false;
    await this.prisma.$disconnect();
  }

  get running(): boolean {
    return this.isRunning;
  }
}

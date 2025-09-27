// src/bot.ts
import { TwitterService } from './services/twitterService';
import logger from './utils/logger';
import config from './config/config';
import { TweetResult } from './types/twitter.types';

export class Bot {
  private twitterService: TwitterService;
  private isRunning: boolean = false;

  constructor() {
    this.twitterService = new TwitterService(config.twitter);
  }

  async inicializar(): Promise<boolean> {
    try {
      logger.info(`🚀 Iniciando ${config.bot.name} v${config.bot.version}`);
      logger.info(`📝 Descripción: ${config.bot.description}`);
      
      // Verificar conexión con Twitter
      const conexion = await this.twitterService.verificarConexion();
      
      if (conexion.success) {
        logger.info(`✅ Bot inicializado correctamente`);
        logger.info(`👤 Conectado como: @${conexion.username}`);
        return true;
      }
      
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error inicializando bot:', errorMessage);
      return false;
    }
  }

  async publicarTweet(texto?: string): Promise<TweetResult | null> {
    try {
      let mensaje = texto || config.bot.defaultMessage;
      
      // Reemplazar {timestamp} con timestamp actual si existe
      if (mensaje.includes('{timestamp}')) {
        mensaje = mensaje.replace('{timestamp}', new Date().toISOString());
      }
      
      const resultado = await this.twitterService.publicarTweet(mensaje);
      
      if (resultado.success) {
        logger.info(`✅ Tweet publicado exitosamente`);
        return resultado;
      }
      
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error publicando tweet:', errorMessage);
      throw error;
    }
  }

  async ejecutar(): Promise<boolean> {
    try {
      this.isRunning = true;
      logger.info('🤖 Ejecutando bot...');
      
      const resultado = await this.publicarTweet();
      
      if (resultado) {
        logger.info('✅ Bot ejecutado exitosamente');
        return true;
      }
      
      return false;
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
  }

  get running(): boolean {
    return this.isRunning;
  }
}

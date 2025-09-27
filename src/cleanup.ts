// src/cleanup.ts - Script de limpieza de cuenta
import { TwitterService } from './services/twitterService';
import logger from './utils/logger';
import config from './config/config';

class AccountCleanup {
  private twitterService: TwitterService;

  constructor() {
    this.twitterService = new TwitterService(config.twitter);
  }

  async verificarConexion(): Promise<boolean> {
    try {
      logger.info('🔍 Verificando conexión...');
      const conexion = await this.twitterService.verificarConexion();
      
      if (conexion.success) {
        logger.info(`✅ Conectado como: @${conexion.username}`);
        return true;
      }
      
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error de conexión:', errorMessage);
      return false;
    }
  }

  async mostrarEstadisticas(): Promise<void> {
    try {
      logger.info('📊 Obteniendo estadísticas de la cuenta...');
      
      // Obtener mis tweets
      const tweets = await this.twitterService.obtenerMisTweets(100);
      logger.info(`📝 Tweets encontrados: ${tweets.tweets.length}`);
      
      // Obtener seguidos
      const seguidos = await this.twitterService.obtenerSeguidos(100);
      logger.info(`👥 Usuarios seguidos: ${seguidos.users.length}`);
      
      logger.info('📊 Estadísticas actuales:');
      logger.info(`   - Tweets: ${tweets.tweets.length}`);
      logger.info(`   - Siguiendo: ${seguidos.users.length}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error obteniendo estadísticas:', errorMessage);
    }
  }

  async limpiarTweets(): Promise<void> {
    try {
      logger.info('🧹 Iniciando limpieza de tweets...');
      
      const resultado = await this.twitterService.eliminarTodosLosTweets();
      
      logger.info('✅ Limpieza de tweets completada:');
      logger.info(`   - Tweets eliminados: ${resultado.eliminados}`);
      logger.info(`   - Errores: ${resultado.errores}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error en limpieza de tweets:', errorMessage);
    }
  }

  async limpiarSeguidos(): Promise<void> {
    try {
      logger.info('🧹 Iniciando limpieza de seguidos...');
      
      const resultado = await this.twitterService.dejarDeSeguirATodos();
      
      logger.info('✅ Limpieza de seguidos completada:');
      logger.info(`   - Unfollows: ${resultado.unfollows}`);
      logger.info(`   - Errores: ${resultado.errores}`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error en limpieza de seguidos:', errorMessage);
    }
  }

  async limpiezaCompleta(): Promise<void> {
    try {
      logger.info('🚀 Iniciando limpieza completa de cuenta...');
      
      // Mostrar estadísticas iniciales
      await this.mostrarEstadisticas();
      
      // Pausa para confirmación
      logger.info('⏸️ Pausa de 5 segundos antes de continuar...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Limpiar tweets
      await this.limpiarTweets();
      
      // Pausa entre operaciones
      logger.info('⏸️ Pausa de 10 segundos antes de limpiar seguidos...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Limpiar seguidos
      await this.limpiarSeguidos();
      
      // Mostrar estadísticas finales
      logger.info('📊 Estadísticas finales:');
      await this.mostrarEstadisticas();
      
      logger.info('🎉 Limpieza completa finalizada!');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error en limpieza completa:', errorMessage);
    }
  }
}

// Función principal
async function main(): Promise<void> {
  const cleanup = new AccountCleanup();
  
  try {
    // Verificar conexión
    const conectado = await cleanup.verificarConexion();
    if (!conectado) {
      logger.error('❌ No se pudo conectar a Twitter');
      process.exit(1);
    }
    
    // Mostrar menú de opciones
    logger.info('🧹 Bot de Limpieza de Cuenta de X');
    logger.info('================================');
    logger.info('1. Ver estadísticas');
    logger.info('2. Limpiar solo tweets');
    logger.info('3. Limpiar solo seguidos');
    logger.info('4. Limpieza completa');
    logger.info('================================');
    
    // Por ahora ejecutar limpieza completa
    // En el futuro se puede agregar un menú interactivo
    await cleanup.limpiezaCompleta();
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    logger.error('❌ Error fatal:', errorMessage);
    process.exit(1);
  }
}

// Manejar señales de terminación
process.on('SIGINT', () => {
  logger.info('👋 Limpieza interrumpida por el usuario');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('👋 Limpieza terminada');
  process.exit(0);
});

// Ejecutar
main();

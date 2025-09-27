// src/main.ts - Punto de entrada principal
import { Bot } from './bot';
import logger from './utils/logger';

async function main(): Promise<void> {
  try {
    logger.info('🚀 Iniciando aplicación...');
    
    // Crear instancia del bot
    logger.info('🤖 Creando instancia del bot...');
    const bot = new Bot();
    
    // Inicializar el bot
    logger.info('🔧 Inicializando bot...');
    const inicializado = await bot.inicializar();
    
    if (!inicializado) {
      logger.error('❌ No se pudo inicializar el bot');
      process.exit(1);
    }
    
    // Ejecutar el bot
    logger.info('▶️ Ejecutando bot...');
    const ejecutado = await bot.ejecutar();
    
    if (ejecutado) {
      logger.info('🎉 Bot ejecutado exitosamente');
      process.exit(0);
    } else {
      logger.error('❌ Error ejecutando el bot');
      process.exit(1);
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    logger.error('❌ Error fatal:', errorMessage);
    if (error instanceof Error && error.stack) {
      logger.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Manejar señales de terminación
process.on('SIGINT', () => {
  logger.info('👋 Recibida señal de terminación');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('👋 Recibida señal de terminación');
  process.exit(0);
});

// Ejecutar la aplicación
main();

// src/main-dashboard.ts
import { BotDashboard } from './bot-dashboard';
import logger from './utils/logger';

async function main() {
  logger.info('🚀 Iniciando Bot Dashboard...');
  
  const bot = new BotDashboard();
  
  try {
    // Inicializar bot
    const inicializado = await bot.inicializar();
    
    if (!inicializado) {
      logger.error('❌ No se pudo inicializar el bot');
      process.exit(1);
    }
    
    // Ejecutar bot
    const ejecutado = await bot.ejecutar();
    
    if (ejecutado) {
      logger.info('✅ Bot ejecutado exitosamente');
      process.exit(0);
    } else {
      logger.error('❌ Error ejecutando bot');
      process.exit(1);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    logger.error('❌ Error fatal:', errorMessage);
    process.exit(1);
  } finally {
    await bot.detener();
  }
}

main();

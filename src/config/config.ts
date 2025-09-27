// src/config/config.ts
import * as dotenv from 'dotenv';
import { Config } from '../types/config.types';

dotenv.config();

const config: Config = {
  // Configuración de Twitter API
  twitter: {
    appKey: process.env['TWITTER_APP_KEY'] || '',
    appSecret: process.env['TWITTER_APP_SECRET'] || '',
    accessToken: process.env['TWITTER_ACCESS_TOKEN'] || '',
    accessSecret: process.env['TWITTER_ACCESS_SECRET'] || '',
  },

  // Configuración del bot
  bot: {
    name: 'BotIzkyX',
    version: '1.0.0',
    description: 'Bot que publica frases automáticamente en X',
    defaultMessage: 'Probando el bot — {timestamp} 🤖',
  },

  // Configuración de logging
  logging: {
    level: (process.env['LOG_LEVEL'] as 'debug' | 'info' | 'warn' | 'error') || 'info',
    logToFile: process.env['LOG_TO_FILE'] === 'true',
  },

  // Configuración de la aplicación
  app: {
    port: parseInt(process.env['PORT'] || '3000', 10),
    environment: (process.env['NODE_ENV'] as 'development' | 'production' | 'test') || 'development',
  }
};

// Validar variables de entorno requeridas
const requiredEnvVars: (keyof typeof process.env)[] = [
  'TWITTER_APP_KEY',
  'TWITTER_APP_SECRET', 
  'TWITTER_ACCESS_TOKEN',
  'TWITTER_ACCESS_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variables de entorno faltantes:', missingVars);
  console.error('💡 Asegúrate de configurar tu archivo .env correctamente');
  process.exit(1);
}

export default config;

// src/types/config.types.ts

export interface TwitterConfig {
  appKey: string;
  appSecret: string;
  accessToken: string;
  accessSecret: string;
}

export interface BotConfig {
  name: string;
  version: string;
  description: string;
  defaultMessage: string;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  logToFile: boolean;
}

export interface AppConfig {
  port: number;
  environment: 'development' | 'production' | 'test';
}

export interface Config {
  twitter: TwitterConfig;
  bot: BotConfig;
  logging: LoggingConfig;
  app: AppConfig;
}

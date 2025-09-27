// src/utils/logger.ts
import fs from 'fs';
import path from 'path';

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = this.getTimestamp();
    const logEntry: LogEntry = {
      timestamp,
      level,
      message,
      ...(data !== undefined && { data })
    };
    
    return JSON.stringify(logEntry);
  }

  private writeToFile(level: LogLevel, message: string, data?: unknown): void {
    const logFile = path.join(this.logDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
    const logEntry = this.formatMessage(level, message, data) + '\n';
    
    fs.appendFileSync(logFile, logEntry);
  }

  info(message: string, data?: unknown): void {
    const formattedMessage = `[INFO] ${message}`;
    console.log(formattedMessage);
    this.writeToFile('INFO', message, data);
  }

  error(message: string, data?: unknown): void {
    const formattedMessage = `[ERROR] ${message}`;
    console.error(formattedMessage);
    this.writeToFile('ERROR', message, data);
  }

  warn(message: string, data?: unknown): void {
    const formattedMessage = `[WARN] ${message}`;
    console.warn(formattedMessage);
    this.writeToFile('WARN', message, data);
  }

  debug(message: string, data?: unknown): void {
    const formattedMessage = `[DEBUG] ${message}`;
    console.log(formattedMessage);
    this.writeToFile('DEBUG', message, data);
  }
}

export default new Logger();

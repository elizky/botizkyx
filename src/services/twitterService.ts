// src/services/twitterService.ts
import { TwitterApi } from 'twitter-api-v2';
import {
  ConnectionResult,
  TweetResult,
  TimelineResult,
  TwitterCredentials,
} from '../types/twitter.types';
import logger from '../utils/logger';

export class TwitterService {
  private client: TwitterApi;

  constructor(credentials: TwitterCredentials) {
    this.client = new TwitterApi({
      appKey: credentials.appKey,
      appSecret: credentials.appSecret,
      accessToken: credentials.accessToken,
      accessSecret: credentials.accessSecret,
    });
  }

  async verificarConexion(): Promise<ConnectionResult> {
    try {
      logger.info('🔍 Verificando conexión con Twitter API...');

      const me = await this.client.v2.me();
      logger.info(`✅ Conectado como: @${me.data.username}`);

      return {
        success: true,
        username: me.data.username,
        userId: me.data.id,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error de conexión:', errorMessage);
      throw error;
    }
  }

  async publicarTweet(texto: string): Promise<TweetResult> {
    try {
      logger.info(`📝 Publicando tweet: "${texto}"`);

      const response = await this.client.v2.tweet(texto);

      logger.info(`✅ Tweet publicado exitosamente`);
      logger.info(`🆔 Tweet ID: ${response.data.id}`);

      return {
        success: true,
        tweetId: response.data.id,
        text: response.data.text,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error publicando tweet:', errorMessage);
      throw error;
    }
  }

  async obtenerTimeline(usuarioId: string, maxResults: number = 5): Promise<TimelineResult> {
    try {
      logger.info(`📖 Obteniendo timeline del usuario: ${usuarioId}`);

      const timeline = await this.client.v2.userTimeline(usuarioId, {
        max_results: maxResults,
      });

      const tweets = timeline.data?.data || [];
      logger.info(`✅ Timeline obtenido: ${tweets.length} tweets`);

      return {
        success: true,
        tweets: tweets,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error obteniendo timeline:', errorMessage);
      throw error;
    }
  }
}

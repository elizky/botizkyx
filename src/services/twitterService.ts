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
      logger.error('❌ Detalles del error:', error);
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

  // ===== MÉTODOS DE LIMPIEZA DE CUENTA =====

  async obtenerMisTweets(maxResults: number = 100): Promise<TimelineResult> {
    try {
      logger.info(`📖 Obteniendo mis tweets (máximo ${maxResults})...`);

      const me = await this.client.v2.me();
      const timeline = await this.client.v2.userTimeline(me.data.id, {
        max_results: maxResults,
      });

      const tweets = timeline.data?.data || [];
      logger.info(`✅ Encontrados ${tweets.length} tweets`);

      return {
        success: true,
        tweets: tweets,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error obteniendo mis tweets:', errorMessage);
      logger.error('Detalles del error:', error);
      throw error;
    }
  }

  async eliminarTweet(tweetId: string): Promise<boolean> {
    try {
      logger.info(`🗑️ Eliminando tweet: ${tweetId}`);

      await this.client.v2.deleteTweet(tweetId);
      logger.info(`✅ Tweet ${tweetId} eliminado exitosamente`);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error(`❌ Error eliminando tweet ${tweetId}:`, errorMessage);
      return false;
    }
  }

  async eliminarTodosLosTweets(): Promise<{ eliminados: number; errores: number }> {
    try {
      logger.info('🧹 Iniciando limpieza completa de tweets...');

      let eliminados = 0;
      let errores = 0;
      let paginationToken: string | undefined;

      do {
        // Obtener tweets en lotes
        const me = await this.client.v2.me();
        const timeline = await this.client.v2.userTimeline(me.data.id, {
          max_results: 100,
          'tweet.fields': 'id,text,created_at',
          ...(paginationToken && { pagination_token: paginationToken }),
        });

        const tweets = timeline.data?.data || [];

        if (tweets.length === 0) {
          break;
        }

        logger.info(`📦 Procesando lote de ${tweets.length} tweets...`);

        // Eliminar tweets uno por uno (respetando límites de rate)
        for (const tweet of tweets) {
          const eliminado = await this.eliminarTweet(tweet.id);

          if (eliminado) {
            eliminados++;
          } else {
            errores++;
          }

          // Pausa para respetar límites de rate (1 segundo entre eliminaciones)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Actualizar token de paginación
        paginationToken = timeline.meta?.next_token;

        // Pausa entre lotes (2 segundos)
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } while (paginationToken);

      logger.info(`✅ Limpieza completada: ${eliminados} eliminados, ${errores} errores`);

      return { eliminados, errores };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error en limpieza de tweets:', errorMessage);
      throw error;
    }
  }

  async obtenerSeguidos(maxResults: number = 1000): Promise<{ success: boolean; users: any[] }> {
    try {
      logger.info(`👥 Obteniendo usuarios seguidos (máximo ${maxResults})...`);

      const me = await this.client.v2.me();
      const following = await this.client.v2.following(me.data.id, {
        max_results: Math.min(maxResults, 100), // Twitter limita a 100 por petición
      });

      // following.data es un array de usuarios directamente
      const users = Array.isArray(following.data) ? following.data : [];
      logger.info(`✅ Encontrados ${users.length} usuarios seguidos`);

      return {
        success: true,
        users: users,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error obteniendo seguidos:', errorMessage);
      logger.error('Detalles del error:', error);
      throw error;
    }
  }

  async dejarDeSeguir(usuarioId: string): Promise<boolean> {
    try {
      logger.info(`👋 Dejando de seguir usuario: ${usuarioId}`);

      const me = await this.client.v2.me();
      await this.client.v2.unfollow(me.data.id, usuarioId);
      logger.info(`✅ Dejado de seguir: ${usuarioId}`);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error(`❌ Error dejando de seguir ${usuarioId}:`, errorMessage);
      return false;
    }
  }

  async dejarDeSeguirATodos(): Promise<{ unfollows: number; errores: number }> {
    try {
      logger.info('🧹 Iniciando unfollow masivo...');

      let unfollows = 0;
      let errores = 0;
      let paginationToken: string | undefined;

      do {
        // Obtener seguidos en lotes
        const me = await this.client.v2.me();
        const following = await this.client.v2.following(me.data.id, {
          max_results: 100,
          ...(paginationToken && { pagination_token: paginationToken }),
        });

        // following.data es un array de usuarios directamente
        const users = Array.isArray(following.data) ? following.data : [];

        if (users.length === 0) {
          break;
        }

        logger.info(`📦 Procesando lote de ${users.length} usuarios...`);

        // Dejar de seguir uno por uno
        for (const user of users) {
          const unfollowed = await this.dejarDeSeguir(user.id);

          if (unfollowed) {
            unfollows++;
          } else {
            errores++;
          }

          // Pausa para respetar límites de rate (1 segundo entre unfollows)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        // Actualizar token de paginación
        paginationToken = following.meta?.next_token;

        // Pausa entre lotes (2 segundos)
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } while (paginationToken);

      logger.info(`✅ Unfollow completado: ${unfollows} unfollows, ${errores} errores`);

      return { unfollows, errores };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error('❌ Error en unfollow masivo:', errorMessage);
      throw error;
    }
  }

  async seguirUsuario(usuarioId: string): Promise<boolean> {
    try {
      logger.info(`👋 Siguiendo usuario: ${usuarioId}`);

      const me = await this.client.v2.me();
      await this.client.v2.follow(me.data.id, usuarioId);
      logger.info(`✅ Siguiendo: ${usuarioId}`);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      logger.error(`❌ Error siguiendo ${usuarioId}:`, errorMessage);
      return false;
    }
  }
}

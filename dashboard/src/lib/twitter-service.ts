import { TwitterApi } from 'twitter-api-v2'

export class TwitterService {
  private client: TwitterApi

  constructor() {
    this.client = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY!,
      appSecret: process.env.TWITTER_APP_SECRET!,
      accessToken: process.env.TWITTER_ACCESS_TOKEN!,
      accessSecret: process.env.TWITTER_ACCESS_SECRET!,
    })
  }

  async publicarTweet(content: string) {
    try {
      const res = await this.client.v2.tweet(content)
      return res.data
    } catch (error: unknown) {
      // Detectar tipos específicos de errores de Twitter API
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 429) {
          throw new Error('429: Rate limit exceeded')
        } else if (error.code === 401 || error.code === 403) {
          throw new Error('401: Authentication failed')
        } else if (error.code === 403 && 'data' in error && error.data && typeof error.data === 'object' && 'detail' in error.data && typeof error.data.detail === 'string' && error.data.detail.includes('duplicate')) {
          throw new Error('duplicate: Duplicate content')
        }
      }
      
      // Error genérico
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Error al publicar tweet: ${errorMessage}`)
    }
  }

  async obtenerMisTweets() {
    try {
      const me = await this.client.v2.me()
      const timeline = await this.client.v2.userTimeline(me.data.id, {
        max_results: 100,
        'tweet.fields': ['created_at', 'public_metrics']
      })
      return timeline.data?.data || []
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Error obteniendo tweets: ${errorMessage}`)
    }
  }

  async eliminarTweet(tweetId: string) {
    try {
      await this.client.v2.deleteTweet(tweetId)
      return true
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new Error(`Error eliminando tweet: ${errorMessage}`)
    }
  }
}

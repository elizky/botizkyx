'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { toast } from 'sonner' // No se usa en este componente

interface TwitterTweet {
  id: string
  text: string
  created_at: string
  public_metrics: {
    retweet_count: number
    like_count: number
    reply_count: number
  }
}

export function TwitterTweets() {
  const [tweets, setTweets] = useState<TwitterTweet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTweets()
  }, [])

  const fetchTweets = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/twitter/tweets')
      const data = await response.json()
      
      if (response.ok) {
        // Verificar que data sea un array
        if (Array.isArray(data)) {
          setTweets(data)
        } else {
          setError('Formato de datos inesperado')
          setTweets([])
        }
      } else {
        // Manejar errores de la API
        if (data.error?.includes('rate limit') || data.error?.includes('429')) {
          setError('Límite de lectura de Twitter alcanzado. Puedes seguir posteando, pero no ver tweets existentes.')
        } else if (data.error?.includes('401') || data.error?.includes('403')) {
          setError('Error de autenticación con Twitter API')
        } else {
          setError(data.error || 'Error al cargar tweets')
        }
        setTweets([])
      }
    } catch (error: unknown) {
      setError('Error de conexión con Twitter API')
      setTweets([])
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return <div className="text-center py-4">Cargando tweets...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchTweets}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (tweets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay tweets en tu cuenta
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={fetchTweets}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Actualizar
        </button>
      </div>
      
      <div className="max-h-96 overflow-y-auto space-y-4">
        {tweets.map((tweet) => (
          <Card key={tweet.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-medium text-blue-600">
                  Tweet de Twitter
                </CardTitle>
                <span className="text-xs text-gray-400">
                  {new Date(tweet.created_at).toISOString().split('T')[0]}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-gray-900 mb-4">{tweet.text}</p>
              
              {/* Métricas del tweet */}
              <div className="flex gap-4 text-xs text-gray-500">
                <span>❤️ {tweet.public_metrics.like_count}</span>
                <span>🔄 {tweet.public_metrics.retweet_count}</span>
                <span>💬 {tweet.public_metrics.reply_count}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

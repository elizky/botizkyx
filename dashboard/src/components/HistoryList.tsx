'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Message {
  id: number
  content: string
  isPosted: boolean
  postedAt: Date | null
  createdAt: Date
}

interface HistoryListProps {
  messages: Message[]
}

export function HistoryList({ messages }: HistoryListProps) {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages)

  // Actualizar cuando cambien los props
  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages?type=history')
      const data = await response.json()
      setLocalMessages(data)
    } catch (error) {
      console.error('Error al cargar historial:', error)
    }
  }

  if (localMessages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay mensajes en el historial
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={fetchMessages}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Actualizar
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-4">
        {localMessages.map((message) => (
        <Card key={message.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-green-600">
                Publicado
              </CardTitle>
              <span className="text-xs text-gray-400">
                {message.postedAt 
                  ? new Date(message.postedAt).toISOString().split('T')[0]
                  : new Date(message.createdAt).toISOString().split('T')[0]
                }
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-900 text-sm">{message.content}</p>
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
  )
}

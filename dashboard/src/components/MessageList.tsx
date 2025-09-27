'use client'

import { useState, useEffect } from 'react'
import { postMessageNow, deleteMessage } from '@/app/actions/message-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
// import { prisma } from '@/lib/database' // No se usa en este componente

interface Message {
  id: number
  content: string
  isPosted: boolean
  postedAt: Date | null
  createdAt: Date
}

interface MessageListProps {
  messages: Message[]
  type: 'pending' | 'history'
}

export function MessageList({ messages, type }: MessageListProps) {
  const [localMessages, setLocalMessages] = useState<Message[]>(messages)
  const [isRateLimited, setIsRateLimited] = useState(false)

  // Actualizar cuando cambien los props
  useEffect(() => {
    setLocalMessages(messages)
  }, [messages])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?type=${type}`)
      const data = await response.json()
      setLocalMessages(data)
    } catch (error) {
      toast.error('Error al cargar mensajes')
    }
  }

  const handlePostNow = async (id: number) => {
    try {
      setIsRateLimited(false)
      await postMessageNow(id)
      toast.success('Mensaje publicado correctamente')
      
      // Actualizar inmediatamente
      fetchMessages()
    } catch (error: unknown) {
      // Manejar diferentes tipos de errores
      if (error instanceof Error && (error.message?.includes('429') || error.message?.includes('rate limit'))) {
        setIsRateLimited(true)
        toast.error('Límite de posteo de Twitter alcanzado. Intenta más tarde.')
      } else if (error instanceof Error && (error.message?.includes('401') || error.message?.includes('403'))) {
        toast.error('Error de autenticación con Twitter API')
      } else if (error instanceof Error && (error.message?.includes('duplicate') || error.message?.includes('duplicado'))) {
        toast.error('Mensaje duplicado. Intenta con otro contenido.')
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Error al publicar'
        toast.error(errorMessage)
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este mensaje?')) return
    
    try {
      await deleteMessage(id)
      toast.success('Mensaje eliminado')
      
      // Actualizar inmediatamente
      fetchMessages()
    } catch (error: unknown) {
      toast.error('Error al eliminar mensaje')
    }
  }

  if (localMessages.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {type === 'pending' ? 'No hay mensajes pendientes' : 'No hay historial'}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {isRateLimited && (
          <div className="text-xs text-red-600 font-medium">
            ⚠️ Límite de posteo alcanzado
          </div>
        )}
        <button
          onClick={fetchMessages}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Actualizar
        </button>
      </div>
      {localMessages.map((message) => (
        <Card key={message.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-gray-600">
                {type === 'pending' ? 'Pendiente' : 'Publicado'}
              </CardTitle>
              <span className="text-xs text-gray-400">
                {new Date(message.createdAt).toISOString().split('T')[0]}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-gray-900 mb-4">{message.content}</p>
            <div className="flex gap-2">
              {type === 'pending' && (
                <Button
                  onClick={() => handlePostNow(message.id)}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Postear Ahora
                </Button>
              )}
              <Button
                onClick={() => handleDelete(message.id)}
                size="sm"
                variant="destructive"
              >
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

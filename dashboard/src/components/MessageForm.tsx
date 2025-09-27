'use client'

import { useState } from 'react'
import { addMessage } from '@/app/actions/message-actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export function MessageForm() {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await addMessage(content)
      setContent('')
      toast.success('Mensaje agregado correctamente')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al agregar mensaje')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escribe tu mensaje..."
          maxLength={280}
          rows={4}
          className="resize-none"
        />
        <div className="flex justify-between items-center mt-2">
          <span className={`text-sm ${content.length > 260 ? 'text-red-500' : 'text-gray-500'}`}>
            {content.length}/280 caracteres
          </span>
          {content.length > 260 && (
            <span className="text-xs text-red-500">
              {280 - content.length} caracteres restantes
            </span>
          )}
        </div>
      </div>
      
      <Button
        type="submit"
        disabled={isSubmitting || content.trim().length === 0 || content.length > 280}
        className="w-full"
      >
        {isSubmitting ? 'Agregando...' : 'Agregar Mensaje'}
      </Button>
    </form>
  )
}

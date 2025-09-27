'use server'

import { prisma } from '@/lib/database'
import { TwitterService } from '@/lib/twitter-service'
import { revalidatePath } from 'next/cache'

export async function addMessage(content: string) {
  // Validar longitud
  if (content.length > 280) {
    throw new Error('Mensaje muy largo (máximo 280 caracteres)')
  }
  
  if (content.trim().length === 0) {
    throw new Error('El mensaje no puede estar vacío')
  }

  const message = await prisma.message.create({
    data: { content: content.trim() }
  })
  
  revalidatePath('/dashboard')
  return message
}

export async function postMessageNow(id: number) {
  const message = await prisma.message.findUnique({
    where: { id }
  })
  
  if (!message) {
    throw new Error('Mensaje no encontrado')
  }
  
  if (message.isPosted) {
    throw new Error('Mensaje ya fue publicado')
  }

  try {
    const twitterService = new TwitterService()
    await twitterService.publicarTweet(message.content)
    
    await prisma.message.update({
      where: { id },
      data: { isPosted: true, postedAt: new Date() }
    })
    
    revalidatePath('/dashboard')
    return { success: true }
    } catch (error: unknown) {
    // Re-lanzar el error con el mensaje original para mejor manejo
    if (error instanceof Error && (error.message?.includes('429') || error.message?.includes('rate limit'))) {
      throw new Error('429: Límite de API de Twitter alcanzado. Intenta más tarde.')
    } else if (error instanceof Error && (error.message?.includes('401') || error.message?.includes('403'))) {
      throw new Error('401: Error de autenticación con Twitter API')
    } else if (error instanceof Error && (error.message?.includes('duplicate') || error.message?.includes('duplicado'))) {
      throw new Error('duplicate: Mensaje duplicado. Intenta con otro contenido.')
    } else {
      throw new Error(`Error al publicar: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

export async function deleteMessage(id: number) {
  await prisma.message.delete({
    where: { id }
  })
  
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getNextPendingMessage() {
  return await prisma.message.findFirst({
    where: { isPosted: false },
    orderBy: { createdAt: 'asc' }
  })
}

export async function markAsPosted(id: number) {
  return await prisma.message.update({
    where: { id },
    data: { isPosted: true, postedAt: new Date() }
  })
}

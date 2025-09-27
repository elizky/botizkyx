import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'pending'
    
    const messages = await prisma.message.findMany({
      where: type === 'pending' ? { isPosted: false } : { isPosted: true },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    return NextResponse.json(messages)
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error al obtener mensajes' }, { status: 500 })
  }
}

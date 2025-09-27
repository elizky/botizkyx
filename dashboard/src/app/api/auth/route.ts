import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json({ error: 'Contraseña requerida' }, { status: 400 })
    }

    if (verifyPassword(password)) {
      const response = NextResponse.json({ success: true })
      response.cookies.set('auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 días
      })
      return response
    } else {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

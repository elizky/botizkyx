import { NextResponse } from 'next/server';
import { TwitterService } from '@/lib/twitter-service';

export async function GET() {
  try {
    const twitterService = new TwitterService();
    const tweets = await twitterService.obtenerMisTweets();

    return NextResponse.json(tweets);
  } catch (error: unknown) {
    console.error('Error obteniendo tweets:', error);

    // Manejar diferentes tipos de errores
    if (error instanceof Error && (error.message?.includes('429') || error.message?.includes('rate limit'))) {
      return NextResponse.json(
        { error: 'Límite de lectura de Twitter alcanzado. Puedes seguir posteando, pero no ver tweets existentes.' },
        { status: 429 }
      );
    } else if (error instanceof Error && (error.message?.includes('401') || error.message?.includes('403'))) {
      return NextResponse.json(
        { error: 'Error de autenticación con Twitter API' },
        { status: 401 }
      );
    } else {
      return NextResponse.json({ error: 'Error al obtener tweets de Twitter' }, { status: 500 });
    }
  }
}

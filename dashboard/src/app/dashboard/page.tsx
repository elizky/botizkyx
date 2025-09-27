import { MessageForm } from '@/components/MessageForm';
import { MessageList } from '@/components/MessageList';
import { HistoryList } from '@/components/HistoryList';
import { TwitterTweets } from '@/components/TwitterTweets';
import { Toaster } from '@/components/ui/sonner';
import { prisma } from '@/lib/database';

async function getPendingMessages() {
  return await prisma.message.findMany({
    where: { isPosted: false },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

async function getHistoryMessages() {
  return await prisma.message.findMany({
    where: { isPosted: true },
    orderBy: { postedAt: 'desc' },
    take: 50,
  });
}

export default async function Dashboard() {
  const [pendingMessages, historyMessages] = await Promise.all([
    getPendingMessages(),
    getHistoryMessages(),
  ]);
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold text-gray-900'>Bot Messages</h1>
            <a href='/api/logout' className='text-red-600 hover:text-red-800 font-medium'>
              Cerrar Sesión
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Add Message */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Agregar Mensaje</h2>
              <MessageForm />
            </div>

            {/* Pending Messages */}
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Mensajes Pendientes</h2>
              <MessageList messages={pendingMessages} type='pending' />
            </div>
          </div>

          {/* Middle Column - History */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Historial Local</h2>
              <HistoryList messages={historyMessages} />
            </div>
          </div>

          {/* Right Column - Twitter Tweets */}
          <div className='space-y-6'>
            <div className='bg-white rounded-lg shadow p-6'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4'>Tweets de Twitter</h2>
              <TwitterTweets />
            </div>
          </div>
        </div>
      </main>

      <Toaster />
    </div>
  );
}

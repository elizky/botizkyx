import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bot Dashboard</h1>
          <p className="text-gray-600 mt-2">Gestiona tus mensajes de Twitter</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">Página não encontrada</h2>
      <p className="text-gray-600 mb-8 text-center">Desculpe, não conseguimos encontrar a página que você está procurando.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
      >
        Voltar para Home
      </Link>
    </div>
  )
} 
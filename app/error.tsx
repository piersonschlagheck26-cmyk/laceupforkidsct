'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary-600 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-colors font-semibold"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="bg-gray-200 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}


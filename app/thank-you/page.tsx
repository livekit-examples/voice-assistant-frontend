"use client";

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation';
import urlConfig from "../config-url";

export default function ThankYouPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('room_id')
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 20 // Maximum number of retries
  const RETRY_INTERVAL = 3000 // 3 seconds between retries

  useEffect(() => {
    if (!roomId) {
      router.push('/')
      return
    }

    const fetchSummary = async () => {
      try {
        const response = await fetch(`${urlConfig.apiBaseUrl}/session/${roomId}/summary`)
        if (!response.ok) {
          throw new Error('Failed to fetch summary')
        }
        
        const data = await response.json()
        
        if (data.status === 'processing' || !data.summary) {
          if (retryCount < MAX_RETRIES) {
            // If still processing, retry after interval
            setTimeout(() => {
              setRetryCount(prev => prev + 1)
            }, RETRY_INTERVAL)
          } else {
            // If max retries reached, show error
            setLoading(false)
            setSummary('Summary generation timed out. Please try again.')
          }
        } else {
          // Summary is ready
          setLoading(false)
          setSummary(data.summary)
        }
      } catch (error) {
        console.error("Error fetching summary:", error)
        setLoading(false)
        setSummary('Failed to load summary. Please try again later.')
      }
    }

    fetchSummary()
  }, [roomId, router, retryCount])

  const handleStartNew = () => {
    router.push('/')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  // Loading state with progress indication
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfeff] text-black flex items-center justify-center p-4">
        <div className="w-full max-w-3xl">
          <div className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">Generating Summary</h2>
            <p className="text-gray-600 mb-2">
              Please wait while we prepare your conversation summary...
            </p>
            <p className="text-gray-500 text-sm">
              Time elapsed: {Math.floor(retryCount * RETRY_INTERVAL / 1000)}s
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fdfeff] text-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold mb-4">Thank You</h1>
          <p className="text-gray-600">We appreciate your participation in the meeting.</p>
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold mb-2">Meeting Summary</h2>
            <div className="h-64 overflow-y-auto">
              <p className="text-gray-600">{summary}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <button onClick={handleStartNew} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">Start New</button>
            <button onClick={handleGoHome} className="bg-gray-100 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors border border-gray-300">Go Home</button>
          </div>
        </div>
      </div>
    </div>
  )
}

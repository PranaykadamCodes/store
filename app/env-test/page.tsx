'use client'

import { useEffect, useState } from 'react'

export default function EnvTestPage() {
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      NODE_ENV: process.env.NODE_ENV,
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Variables Test</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Environment Variables:</h2>
          <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

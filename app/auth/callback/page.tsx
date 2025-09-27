'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth/login?error=auth_callback_failed')
          return
        }

        if (data.session) {
          // Check if user exists in our database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', data.session.user.email)
            .single()

          if (userError && userError.code === 'PGRST116') {
            // User doesn't exist, create them
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                email: data.session.user.email!,
                name: data.session.user.user_metadata?.name || data.session.user.email!.split('@')[0],
                passwordHash: '', // OAuth users don't have passwords
                role: 'customer', // Default role
              })

            if (insertError) {
              console.error('Error creating user:', insertError)
            }
          }

          // Redirect to dashboard
          router.push('/dashboard')
        } else {
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        router.push('/auth/login?error=unexpected_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

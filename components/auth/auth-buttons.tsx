'use client'

import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { LogIn, UserPlus, LogOut, User } from 'lucide-react'
import Link from 'next/link'

export function AuthButtons() {
  const { user, signOut } = useAuth()

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="outline">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Button 
          variant="outline" 
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/auth/login">
        <Button variant="outline">
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Button>
      </Link>
    </div>
  )
}

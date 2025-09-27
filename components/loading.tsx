import { Loader2 } from 'lucide-react'

interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Loading({ text = 'Loading...', size = 'md', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Loader2 className={`animate-spin mx-auto mb-2 ${sizeClasses[size]}`} />
        <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
      </div>
    </div>
  )
}

export function PageLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Loading text="Loading page..." size="lg" />
    </div>
  )
}

export function CardLoading() {
  return (
    <div className="p-8">
      <Loading text="Loading content..." size="md" />
    </div>
  )
}

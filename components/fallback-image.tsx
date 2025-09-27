'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Package } from 'lucide-react'

interface FallbackImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  fallbackText?: string
}

export function FallbackImage({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  fallbackText = 'Image'
}: FallbackImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleError = () => {
    setImageError(true)
    setImageLoading(false)
  }

  const handleLoad = () => {
    setImageLoading(false)
  }

  if (imageError) {
    return (
      <div 
        className={`bg-gray-100 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-gray-400">
          <Package className="h-8 w-8 mx-auto mb-2" />
          <span className="text-sm">{fallbackText}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">
            <Package className="h-8 w-8" />
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        onLoad={handleLoad}
        className="object-cover"
        style={{ opacity: imageLoading ? 0 : 1 }}
      />
    </div>
  )
}

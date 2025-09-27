'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, User, Calendar } from 'lucide-react'
import { Review } from '@/types'

interface ReviewsListProps {
  productId: string
  refreshTrigger?: number
}

export function ReviewsList({ productId, refreshTrigger }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [productId, refreshTrigger])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reviews?productId=${productId}`)
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews || [])
        setAverageRating(data.averageRating || 0)
        setTotalReviews(data.totalReviews || 0)
      } else {
        console.error('Failed to fetch reviews:', data.error)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-500 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading reviews...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Reviews</CardTitle>
          {totalReviews > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(Math.round(averageRating))}
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No reviews yet.</p>
            <p className="text-sm text-gray-500">Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.user?.name || 'Anonymous'}
                      </p>
                      <div className="flex items-center space-x-2">
                        {renderStars(review.rating)}
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {review.rating} star{review.rating > 1 ? 's' : ''}
                  </Badge>
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 mt-2">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

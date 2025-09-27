import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Truck, Shield, Heart, LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { AuthButtons } from '@/components/auth/auth-buttons'

export default function HomePage() {
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Setup Banner */}
      {!isSupabaseConfigured && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="container mx-auto">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm">
                  <strong>Setup Required:</strong> To use authentication features, please configure your Supabase credentials. 
                  See <a href="/SETUP.md" className="underline font-medium">SETUP.md</a> for instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">E-Commerce Store</span>
            </div>
            <AuthButtons />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Welcome to Our
            <span className="text-blue-600 dark:text-blue-400"> E-Commerce Store</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover amazing products with fast delivery, secure payments, and excellent customer service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8 py-6">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Why Choose Our Store?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Truck className="h-12 w-12 mx-auto text-blue-600" />
              <CardTitle>Fast Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get your orders delivered within 2-3 business days with our reliable shipping partners.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="h-12 w-12 mx-auto text-green-600" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your payment information is protected with bank-level security and encryption.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Star className="h-12 w-12 mx-auto text-yellow-600" />
              <CardTitle>Quality Products</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                We carefully curate our products to ensure the highest quality and customer satisfaction.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="h-12 w-12 mx-auto text-red-600" />
              <CardTitle>Customer Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                24/7 customer support to help you with any questions or concerns you may have.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Ready to Start Shopping?</CardTitle>
            <CardDescription className="text-blue-100 text-lg">
              Join thousands of satisfied customers and discover amazing products today.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Status Badge */}
      <div className="fixed bottom-4 right-4">
        <Badge variant="secondary" className="text-sm">
          🔐 Week 2: Authentication Complete
        </Badge>
      </div>
    </div>
  )
}

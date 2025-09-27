import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/lib/auth-context'
import { CartProvider } from '@/lib/cart-context'
import { WishlistProvider } from '@/lib/wishlist-context'
import { Toaster } from '@/components/ui/toaster'
import { ErrorBoundary } from '@/components/error-boundary'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'A modern e-commerce store built with Next.js, Supabase, and Stripe',
  keywords: ['ecommerce', 'shopping', 'online store', 'nextjs', 'supabase'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'E-Commerce Store',
    description: 'A modern e-commerce store built with Next.js, Supabase, and Stripe',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Commerce Store',
    description: 'A modern e-commerce store built with Next.js, Supabase, and Stripe',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ErrorBoundary>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <AuthProvider>
                  <CartProvider>
                    <WishlistProvider>
                      {children}
                      <Toaster />
                    </WishlistProvider>
                  </CartProvider>
                </AuthProvider>
              </ThemeProvider>
            </ErrorBoundary>
          </body>
        </html>
  )
}

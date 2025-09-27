'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Star, Truck, Shield, Heart, LogIn, UserPlus, Search, Menu, X, Phone, Mail, MapPin, ArrowRight, ChevronDown, Package, Zap, Cpu, Wifi, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { Navigation } from '@/components/navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Banner */}
      <div className="bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center text-sm">
            <span>Welcome to SHOP.CO - Your premium shopping destination</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <Navigation />

      {/* Hero Section */}
      <section className="bg-muted/30 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-6xl font-bold text-foreground leading-tight">
                  SHOP.CO
                </h1>
                <h2 className="text-4xl font-bold text-foreground">
                  FIND PRODUCTS THAT MATCHES YOUR STYLE
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Browse through our diverse range of meticulously crafted products, designed to bring out your individuality and cater to your sense of style.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link href="/catalog">
                  <Button size="lg" className="modern-button px-8 py-4 text-lg h-14">
                    <Package className="mr-2 h-5 w-5" />
                    Shop Now
                  </Button>
                </Link>
                <Link href="/catalog">
                  <Button size="lg" variant="outline" className="px-8 py-4 text-lg h-14">
                    Explore
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-muted-foreground">International Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">2,000+</div>
                  <div className="text-muted-foreground">High-Quality Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">30,000+</div>
                  <div className="text-muted-foreground">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-card rounded-2xl p-8 h-96 flex items-center justify-center modern-shadow-lg">
                <div className="text-center">
                  <div className="w-64 h-80 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg mx-auto mb-4 flex items-center justify-center relative modern-shadow">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-32 h-40 bg-background rounded-lg mx-auto mb-4 flex items-center justify-center shadow-lg modern-shadow">
                        <Package className="h-16 w-16 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">Quality Products</h3>
                      <p className="text-muted-foreground">Discover your style</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Brands */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">Trusted by Leading Brands</h3>
          </div>
          <div className="flex justify-center items-center space-x-8 text-muted-foreground text-sm">
            <span className="opacity-60">Premium Quality</span>
            <span className="opacity-60">•</span>
            <span className="opacity-60">Fast Delivery</span>
            <span className="opacity-60">•</span>
            <span className="opacity-60">24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully curated selection of premium products, handpicked for quality and style.
            </p>
          </div>
          
          <div className="text-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4">
                <Package className="mr-2 h-5 w-5" />
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Why Choose SHOP.CO?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience possible.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Free Shipping</h3>
              <p className="text-muted-foreground">Free delivery on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Secure Payment</h3>
              <p className="text-muted-foreground">Your payment information is always safe</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Customer Support</h3>
              <p className="text-muted-foreground">24/7 support to help you with any questions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">BROWSE BY CATEGORY</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Electronics', icon: <Smartphone className="h-12 w-12 text-primary" /> },
              { name: 'Fashion', icon: <Heart className="h-12 w-12 text-primary" /> },
              { name: 'Home & Garden', icon: <Package className="h-12 w-12 text-primary" /> },
              { name: 'Sports', icon: <Zap className="h-12 w-12 text-primary" /> }
            ].map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 cursor-pointer smooth-hover">
                <CardContent className="p-8">
                  <div className="w-24 h-24 bg-muted rounded-lg mx-auto mb-4 flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-foreground">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="transition-all duration-300 smooth-hover">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Exceptional quality and fast delivery. SHOP.CO has become my go-to for all my shopping needs."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">A</span>
                  </div>
                  <span className="font-semibold text-foreground">Alex Johnson</span>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 smooth-hover">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Great customer service and amazing product selection. Highly recommended!"
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">M</span>
                  </div>
                  <span className="font-semibold text-foreground">Maria Garcia</span>
                </div>
              </CardContent>
            </Card>
            <Card className="transition-all duration-300 smooth-hover">
              <CardContent className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The best online shopping experience I've had. Fast, reliable, and great prices."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-bold">D</span>
                  </div>
                  <span className="font-semibold text-foreground">David Chen</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-8">STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 px-4 py-3 rounded-l-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <Button className="bg-background text-foreground hover:bg-background/90 px-6 py-3 rounded-r-md rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted text-muted-foreground py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-foreground">SHOP.CO</h3>
              <p className="text-sm max-w-xs">
                We have products that suit your style and which you're proud to wear. From electronics to fashion.
              </p>
              <div className="flex space-x-3">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">t</Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">f</Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">i</Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">g</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-lg">COMPANY</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/works" className="hover:text-foreground">Works</Link></li>
                <li><Link href="/career" className="hover:text-foreground">Career</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-lg">HELP</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/customer-support" className="hover:text-foreground">Customer Support</Link></li>
                <li><Link href="/delivery-details" className="hover:text-foreground">Delivery Details</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-lg">FAQ</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/account" className="hover:text-foreground">Account</Link></li>
                <li><Link href="/manage-deliveries" className="hover:text-foreground">Manage Deliveries</Link></li>
                <li><Link href="/orders" className="hover:text-foreground">Orders</Link></li>
                <li><Link href="/payments" className="hover:text-foreground">Payments</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-foreground text-lg">RESOURCES</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/ebooks" className="hover:text-foreground">Free eBooks</Link></li>
                <li><Link href="/tutorials" className="hover:text-foreground">Development Tutorial</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">How to - Blog</Link></li>
                <li><Link href="/youtube" className="hover:text-foreground">Youtube Playlist</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>Shop.co © 2000-2023, All Rights Reserved</p>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">VISA</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">MC</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">PP</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">AP</div>
              <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">GP</div>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
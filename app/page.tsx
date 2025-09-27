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
      <div className="bg-primary text-primary-foreground py-3">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>Sign up and get 20% off to your first order.</span>
              <Link href="/auth/signup" className="underline hover:opacity-80 font-medium">
                Sign Up Now
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span>English</span>
              <span>Sign Up</span>
              <span>Login</span>
            </div>
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

      {/* Brand Logos */}
      <section className="py-8 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-16 text-muted-foreground text-xl font-bold">
            <span>VERSACE</span>
            <span>ZARA</span>
            <span>GUCCI</span>
            <span>PRADA</span>
            <span>Calvin Klein</span>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground">NEW ARRIVALS</h2>
            <Button variant="outline">
              View All
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="group hover:shadow-lg transition-all duration-300 smooth-hover">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">-20%</Badge>
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="font-semibold text-lg text-foreground">Product Name {item}</h3>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground">(4.5)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-foreground">$120</span>
                      <span className="text-sm text-muted-foreground line-through">$150</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Top Selling Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground">TOP SELLING</h2>
            <Button variant="outline">
              View All
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="group hover:shadow-lg transition-all duration-300 smooth-hover">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="space-y-2 p-4">
                    <h3 className="font-semibold text-lg text-foreground">Product Name {item}</h3>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-muted-foreground">(4.5)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-foreground">$120</span>
                      <span className="text-sm text-muted-foreground line-through">$150</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* Our Happy Customers */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold text-foreground">OUR HAPPY CUSTOMERS</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="transition-all duration-300 smooth-hover">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "I'm blown away by the quality and style of the products I received from Shop.co. From electronics to fashion, every piece I've bought has exceeded my expectations."
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground text-sm font-bold">✓</span>
                    </div>
                    <span className="font-semibold text-foreground">Sarah M.</span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
      <footer className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">SHOP.CO</h3>
              <p className="text-muted-foreground">
                We have products that suits your needs and which you're proud to use. From electronics to fashion.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  t
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Facebook</span>
                  f
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Instagram</span>
                  i
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">GitHub</span>
                  g
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">COMPANY</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/about" className="block hover:text-foreground">About</Link>
                <Link href="/features" className="block hover:text-foreground">Features</Link>
                <Link href="/works" className="block hover:text-foreground">Works</Link>
                <Link href="/career" className="block hover:text-foreground">Career</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">HELP</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/support" className="block hover:text-foreground">Customer Support</Link>
                <Link href="/delivery" className="block hover:text-foreground">Delivery Details</Link>
                <Link href="/terms" className="block hover:text-foreground">Terms & Conditions</Link>
                <Link href="/privacy" className="block hover:text-foreground">Privacy Policy</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">FAQ</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/account" className="block hover:text-foreground">Account</Link>
                <Link href="/manage-deliveries" className="block hover:text-foreground">Manage Deliveries</Link>
                <Link href="/orders" className="block hover:text-foreground">Orders</Link>
                <Link href="/payments" className="block hover:text-foreground">Payments</Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-foreground">RESOURCES</h4>
              <div className="space-y-2 text-muted-foreground">
                <Link href="/ebook" className="block hover:text-foreground">Free eBook</Link>
                <Link href="/tutorial" className="block hover:text-foreground">Development Tutorial</Link>
                <Link href="/blog" className="block hover:text-foreground">How to - Blog</Link>
                <Link href="/youtube" className="block hover:text-foreground">Youtube Playlist</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8 flex justify-between items-center">
            <p className="text-muted-foreground">Shop.co © 2000-2023, All Rights Reserved</p>
                <div className="flex space-x-4">
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">VISA</div>
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">MC</div>
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">PP</div>
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">AP</div>
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold text-muted-foreground">GP</div>
                </div>
          </div>
        </div>
      </footer>

      {/* Status Badge */}
      <div className="fixed bottom-4 right-4">
        <Badge variant="secondary" className="text-sm">
          🛍️ Clean Theme - Black/Cream
        </Badge>
      </div>
    </div>
  )
}
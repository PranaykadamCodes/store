'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SalesChart } from '@/components/analytics/sales-chart'
import { OrderStatusChart } from '@/components/analytics/order-status-chart'
import { TopProductsChart } from '@/components/analytics/top-products-chart'
import { MetricsGrid } from '@/components/analytics/metrics-card'
import { Loader2, Download, RefreshCw } from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    totalCustomers: number
    newCustomers: number
    totalProducts: number
    activeProducts: number
    outOfStockProducts: number
    revenueGrowth: number
  }
  charts: {
    dailySales: Array<{
      date: string
      revenue: number
      orders: number
    }>
    orderStatusBreakdown: Record<string, number>
    topProducts: Array<{
      name: string
      revenue: number
      quantity: number
    }>
  }
  metrics: {
    conversionRate: number
    averageOrderValue: number
    revenueGrowth: number
  }
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('30')

  useEffect(() => {
    if (user?.user_metadata?.role === 'admin') {
      fetchAnalytics()
    } else {
      setError('Access denied. Admin privileges required.')
      setLoading(false)
    }
  }, [user, period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${period}`)
      const data = await response.json()
      
      if (response.ok) {
        setAnalytics(data.analytics)
      } else {
        setError(data.error || 'Failed to fetch analytics')
      }
    } catch (err) {
      setError('Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    // TODO: Implement data export functionality
    console.log('Export analytics data')
  }

  if (!user || user.user_metadata?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600">You need admin privileges to view analytics.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Button onClick={fetchAnalytics}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your store's performance and insights</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        {analytics && (
          <div className="mb-8">
            <MetricsGrid metrics={analytics.overview} />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.charts.dailySales && (
                <SalesChart data={analytics.charts.dailySales} />
              )}
            </CardContent>
          </Card>

          {/* Order Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.charts.orderStatusBreakdown && (
                <OrderStatusChart data={analytics.charts.orderStatusBreakdown} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Products Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics?.charts.topProducts && (
              <TopProductsChart data={analytics.charts.topProducts} />
            )}
          </CardContent>
        </Card>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                <span className={`font-semibold ${analytics?.overview.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics?.overview.revenueGrowth > 0 ? '+' : ''}{analytics?.overview.revenueGrowth.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Conversion Rate</span>
                <span className="font-semibold">{analytics?.metrics.conversionRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Order Value</span>
                <span className="font-semibold">${analytics?.overview.averageOrderValue.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Products</span>
                <span className="font-semibold">{analytics?.overview.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Products</span>
                <span className="font-semibold text-green-600">{analytics?.overview.activeProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Out of Stock</span>
                <span className="font-semibold text-red-600">{analytics?.overview.outOfStockProducts}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="font-semibold">{analytics?.overview.totalCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">New This Month</span>
                <span className="font-semibold text-blue-600">{analytics?.overview.newCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Orders per Customer</span>
                <span className="font-semibold">{analytics?.overview.totalCustomers > 0 ? (analytics?.overview.totalOrders / analytics?.overview.totalCustomers).toFixed(1) : 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

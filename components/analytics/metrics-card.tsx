'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  description?: string
}

export function MetricsCard({ title, value, change, icon, description }: MetricsCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {isPositive && <TrendingUp className="h-3 w-3 text-green-600" />}
            {isNegative && <TrendingDown className="h-3 w-3 text-red-600" />}
            <span className={isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : ''}>
              {change > 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span>from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function MetricsGrid({ metrics }: { metrics: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Total Revenue"
        value={`$${metrics.totalRevenue?.toLocaleString() || 0}`}
        change={metrics.revenueGrowth}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        description="Revenue from all orders"
      />
      <MetricsCard
        title="Total Orders"
        value={metrics.totalOrders?.toLocaleString() || 0}
        icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
        description="Number of completed orders"
      />
      <MetricsCard
        title="Average Order Value"
        value={`$${metrics.averageOrderValue?.toFixed(2) || 0}`}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        description="Average revenue per order"
      />
      <MetricsCard
        title="Total Customers"
        value={metrics.totalCustomers?.toLocaleString() || 0}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Registered users"
      />
      <MetricsCard
        title="Active Products"
        value={metrics.activeProducts?.toLocaleString() || 0}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        description="Products available for sale"
      />
      <MetricsCard
        title="New Customers"
        value={metrics.newCustomers?.toLocaleString() || 0}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        description="Customers registered this month"
      />
      <MetricsCard
        title="Out of Stock"
        value={metrics.outOfStockProducts?.toLocaleString() || 0}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
        description="Products with zero stock"
      />
      <MetricsCard
        title="Conversion Rate"
        value={`${metrics.conversionRate?.toFixed(1) || 0}%`}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        description="Orders per customer"
      />
    </div>
  )
}

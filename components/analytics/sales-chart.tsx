'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SalesChartProps {
  data: Array<{
    date: string
    revenue: number
    orders: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value, name) => [
              name === 'revenue' ? `$${value}` : value,
              name === 'revenue' ? 'Revenue' : 'Orders'
            ]}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#8884d8" 
            strokeWidth={2}
            name="Revenue"
          />
          <Line 
            type="monotone" 
            dataKey="orders" 
            stroke="#82ca9d" 
            strokeWidth={2}
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

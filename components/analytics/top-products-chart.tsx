'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TopProductsChartProps {
  data: Array<{
    name: string
    revenue: number
    quantity: number
  }>
}

export function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => [
              name === 'revenue' ? `$${value}` : value,
              name === 'revenue' ? 'Revenue' : 'Quantity Sold'
            ]}
          />
          <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
          <Bar dataKey="quantity" fill="#82ca9d" name="Quantity" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

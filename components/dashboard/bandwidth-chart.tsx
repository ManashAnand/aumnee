'use client';

import { DeveloperMetrics } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BandwidthChartProps {
  metrics: DeveloperMetrics[];
}

export function BandwidthChart({ metrics }: BandwidthChartProps) {
  const chartData = metrics.map(metric => ({
    developer: metric.name.charAt(0).toUpperCase() + metric.name.slice(1),
    'Adjusted Bandwidth': metric.adjustedBandwidth,
    'Delivered SP': metric.deliveredStoryPoints,
    'Velocity': metric.effectiveVelocity
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name === 'Velocity' ? `${entry.value.toFixed(2)}x` : entry.value.toFixed(1)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bandwidth vs Delivered Story Points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="developer" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="Adjusted Bandwidth" 
                fill="#3b82f6" 
                name="Adjusted Bandwidth"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="Delivered SP" 
                fill="#10b981" 
                name="Delivered SP"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
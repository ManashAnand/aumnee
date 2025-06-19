'use client';

import { DeveloperMetrics } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Target, TrendingUp } from 'lucide-react';

interface SummaryStatsProps {
  metrics: DeveloperMetrics[];
}

export function SummaryStats({ metrics }: SummaryStatsProps) {
  const totalDevelopers = metrics.length;
  const totalLeaveDays = metrics.reduce((sum, m) => sum + m.leaves, 0);
  const totalDelivered = metrics.reduce((sum, m) => sum + m.deliveredStoryPoints, 0);
  const totalAdjustedBandwidth = metrics.reduce((sum, m) => sum + m.adjustedBandwidth, 0);
  const averageVelocity = totalAdjustedBandwidth > 0 ? totalDelivered / totalAdjustedBandwidth : 0;

  const stats = [
    {
      title: "Total Developers",
      value: totalDevelopers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Total Leave Days",
      value: totalLeaveDays,
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "Total Delivered SP",
      value: totalDelivered,
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Team Velocity",
      value: `${averageVelocity.toFixed(2)}x`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
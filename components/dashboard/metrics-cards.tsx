'use client';

import { DeveloperMetrics } from '@/types/dashboard';
import { formatVelocity, getVelocityColor } from '@/lib/dashboard-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Target, TrendingUp } from 'lucide-react';

interface MetricsCardsProps {
  metrics: DeveloperMetrics[];
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.name} className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-blue-600" />
              <span className="capitalize">{metric.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm text-gray-500">Leave Days</p>
                  <p className="font-semibold text-red-600">{metric.leaves} days</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Available SP</p>
                  <p className="font-semibold text-green-600">{metric.adjustedBandwidth.toFixed(1)}</p>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Delivered Story Points</p>
                  <p className="text-2xl font-bold text-blue-600">{metric.deliveredStoryPoints}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Effective Velocity</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-gray-400" />
                    <span className={`text-2xl font-bold ${getVelocityColor(metric.effectiveVelocity)}`}>
                      {formatVelocity(metric.effectiveVelocity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Performance</span>
                <Badge 
                  variant={metric.effectiveVelocity >= 0.9 ? "default" : metric.effectiveVelocity >= 0.7 ? "secondary" : "destructive"}
                >
                  {metric.effectiveVelocity >= 0.9 ? "Excellent" : metric.effectiveVelocity >= 0.7 ? "Good" : "Needs Improvement"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
'use client';

import { DeveloperMetrics } from '@/types/dashboard';
import { 
  formatVelocity, 
  getVelocityColor, 
  getVelocityBadgeColor,
  formatContribution,
  getContributionBadgeColor 
} from '@/lib/dashboard-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricsTableProps {
  metrics: DeveloperMetrics[];
}

export function MetricsTable({ metrics }: MetricsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Developer</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Leave Period</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Leave Days</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Available SP</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Delivered SP</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Sprint Contribution</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">Effective Velocity</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={metric.name} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <td className="py-4 px-4">
                    <div className="font-medium text-gray-900">{metric.name}</div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-sm text-gray-600">
                      {metric.leaveDetails}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {metric.leaves} days
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="font-medium text-gray-900">
                            {metric.adjustedBandwidth.toFixed(1)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>After 20% deduction for bugs</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="font-medium text-blue-600">
                      {metric.deliveredStoryPoints}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge className={getContributionBadgeColor(metric.sprintContribution)}>
                      {formatContribution(metric.sprintContribution)}
                    </Badge>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <Badge className={getVelocityBadgeColor(metric.effectiveVelocity)}>
                      {formatVelocity(metric.effectiveVelocity)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { JiraIssue, LeaveDays, DeveloperMetrics } from '@/types/dashboard';
import { calculateDeveloperMetrics } from '@/lib/dashboard-utils';
import { MetricsTable } from '@/components/dashboard/metrics-table';
import { MetricsCards } from '@/components/dashboard/metrics-cards';
import { BandwidthChart } from '@/components/dashboard/bandwidth-chart';
import { SummaryStats } from '@/components/dashboard/summary-stats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Table, Grid3X3 } from 'lucide-react';

export default function DashboardPage() {
  const [jiraIssues, setJiraIssues] = useState<JiraIssue[]>([]);
  const [leaveDays, setLeaveDays] = useState<LeaveDays>({});
  const [metrics, setMetrics] = useState<DeveloperMetrics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [jiraResponse, leaveResponse] = await Promise.all([
          fetch('/api/jira-issues'),
          fetch('/api/leave-days')
        ]);

        const jiraData = await jiraResponse.json();
        const leaveData = await leaveResponse.json();

        setJiraIssues(jiraData);
        setLeaveDays(leaveData);

        const calculatedMetrics = calculateDeveloperMetrics(jiraData, leaveData);
        setMetrics(calculatedMetrics);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sprint Dashboard</h1>
          <p className="mt-2 text-gray-600">Engineer bandwidth and velocity analytics for sprint 07/05 - 10/06</p>
        </div>

        {/* Summary Stats */}
        <SummaryStats metrics={metrics} />

        {/* Chart */}
        <div className="mb-8">
          <BandwidthChart metrics={metrics} />
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table className="h-4 w-4" />
              Table View
            </TabsTrigger>
            <TabsTrigger value="cards" className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4" />
              Card View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="mt-6">
            <MetricsTable metrics={metrics} />
          </TabsContent>
          
          <TabsContent value="cards" className="mt-6">
            <MetricsCards metrics={metrics} />
          </TabsContent>
        </Tabs>

        {/* Additional Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Calculation Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bandwidth Calculation</h4>
                <ul className="space-y-1">
                  <li>• Total working days: 10</li>
                  <li>• Available days = 10 - leave days</li>
                  <li>• Raw bandwidth = available days × 4 SP/day</li>
                  <li>• Adjusted bandwidth = raw bandwidth × 0.8 (20% deduction for bugs)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Velocity Calculation</h4>
                <ul className="space-y-1">
                  <li>• Delivered SP = sum of completed story points</li>
                  <li>• Effective velocity = delivered SP ÷ adjusted bandwidth</li>
                  <li>• 1.0x = 100% efficiency</li>
                  <li>• Only "Done" status issues count as delivered</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, BarChart3, Table, Grid3X3 } from 'lucide-react';

export default function DashboardPage() {
  const [jiraIssues, setJiraIssues] = useState<JiraIssue[]>([]);
  const [leaveDays, setLeaveDays] = useState<LeaveDays>({});
  const [metrics, setMetrics] = useState<DeveloperMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const jiraResponse = await fetch('/api/jira');
        if (!jiraResponse.ok) {
          throw new Error('Failed to fetch Jira data');
        }
        const jiraData = await jiraResponse.json();
        console.log("jiraData from frontend ", jiraData)
        const leaveResponse = await fetch('/api/leave-days');
        if (!leaveResponse.ok) {
          throw new Error('Failed to fetch leave data');
        }
        const leaveData = await leaveResponse.json();
        console.log("leaveData from frontend ", leaveData)

        setJiraIssues(jiraData);
        setLeaveDays(leaveData);

        const calculatedMetrics = calculateDeveloperMetrics(jiraData, leaveData);
        console.log("calculatedMetrics from frontend ", calculatedMetrics)
        setMetrics(calculatedMetrics);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
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
          <p className="mt-4 text-gray-600">Loading sprint data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sprint Analytics</h1>
          <p className="mt-2 text-gray-600">
            Sprint Period: 07/05 - 10/06 • {jiraIssues.length} Issues • {metrics.length} Developers
          </p>
        </div>
 
        <SummaryStats metrics={metrics} />

        <div className="mb-8">
          <BandwidthChart metrics={metrics} />
        </div>

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

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sprint Analytics Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bandwidth Calculation</h4>
                <ul className="space-y-1">
                  <li>• Working days calculated excluding weekends</li>
                  <li>• Available days = sprint days - leave days</li>
                  <li>• Raw bandwidth = available days × 4 SP/day</li>
                  <li>• Adjusted bandwidth = raw bandwidth × 0.8 (20% buffer)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Performance Metrics</h4>
                <ul className="space-y-1">
                  <li>• Delivered SP = completed story points in sprint</li>
                  <li>• Effective velocity = delivered SP ÷ adjusted bandwidth</li>
                  <li>• Sprint contribution based on tech start/close dates</li>
                  <li>• Leave impact calculated for sprint period only</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
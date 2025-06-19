import { NextResponse } from 'next/server';
import { LeaveEntry } from '@/types/dashboard';
import { calculateLeaveDaysInSprint, formatDateRange } from '@/lib/utils';

// Mock leave data from the Google sheet
const mockLeaveEntries: LeaveEntry[] = [
  { developer: "Aakarsh Mahajan", startDate: "09/06", endDate: "15/06" },
  { developer: "Yash Moda", startDate: "01/05", endDate: "10/05" },
  { developer: "Naman", startDate: "10/05", endDate: "20/05" },
  { developer: "Sumit Wadhwa", startDate: "08/05", endDate: "31/05" },
  { developer: "Ayushman Bajpayee", startDate: "12/06", endDate: "16/06" },
  { developer: "Anushri Laddha", startDate: "05/06", endDate: "10/06" },
  { developer: "Priyanshu Gupta", startDate: "11/06", endDate: "15/06" }
];

export async function GET() {
  // Calculate leave days within sprint period for each developer
  const leaveDaysMap = mockLeaveEntries.reduce((acc, entry) => {
    const leaveDays = calculateLeaveDaysInSprint(entry.startDate, entry.endDate);
    acc[entry.developer] = {
      days: leaveDays,
      period: formatDateRange(entry.startDate, entry.endDate)
    };
    return acc;
  }, {} as { [key: string]: { days: number; period: string } });

  return NextResponse.json(leaveDaysMap);
}
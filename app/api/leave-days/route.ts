import { NextResponse } from 'next/server';
import { LeaveDays } from '@/types/dashboard';

// Mock leave data for the sprint period
const mockLeaveDays: LeaveDays = {
  "manash": 2,
  "aakarsh": 1,
  "priya": 0,
  "raj": 3,
  "sarah": 1
};

export async function GET() {
  return NextResponse.json(mockLeaveDays);
}
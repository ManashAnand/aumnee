import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LeaveEntry } from '@/types/dashboard';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert DD/MM format to YYYY-MM-DD
export function convertToISODate(date: string, year: string = "2024"): string {
  const [day, month] = date.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Calculate working days between two dates (excluding weekends)
export function getWorkingDays(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let workingDays = 0;
  
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++;
    current.setDate(current.getDate() + 1);
  }
  
  return workingDays;
}

// Calculate leave days within sprint period
export function calculateLeaveDaysInSprint(
  leaveStart: string, 
  leaveEnd: string, 
  sprintStart: string = "2024-05-07", 
  sprintEnd: string = "2024-06-10"
): number {
  const leaveStartDate = new Date(convertToISODate(leaveStart));
  const leaveEndDate = new Date(convertToISODate(leaveEnd));
  const sprintStartDate = new Date(sprintStart);
  const sprintEndDate = new Date(sprintEnd);

  // If leave period is outside sprint period
  if (leaveEndDate < sprintStartDate || leaveStartDate > sprintEndDate) {
    return 0;
  }

  // Adjust dates to sprint period if needed
  const effectiveStart = leaveStartDate < sprintStartDate ? sprintStartDate : leaveStartDate;
  const effectiveEnd = leaveEndDate > sprintEndDate ? sprintEndDate : leaveEndDate;

  return getWorkingDays(effectiveStart.toISOString().split('T')[0], effectiveEnd.toISOString().split('T')[0]);
}

// Format date range for display
export function formatDateRange(startDate: string, endDate: string): string {
  return `${startDate} - ${endDate}`;
}

// Calculate sprint contribution percentage
export function calculateSprintContribution(
  techStartDate: string,
  techCloseDate: string,
  sprintStart: string = "2024-05-07",
  sprintEnd: string = "2024-06-10"
): number {
  const start = new Date(Math.max(new Date(techStartDate).getTime(), new Date(sprintStart).getTime()));
  const end = techCloseDate ? new Date(Math.min(new Date(techCloseDate).getTime(), new Date(sprintEnd).getTime())) : new Date(sprintEnd);
  
  const totalSprintDays = getWorkingDays(sprintStart, sprintEnd);
  const contributedDays = getWorkingDays(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  
  return (contributedDays / totalSprintDays) * 100;
}

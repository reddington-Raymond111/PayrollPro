import { format, parse, isValid, addMonths } from 'date-fns';

// Convert a date string or Date object to a formatted string
export function formatDate(date: string | Date, formatString: string = 'MMM dd, yyyy'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (!isValid(dateObj)) return 'Invalid date';
  
  return format(dateObj, formatString);
}

// Format currency with $ and 2 decimal places
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Generate a payroll period name (e.g., "January 2023")
export function generatePayrollPeriodName(date: Date = new Date()): string {
  return format(date, 'MMMM yyyy');
}

// Calculate pay dates for a given period start date
export function calculatePayDates(
  startDate: Date,
  paymentSchedule: 'monthly' | 'biweekly' | 'weekly' = 'monthly'
): { startDate: Date; endDate: Date; payDate: Date } {
  let endDate: Date;
  let payDate: Date;
  
  if (paymentSchedule === 'monthly') {
    // End date is the last day of the month
    endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    // Pay date is the last day of the month
    payDate = new Date(endDate);
  } else if (paymentSchedule === 'biweekly') {
    // End date is 14 days after start date
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13);
    // Pay date is 3 days after end date
    payDate = new Date(endDate);
    payDate.setDate(endDate.getDate() + 3);
  } else {
    // End date is 7 days after start date
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    // Pay date is 2 days after end date
    payDate = new Date(endDate);
    payDate.setDate(endDate.getDate() + 2);
  }
  
  return { startDate, endDate, payDate };
}

// Generate next payroll period based on the last period
export function generateNextPayrollPeriod(
  lastPeriod: { startDate: string; endDate: string; payDate: string },
  paymentSchedule: 'monthly' | 'biweekly' | 'weekly' = 'monthly'
): { name: string; startDate: Date; endDate: Date; payDate: Date } {
  const lastEndDate = new Date(lastPeriod.endDate);
  
  // Start date is the day after the last end date
  const startDate = new Date(lastEndDate);
  startDate.setDate(lastEndDate.getDate() + 1);
  
  const { endDate, payDate } = calculatePayDates(startDate, paymentSchedule);
  
  return {
    name: generatePayrollPeriodName(startDate),
    startDate,
    endDate,
    payDate
  };
}

// Parse a string date and handle invalid values
export function parseDateSafe(dateString: string, formatStr: string = 'yyyy-MM-dd'): Date | null {
  if (!dateString) return null;
  
  try {
    const parsed = parse(dateString, formatStr, new Date());
    return isValid(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

// Calculate next quarterly tax due date
export function calculateNextTaxDueDate(): Date {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Quarterly tax dates: April 15, June 15, September 15, January 15
  const quarters = [
    { month: 3, day: 15 },  // April 15
    { month: 5, day: 15 },  // June 15
    { month: 8, day: 15 },  // September 15
    { month: 0, day: 15 }   // January 15 of next year
  ];
  
  // Find the next due date
  for (const quarter of quarters) {
    const dueDate = new Date(currentYear, quarter.month, quarter.day);
    
    if (dueDate > today) {
      return dueDate;
    }
  }
  
  // If no due date is in the current year, return January 15 of next year
  return new Date(currentYear + 1, 0, 15);
}

// Generate bank file format (simplified example)
export function generateBankFileFormat(
  entries: Array<{
    employeeName: string;
    bankName?: string;
    accountNumber?: string;
    amount: number;
    reference: string;
  }>
): string {
  // This is a simplified CSV format; real bank files would have specific formats
  let csv = 'Employee,Bank,Account,Amount,Reference\n';
  
  entries.forEach(entry => {
    csv += `"${entry.employeeName}","${entry.bankName || ''}","${entry.accountNumber || ''}",${entry.amount.toFixed(2)},"${entry.reference}"\n`;
  });
  
  return csv;
}

// Calculate annual salary from monthly amount
export function calculateAnnualSalary(monthlySalary: number): number {
  return monthlySalary * 12;
}

// Calculate monthly salary from annual amount
export function calculateMonthlySalary(annualSalary: number): number {
  return annualSalary / 12;
}

// Status codes to human-readable format
export function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    'draft': 'Draft',
    'processing': 'Processing',
    'completed': 'Completed',
    'pending': 'Pending',
    'processed': 'Processed',
    'paid': 'Paid',
    'active': 'Active',
    'inactive': 'Inactive'
  };
  
  return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

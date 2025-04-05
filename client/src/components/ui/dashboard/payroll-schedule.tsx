import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface PayrollPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: string;
  runDate: string | null;
}

export function PayrollSchedule() {
  const { data: periods, isLoading } = useQuery({
    queryKey: ['/api/payroll-periods'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Payroll Schedule</h2>
        <Button variant="link" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View All
        </Button>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead>
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Period</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Run Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Pay Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-sm text-neutral-500">
                    Loading payroll schedule...
                  </td>
                </tr>
              ) : periods && periods.length > 0 ? (
                periods.slice(0, 3).map((period: PayrollPeriod) => (
                  <tr key={period.id}>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">{period.name}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <StatusBadge status={period.status} />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      {period.runDate ? format(new Date(period.runDate), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      {format(new Date(period.payDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <Button variant="link" className="text-primary-600 hover:text-primary-700 font-medium">
                        {period.status === 'completed' ? 'View' : 'Review'}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-sm text-neutral-500">
                    No payroll periods found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'processing':
      bgColor = 'bg-warning/20';
      textColor = 'text-warning';
      break;
    case 'completed':
      bgColor = 'bg-success/20';
      textColor = 'text-success';
      break;
    case 'draft':
      bgColor = 'bg-neutral-200';
      textColor = 'text-neutral-600';
      break;
    default:
      bgColor = 'bg-neutral-200';
      textColor = 'text-neutral-600';
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium ${bgColor} ${textColor} rounded-full`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default PayrollSchedule;

import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PayslipViewer from './payslip-viewer';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PayrollEntry {
  id: number;
  employeeId: number;
  periodId: number;
  grossAmount: number;
  netAmount: number;
  deductions: number;
  status: string;
  employee?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    position: string;
  };
}

interface PayrollPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: string;
  runDate: string | null;
}

interface PayrollTableProps {
  entries: PayrollEntry[];
  period: PayrollPeriod;
  isLoading: boolean;
  onRefresh: () => void;
  canProcess: boolean;
}

export function PayrollTable({ entries, period, isLoading, onRefresh, canProcess }: PayrollTableProps) {
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [openPayslip, setOpenPayslip] = useState(false);
  const [processingPayroll, setProcessingPayroll] = useState(false);
  const [confirmRunPayroll, setConfirmRunPayroll] = useState(false);
  const { toast } = useToast();

  const handleViewPayslip = (entry: PayrollEntry) => {
    setSelectedEntry(entry);
    setOpenPayslip(true);
  };

  const runPayroll = async () => {
    setProcessingPayroll(true);
    try {
      await apiRequest('POST', `/api/payroll-process/${period.id}`, undefined);
      toast({
        title: 'Payroll Processed',
        description: 'Payroll has been processed successfully.',
      });
      onRefresh();
    } catch (error) {
      console.error('Error processing payroll:', error);
      toast({
        title: 'Error',
        description: 'Failed to process payroll. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingPayroll(false);
      setConfirmRunPayroll(false);
    }
  };

  const handleExportBankFile = async () => {
    try {
      toast({
        title: 'Exporting Bank File',
        description: 'Bank file is being generated...'
      });
      
      const res = await fetch(`/api/payroll/export/${period.id}`, {
        credentials: 'include'
      });
      
      if (!res.ok) {
        throw new Error('Failed to export bank file');
      }
      
      const data = await res.json();
      
      // In a real app, this would create a downloadable file
      // For demo, we just show success and log the data
      console.log('Bank file data:', data);
      
      toast({
        title: 'Bank File Generated',
        description: 'Bank file has been generated successfully.'
      });
    } catch (error) {
      console.error('Error exporting bank file:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate bank file. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleStatusChange = async (entryId: number, newStatus: string) => {
    try {
      await apiRequest('PUT', `/api/payroll-entries/${entryId}`, { status: newStatus });
      toast({
        title: 'Status Updated',
        description: 'Payroll entry status has been updated.'
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update entry status. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'processed':
        return 'bg-info/20 text-info';
      case 'paid':
        return 'bg-success/20 text-success';
      default:
        return 'bg-neutral-200 text-neutral-600';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            Payroll Entries - {period.name}
          </h2>
          <p className="text-sm text-neutral-500">
            Pay Date: {format(new Date(period.payDate), 'MMM dd, yyyy')}
          </p>
        </div>
        <div className="flex space-x-2">
          {period.status === 'draft' && canProcess && (
            <Button
              onClick={() => setConfirmRunPayroll(true)}
              disabled={processingPayroll}
              className="bg-primary-500 hover:bg-primary-600"
            >
              {processingPayroll ? 'Processing...' : 'Run Payroll'}
            </Button>
          )}
          {period.status === 'completed' && (
            <Button
              onClick={handleExportBankFile}
              variant="outline"
              className="border-primary-500 text-primary-600"
            >
              Export Bank File
            </Button>
          )}
          <Button onClick={onRefresh} variant="ghost">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9.00001C19.9828 7.5668 19.1209 6.28542 17.9845 5.27543C16.8482 4.26545 15.4745 3.55984 13.9917 3.22427C12.5089 2.8887 10.9652 2.93436 9.50481 3.35685C8.04437 3.77935 6.71475 4.56433 5.64 5.64001L1 10M23 14L18.36 18.36C17.2853 19.4357 15.9556 20.2207 14.4952 20.6432C13.0348 21.0657 11.4911 21.1113 10.0083 20.7758C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Gross Amount</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                  <div className="mt-2 text-sm text-neutral-500">Loading payroll entries...</div>
                </TableCell>
              </TableRow>
            ) : entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="text-neutral-500">
                    {period.status === 'draft' 
                      ? 'No payroll entries found. Click "Run Payroll" to process payroll for this period.' 
                      : 'No payroll entries found for this period.'}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {entry.employee 
                      ? `${entry.employee.firstName} ${entry.employee.lastName}` 
                      : `Employee #${entry.employeeId}`}
                  </TableCell>
                  <TableCell>{entry.employee?.department || '-'}</TableCell>
                  <TableCell className="text-right">${entry.grossAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${entry.deductions.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-medium">${entry.netAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    {canProcess ? (
                      <Select
                        defaultValue={entry.status}
                        onValueChange={(value) => handleStatusChange(entry.id, value)}
                      >
                        <SelectTrigger className={`w-[110px] h-8 text-xs ${getStatusClasses(entry.status)}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processed">Processed</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusClasses(entry.status)}`}>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      onClick={() => handleViewPayslip(entry)}
                      variant="ghost"
                      size="sm"
                    >
                      View Payslip
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Payslip Dialog */}
      <Dialog open={openPayslip} onOpenChange={setOpenPayslip}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Employee Payslip</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <PayslipViewer entryId={selectedEntry.id} periodName={period.name} />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Run Payroll Dialog */}
      <AlertDialog open={confirmRunPayroll} onOpenChange={setConfirmRunPayroll}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Run Payroll for {period.name}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will calculate payroll for all employees based on their salary structures. 
              You can still make adjustments after processing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runPayroll} disabled={processingPayroll}>
              {processingPayroll ? 'Processing...' : 'Run Payroll'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PayrollTable;

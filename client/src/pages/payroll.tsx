import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import PayrollTable from '@/components/ui/payroll/payroll-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { format, parse } from 'date-fns';

interface PayrollPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: string;
  runDate: string | null;
}

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

// Schema for creating a new payroll period
const payrollPeriodSchema = z.object({
  name: z.string().min(1, "Period name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  payDate: z.string().min(1, "Pay date is required"),
});

type PayrollPeriodFormValues = z.infer<typeof payrollPeriodSchema>;

export default function Payroll() {
  const { toast } = useToast();
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [isNewPeriodDialogOpen, setIsNewPeriodDialogOpen] = useState(false);

  // Fetch payroll periods
  const { 
    data: periods,
    isLoading: periodsLoading,
    refetch: refetchPeriods
  } = useQuery<PayrollPeriod[]>({
    queryKey: ['/api/payroll-periods'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch current user - to determine whether user can process payroll
  const { data: currentUser } = useQuery({
    queryKey: ['/api/auth/me'],
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Determine if the current user can process payroll
  const canProcessPayroll = currentUser?.role === 'admin' || currentUser?.role === 'payroll_manager';

  // Get entries for the selected period
  const {
    data: entries,
    isLoading: entriesLoading,
    refetch: refetchEntries
  } = useQuery<PayrollEntry[]>({
    queryKey: ['/api/payroll-entries', { periodId: selectedPeriodId }],
    staleTime: 1000 * 60, // 1 minute
    enabled: !!selectedPeriodId,
  });

  // Setup form for new period
  const form = useForm<PayrollPeriodFormValues>({
    resolver: zodResolver(payrollPeriodSchema),
    defaultValues: {
      name: format(new Date(), 'MMMM yyyy'),
      startDate: format(new Date(), 'yyyy-MM-01'),
      endDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
      payDate: format(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0), 'yyyy-MM-dd'),
    },
  });

  // Handle period selection
  const handlePeriodChange = (periodId: string) => {
    setSelectedPeriodId(Number(periodId));
  };

  // Get the currently selected period
  const selectedPeriod = periods?.find(p => p.id === selectedPeriodId);

  // Refresh data
  const handleRefresh = () => {
    refetchPeriods();
    if (selectedPeriodId) {
      refetchEntries();
    }
  };

  // Create a new payroll period
  const onSubmitNewPeriod = async (data: PayrollPeriodFormValues) => {
    try {
      // Format dates to ISO strings
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        payDate: new Date(data.payDate).toISOString(),
        status: 'draft',
      };

      const response = await apiRequest('POST', '/api/payroll-periods', formattedData);
      const newPeriod = await response.json();
      
      toast({
        title: 'Success',
        description: 'New payroll period has been created',
      });
      
      // Refetch periods and select the new one
      refetchPeriods().then(() => {
        setSelectedPeriodId(newPeriod.id);
      });
      
      setIsNewPeriodDialogOpen(false);
    } catch (error) {
      console.error('Error creating payroll period:', error);
      toast({
        title: 'Error',
        description: 'Failed to create new payroll period',
        variant: 'destructive',
      });
    }
  };

  // Effects to automatically select the first period on load
  React.useEffect(() => {
    if (!selectedPeriodId && periods && periods.length > 0) {
      // Sort periods by date (newest first) and select the first one
      const sortedPeriods = [...periods].sort((a, b) => 
        new Date(b.payDate).getTime() - new Date(a.payDate).getTime()
      );
      setSelectedPeriodId(sortedPeriods[0].id);
    }
  }, [periods, selectedPeriodId]);

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Payroll Management</h1>
          <p className="text-neutral-600">Process and manage monthly payroll for employees</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsNewPeriodDialogOpen(true)}
            variant="outline"
            className="border-primary-500 text-primary-600"
          >
            <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New Period
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-64">
            <Select 
              value={selectedPeriodId?.toString() || ''} 
              onValueChange={handlePeriodChange}
              disabled={periodsLoading || !periods || periods.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a payroll period" />
              </SelectTrigger>
              <SelectContent>
                {periods?.map((period) => (
                  <SelectItem key={period.id} value={period.id.toString()}>
                    {period.name} - {period.status.charAt(0).toUpperCase() + period.status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="ghost" size="sm" onClick={handleRefresh}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 4V10H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 20V14H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9.00001C19.9828 7.5668 19.1209 6.28542 17.9845 5.27543C16.8482 4.26545 15.4745 3.55984 13.9917 3.22427C12.5089 2.8887 10.9652 2.93436 9.50481 3.35685C8.04437 3.77935 6.71475 4.56433 5.64 5.64001L1 10M23 14L18.36 18.36C17.2853 19.4357 15.9556 20.2207 14.4952 20.6432C13.0348 21.0657 11.4911 21.1113 10.0083 20.7758C8.52547 20.4402 7.1518 19.7346 6.01547 18.7246C4.87913 17.7146 4.01717 16.4332 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="ml-1">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Payroll Content */}
      {periodsLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-2"></div>
          <p className="text-neutral-600">Loading payroll data...</p>
        </div>
      ) : !periods || periods.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Payroll Periods Found</CardTitle>
            <CardDescription>
              Create your first payroll period to get started with payroll processing
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => setIsNewPeriodDialogOpen(true)}>
              Create First Payroll Period
            </Button>
          </CardContent>
        </Card>
      ) : selectedPeriod ? (
        <div className="bg-white rounded-lg shadow">
          <PayrollTable 
            entries={entries || []}
            period={selectedPeriod}
            isLoading={entriesLoading}
            onRefresh={refetchEntries}
            canProcess={canProcessPayroll}
          />
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-neutral-600">Please select a payroll period</p>
        </div>
      )}

      {/* New Payroll Period Dialog */}
      <Dialog open={isNewPeriodDialogOpen} onOpenChange={setIsNewPeriodDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Payroll Period</DialogTitle>
            <DialogDescription>
              Set up a new payroll period with dates and payment schedule
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitNewPeriod)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., July 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="payDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsNewPeriodDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Period</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

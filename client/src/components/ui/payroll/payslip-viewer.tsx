import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PayrollEntry {
  id: number;
  employeeId: number;
  periodId: number;
  grossAmount: number;
  netAmount: number;
  deductions: number;
  status: string;
  calculationDetails: {
    components: Array<{
      name: string;
      type: string;
      amount?: number;
      calculatedAmount?: number;
      formula?: string;
      taxable: boolean;
    }>;
    deductions: Array<{
      name: string;
      calculatedAmount: number;
      formula?: string;
    }>;
    grossAmount: number;
    netAmount: number;
    totalDeductions: number;
  };
  employee: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    position: string;
    joinDate: string;
    bankName?: string;
    bankAccountNumber?: string;
    taxId?: string;
  };
  period: {
    id: number;
    name: string;
    startDate: string;
    endDate: string;
    payDate: string;
    status: string;
  };
}

interface PayslipViewerProps {
  entryId: number;
  periodName: string;
}

export function PayslipViewer({ entryId, periodName }: PayslipViewerProps) {
  const { data: payrollEntry, isLoading, error } = useQuery<PayrollEntry>({
    queryKey: [`/api/payroll-entries/${entryId}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = () => {
    if (!payrollEntry) return;
    
    setDownloading(true);
    
    try {
      const doc = new jsPDF();
      const companyName = 'PayrollPro';
      
      // Add company header
      doc.setFontSize(20);
      doc.setTextColor(0, 62, 255); // Primary color
      doc.text(companyName, 105, 15, { align: 'center' });
      
      // Add payslip title
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('PAYSLIP', 105, 25, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`For Period: ${payrollEntry.period.name}`, 105, 32, { align: 'center' });
      
      // Add line
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 35, 190, 35);
      
      // Employee details
      doc.setFontSize(11);
      doc.text(`Employee: ${payrollEntry.employee.firstName} ${payrollEntry.employee.lastName}`, 20, 45);
      doc.text(`Department: ${payrollEntry.employee.department}`, 20, 52);
      doc.text(`Position: ${payrollEntry.employee.position}`, 20, 59);
      doc.text(`Employee ID: ${payrollEntry.employee.id}`, 20, 66);
      
      // Payment details
      doc.text(`Pay Date: ${format(new Date(payrollEntry.period.payDate), 'MMM dd, yyyy')}`, 130, 45);
      doc.text(`Pay Period: ${format(new Date(payrollEntry.period.startDate), 'MMM dd')} - ${format(new Date(payrollEntry.period.endDate), 'MMM dd, yyyy')}`, 130, 52);
      doc.text(`Bank: ${payrollEntry.employee.bankName || 'N/A'}`, 130, 59);
      doc.text(`Account: ${payrollEntry.employee.bankAccountNumber ? '****' + payrollEntry.employee.bankAccountNumber.slice(-4) : 'N/A'}`, 130, 66);
      
      // Earning Table
      doc.text('Earnings', 20, 80);
      doc.setDrawColor(0, 62, 255);
      doc.line(20, 82, 55, 82);
      
      const earningsData: string[][] = payrollEntry.calculationDetails.components.map(component => [
        component.name,
        component.type.charAt(0).toUpperCase() + component.type.slice(1),
        `$${(component.amount || component.calculatedAmount || 0).toFixed(2)}`
      ]);
      
      (doc as any).autoTable({
        startY: 85,
        head: [['Description', 'Type', 'Amount']],
        body: earningsData,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });
      
      // Deductions Table
      const currentY = (doc as any).lastAutoTable.finalY + 10;
      doc.text('Deductions', 20, currentY);
      doc.setDrawColor(0, 62, 255);
      doc.line(20, currentY + 2, 75, currentY + 2);
      
      const deductionsData: string[][] = payrollEntry.calculationDetails.deductions.map(deduction => [
        deduction.name,
        `$${deduction.calculatedAmount.toFixed(2)}`
      ]);
      
      (doc as any).autoTable({
        startY: currentY + 5,
        head: [['Description', 'Amount']],
        body: deductionsData,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
        styles: { fontSize: 10 },
        margin: { left: 20, right: 20 }
      });
      
      // Summary
      const summaryY = (doc as any).lastAutoTable.finalY + 15;
      doc.setDrawColor(200, 200, 200);
      doc.line(20, summaryY, 190, summaryY);
      
      doc.setFontSize(11);
      doc.text('Payment Summary', 20, summaryY + 10);
      doc.text('Gross Pay:', 130, summaryY + 10);
      doc.text(`$${payrollEntry.grossAmount.toFixed(2)}`, 180, summaryY + 10, { align: 'right' });
      
      doc.text('Total Deductions:', 130, summaryY + 17);
      doc.text(`$${payrollEntry.deductions.toFixed(2)}`, 180, summaryY + 17, { align: 'right' });
      
      doc.setDrawColor(150, 150, 150);
      doc.line(130, summaryY + 19, 190, summaryY + 19);
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('Net Pay:', 130, summaryY + 27);
      doc.text(`$${payrollEntry.netAmount.toFixed(2)}`, 180, summaryY + 27, { align: 'right' });
      
      // Footer
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('This is a computer-generated document and does not require a signature.', 105, 280, { align: 'center' });
      
      doc.save(`Payslip_${payrollEntry.employee.lastName}_${periodName.replace(/\s/g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !payrollEntry) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        Failed to load payslip data. Please try again.
      </div>
    );
  }

  const { employee, period, calculationDetails } = payrollEntry;

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Payslip for {employee.firstName} {employee.lastName}</h3>
          <p className="text-sm text-neutral-500">Pay Period: {period.name}</p>
        </div>
        <Button 
          onClick={handleDownloadPDF} 
          disabled={downloading}
          className="bg-primary-500 hover:bg-primary-600"
        >
          {downloading ? 'Preparing PDF...' : 'Download PDF'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Employee Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Name:</span>
              <span>{employee.firstName} {employee.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Employee ID:</span>
              <span>{employee.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Department:</span>
              <span>{employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Position:</span>
              <span>{employee.position}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Join Date:</span>
              <span>{format(new Date(employee.joinDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Tax ID:</span>
              <span>{employee.taxId || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Payment Information</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Pay Period:</span>
              <span>
                {format(new Date(period.startDate), 'MMM dd')} - {format(new Date(period.endDate), 'MMM dd, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Pay Date:</span>
              <span>{format(new Date(period.payDate), 'MMM dd, yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Bank:</span>
              <span>{employee.bankName || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Account Number:</span>
              <span>{employee.bankAccountNumber ? '****' + employee.bankAccountNumber.slice(-4) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Status:</span>
              <span 
                className={`px-2 py-0.5 text-xs rounded-full ${
                  payrollEntry.status === 'pending' ? 'bg-warning/20 text-warning' :
                  payrollEntry.status === 'processed' ? 'bg-info/20 text-info' :
                  payrollEntry.status === 'paid' ? 'bg-success/20 text-success' :
                  'bg-neutral-200 text-neutral-600'
                }`}
              >
                {payrollEntry.status.charAt(0).toUpperCase() + payrollEntry.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-medium mb-2 pb-1 border-b">Earnings</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium py-1">
              <span>Description</span>
              <span>Amount</span>
            </div>
            {calculationDetails.components.map((component, index) => (
              <div key={index} className="flex justify-between text-sm py-1 border-b border-dashed border-neutral-200">
                <div>
                  <span>{component.name}</span>
                  <span className="ml-2 text-xs text-neutral-500">
                    ({component.type.charAt(0).toUpperCase() + component.type.slice(1)})
                  </span>
                </div>
                <span>
                  ${(component.amount || component.calculatedAmount || 0).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-medium py-1 text-sm">
              <span>Total Earnings</span>
              <span>${calculationDetails.grossAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 pb-1 border-b">Deductions</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium py-1">
              <span>Description</span>
              <span>Amount</span>
            </div>
            {calculationDetails.deductions.map((deduction, index) => (
              <div key={index} className="flex justify-between text-sm py-1 border-b border-dashed border-neutral-200">
                <span>{deduction.name}</span>
                <span>${deduction.calculatedAmount.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between font-medium py-1 text-sm">
              <span>Total Deductions</span>
              <span>${calculationDetails.totalDeductions.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Net Pay</h3>
          <div className="text-xl font-bold">
            ${calculationDetails.netAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="mt-8 pt-2 border-t text-xs text-neutral-500 text-center">
        This is a computer-generated document and does not require a signature.
      </div>
    </div>
  );
}

export default PayslipViewer;

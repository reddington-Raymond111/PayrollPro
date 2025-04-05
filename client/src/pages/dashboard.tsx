import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import StatusCard from '@/components/ui/dashboard/status-card';
import { QuickAction, QuickActionContainer } from '@/components/ui/dashboard/quick-action';
import PayrollSchedule from '@/components/ui/dashboard/payroll-schedule';
import AnalyticsChart from '@/components/ui/dashboard/analytics-chart';
import TasksReminders from '@/components/ui/dashboard/tasks-reminders';
import RecentActivity from '@/components/ui/dashboard/recent-activity';
import QuickAccess from '@/components/ui/dashboard/quick-access';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Query dashboard stats from API
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mock chart data - in a real app, this would come from API
  const [analyticsData] = useState([
    { name: 'Engineering', value: 45000, color: 'var(--chart-1)' },
    { name: 'Marketing', value: 30000, color: 'var(--chart-2)' },
    { name: 'Sales', value: 35000, color: 'var(--chart-3)' },
    { name: 'Finance', value: 25000, color: 'var(--chart-4)' },
    { name: 'HR', value: 18000, color: 'var(--chart-5)' }
  ]);

  // Tasks mock data - in a real app, this would come from API
  const [tasks] = useState([
    {
      id: 1,
      title: 'Tax Submission Due',
      description: 'Q2 tax reports need to be submitted by July 15',
      dueIn: '3 days',
      priority: 'high' as const
    },
    {
      id: 2,
      title: 'Salary Structure Review',
      description: 'Annual review of salary structure pending',
      dueIn: '2 weeks',
      priority: 'medium' as const
    },
    {
      id: 3,
      title: 'Benefits Enrollment',
      description: 'Open enrollment period begins next month',
      dueIn: '30 days',
      priority: 'low' as const
    }
  ]);

  // Activities mock data - in a real app, this would come from API
  const [activities] = useState([
    {
      id: 1,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>,
      user: 'Sarah Johnson',
      action: 'updated her bank details',
      timestamp: 'Today, 10:30 AM'
    },
    {
      id: 2,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C20.0066 17.0952 20.1792 17.3515 20.2981 17.6337C20.417 17.9159 20.4795 18.2188 20.482 18.5255C20.4845 18.8321 20.4268 19.1359 20.3126 19.4206C20.1983 19.7052 20.0298 19.9654 19.817 20.1853C19.6041 20.4052 19.3498 20.5821 19.0695 20.7053C18.7892 20.8284 18.4875 20.8955 18.1809 20.9024C17.8743 20.9094 17.5699 20.8559 17.2846 20.7454C16.9993 20.6348 16.7382 20.4699 16.516 20.258L16.457 20.2C16.2221 19.9698 15.9235 19.8152 15.599 19.7564C15.2746 19.6975 14.94 19.7373 14.638 19.87C14.3445 19.9976 14.0939 20.2134 13.9234 20.4891C13.7529 20.7648 13.6709 21.087 13.689 21.412C13.7038 21.7228 13.6586 22.0335 13.5568 22.3232C13.4551 22.6129 13.2994 22.875 13.0999 23.0937C12.9003 23.3124 12.6613 23.4831 12.3979 23.5946C12.1344 23.7061 11.8523 23.7559 11.5676 23.7406C11.2828 23.7252 11.0073 23.6452 10.7587 23.5059C10.51 23.3667 10.2944 23.1716 10.127 22.935C9.76 22.364 9.176 21.995 8.516 21.943C8.12298 21.9087 7.72576 21.7935 7.378 21.608C7.02888 21.4192 6.7289 21.1561 6.498 20.838L3.109 15.772C2.8778 15.4348 2.7429 15.0402 2.719 14.634C2.69294 14.2267 2.77575 13.8204 2.957 13.457C3.13825 13.0935 3.40544 12.7851 3.73262 12.5607C4.0598 12.3363 4.43591 12.2031 4.825 12.173C5.21347 12.1429 5.60443 12.2161 5.959 12.386L6.016 12.414C6.32139 12.5458 6.65577 12.5864 6.9836 12.5306C7.31144 12.4748 7.61607 12.3249 7.854 12.101C8.09133 11.8725 8.25041 11.571 8.30772 11.2406C8.36503 10.9102 8.31727 10.5697 8.171 10.272L8.156 10.236C7.95545 9.77381 7.90277 9.25792 8.00654 8.76272C8.11031 8.26752 8.36392 7.82105 8.729 7.487L11.924 4.578C12.1776 4.34544 12.4843 4.16998 12.819 4.067C13.1537 3.96403 13.5074 3.93686 13.854 3.988C14.2006 4.03913 14.5298 4.16679 14.8162 4.36145C15.1026 4.55611 15.3379 4.81299 15.504 5.112L15.552 5.211C15.6721 5.46298 15.8534 5.67882 16.0779 5.8375C16.3023 5.99618 16.5623 6.09154 16.833 6.114C17.1087 6.13211 17.3845 6.08075 17.6334 5.96614C17.8823 5.85154 18.096 5.67776 18.253 5.462C18.4023 5.24686 18.5008 4.99801 18.5402 4.73629C18.5797 4.47458 18.5589 4.2064 18.4795 3.9547C18.4001 3.703 18.2642 3.47495 18.0824 3.28602C17.9006 3.09708 17.678 2.9518 17.433 2.86L17.362 2.833C16.8516 2.60395 16.4116 2.24349 16.0886 1.7867C15.7656 1.32991 15.5718 0.797145 15.527 0.243C15.5068 0.03203 15.3751 -0.0556627 15.203 0.027C10.31 1.865 6.716 6.318 6.004 11.712C6.00109 11.7284 5.99973 11.7449 6 11.7614V11.766C6 11.786 6 11.808 6.01 11.83C6.01 11.892 6.01 11.954 6.01 12.015C6.01 12.076 6.01 12.151 6.01 12.217C6.01067 12.2408 6.01067 12.2645 6.01 12.288L6.039 12.449C6.61 17.65 10.294 22 15.203 24C15.7967 24.1974 16.4402 24.1847 17.025 23.9642C17.6099 23.7438 18.0975 23.329 18.4 22.79C19.8339 20.4403 20.5968 17.6837 20.591 14.863C20.591 14.838 20.591 14.812 20.591 14.787C20.5957 14.7411 20.5957 14.6949 20.591 14.649V14.598C20.5532 14.2817 20.4348 13.9803 20.246 13.724C20.0571 13.4677 19.8037 13.2643 19.512 13.134L19.436 13.1C19.1347 12.9667 18.8829 12.7486 18.7136 12.4733C18.5444 12.198 18.4655 11.8785 18.4879 11.5575C18.5104 11.2365 18.6331 10.9315 18.839 10.6859C19.0449 10.4403 19.3247 10.267 19.634 10.189L19.681 10.176C19.9166 10.121 20.1387 10.0247 20.3359 9.89144C20.5331 9.75822 20.7021 9.59053 20.834 9.395C21.4938 8.31832 21.8284 7.06295 21.795 5.789C21.7539 4.09276 21.0834 2.46981 19.9057 1.28708C18.728 0.104343 17.1327 -0.292635 15.593 0.146L15.203 0.027L15.204 0.033V0.039L15.203 0.027C14.859 0.135 14.72 0.27 14.857 0.633C15.1451 1.39458 15.1502 2.2405 14.8714 3.0051C14.5927 3.7697 14.0515 4.39647 13.347 4.77L10.173 7.658C10.0963 7.72351 10.0431 7.81275 10.022 7.91203C10.0008 8.0113 10.013 8.11446 10.056 8.205L10.072 8.241C10.3921 8.92839 10.512 9.69352 10.418 10.45C10.3239 11.2065 10.0198 11.92 9.54 12.51C9.25236 12.8494 8.8697 13.099 8.44097 13.2266C8.01223 13.3542 7.55865 13.354 7.13 13.226L7.072 13.198C6.6964 13.0248 6.27349 12.9867 5.873 13.09C5.4725 13.1932 5.12131 13.4313 4.878 13.764C4.6347 14.0967 4.51629 14.5033 4.545 14.914C4.57372 15.3247 4.74903 15.7111 5.039 16L8.428 21.066C8.5256 21.2006 8.6553 21.3099 8.80567 21.3836C8.95603 21.4573 9.12252 21.4933 9.29 21.488C9.48259 21.4843 9.67126 21.433 9.8335 21.3394C9.99574 21.2459 10.1263 21.1133 10.21 20.954L10.225 20.921C10.5541 20.2336 11.1045 19.6843 11.7926 19.3467C12.4807 19.0091 13.2604 18.9044 14.01 19.049C14.7596 19.1937 15.4346 19.5761 15.9123 20.1319C16.3901 20.6876 16.6381 21.3795 16.61 22.09C16.5914 22.478 16.7154 22.8569 16.9602 23.1517C17.205 23.4465 17.5533 23.6345 17.934 23.68C18.2343 23.7173 18.5389 23.6546 18.8007 23.5022C19.0625 23.3498 19.2668 23.1161 19.379 22.834C19.5534 22.3919 19.6396 21.9177 19.633 21.439C19.6339 21.1027 19.7394 20.776 19.93 20.505L19.948 20.479C20.0629 20.3103 20.2351 20.1813 20.4368 20.1107C20.6384 20.0402 20.858 20.0322 21.065 20.088C21.2734 20.1445 21.4539 20.2726 21.5751 20.4505C21.6964 20.6284 21.7505 20.8451 21.728 21.062C21.6783 21.5108 21.5546 21.9487 21.361 22.358C20.6243 23.8254 19.2825 24.8871 17.6995 25.2671C16.1164 25.6472 14.4364 25.3035 13.131 24.324C8.226 21.576 4.88 17.064 3.914 11.826C3.9 11.751 3.887 11.674 3.875 11.596C3.87033 11.5633 3.87033 11.5307 3.875 11.498C3.875 11.435 3.844 11.371 3.834 11.308L3.814 11.184C3.59933 8.80782 4.1083 6.4201 5.27799 4.35676C6.44767 2.29341 8.21916 0.658936 10.345 -0.349C10.5158 -0.422367 10.6988 -0.460762 10.885 -0.462C11.0241 -0.4621 11.1624 -0.440137 11.296 -0.396L11.365 -0.379C12.9112 0.0599504 14.2319 1.06 15.0354 2.40999C15.8389 3.75997 16.065 5.35697 15.661 6.865" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>,
      user: 'System',
      action: 'performed tax rate update',
      timestamp: 'Yesterday, 3:45 PM'
    },
    {
      id: 3,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L19.1716 5.17157L22.3431 12.3431L19.1716 19.5147L12 22.6863L4.82843 19.5147L1.65685 12.3431L4.82843 5.17157L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>,
      user: 'You',
      action: 'processed May payroll',
      timestamp: 'May 28, 2023'
    },
    {
      id: 4,
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>,
      user: 'Mike Peters',
      action: 'downloaded tax reports',
      timestamp: 'May 20, 2023'
    }
  ]);

  // Quick access items
  const quickAccessItems = [
    {
      id: 'payslips',
      icon: <svg className="text-primary-600" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>,
      title: 'Payslips',
      href: '/payroll'
    },
    {
      id: 'taxes',
      icon: <svg className="text-primary-600" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10H21M7 3V5M17 3V5M6 13H8M6 17H8M12 13H14M12 17H14M18 13H20M18 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 5H3V21H21V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>,
      title: 'Tax Forms',
      href: '/settings'
    },
    {
      id: 'benefits',
      icon: <svg className="text-primary-600" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>,
      title: 'Benefits',
      href: '/benefits'
    },
    {
      id: 'reports',
      icon: <svg className="text-primary-600" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>,
      title: 'Reports',
      href: '/settings'
    }
  ];

  // Handle quick actions
  const handleRunPayroll = () => {
    setLocation('/payroll');
    toast({
      title: 'Navigating to Payroll',
      description: 'You can process payroll from the payroll page',
    });
  };

  const handleConfigureSalary = () => {
    setLocation('/salary-configuration');
    toast({
      title: 'Navigating to Salary Configuration',
      description: 'You can configure salary structures from this page',
    });
  };

  const handleManageBenefits = () => {
    setLocation('/benefits');
    toast({
      title: 'Navigating to Benefits',
      description: 'You can manage employee benefits from this page',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Compensation Dashboard</h1>
        <p className="text-neutral-600">Welcome back! Here's what you need to know today.</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatusCard
          icon={<svg className="text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
          title="Payroll Status"
          value={statsLoading ? 'Loading...' : dashboardStats?.payrollStatus || 'N/A'}
          badge={statsLoading ? undefined : {
            text: dashboardStats?.payrollStatus === 'processing' ? 'In Progress' : 'Completed',
            color: dashboardStats?.payrollStatus === 'processing' ? 'bg-warning text-white' : 'bg-success text-white'
          }}
        />

        <StatusCard
          icon={<svg className="text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
          title="Total Employees"
          value={statsLoading ? 'Loading...' : dashboardStats?.totalEmployees || '0'}
        />

        <StatusCard
          icon={<svg className="text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 10H21M7 3V5M17 3V5M6 13H8M6 17H8M12 13H14M12 17H14M18 13H20M18 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 5H3V21H21V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
          title="Next Payroll Date"
          value={statsLoading 
            ? 'Loading...' 
            : dashboardStats?.nextPayrollDate 
              ? new Date(dashboardStats.nextPayrollDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                }) 
              : 'N/A'
          }
        />

        <StatusCard
          icon={<svg className="text-xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 1V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
          title="Monthly Payroll"
          value={statsLoading 
            ? 'Loading...' 
            : dashboardStats?.totalMonthlyPayroll 
              ? `$${dashboardStats.totalMonthlyPayroll.toLocaleString()}`
              : '$0'
          }
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (spans 2 columns on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <QuickActionContainer title="Quick Actions">
            <QuickAction 
              icon={<svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
              title="Run Payroll" 
              onClick={handleRunPayroll} 
            />
            <QuickAction 
              icon={<svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C20.0066 17.0952 20.1792 17.3515 20.2981 17.6337C20.417 17.9159 20.4795 18.2188 20.482 18.5255C20.4845 18.8321 20.4268 19.1359 20.3126 19.4206C20.1983 19.7052 20.0298 19.9654 19.817 20.1853C19.6041 20.4052 19.3498 20.5821 19.0695 20.7053C18.7892 20.8284 18.4875 20.8955 18.1809 20.9024C17.8743 20.9094 17.5699 20.8559 17.2846 20.7454C16.9993 20.6348 16.7382 20.4699 16.516 20.258L16.457 20.2C16.2221 19.9698 15.9235 19.8152 15.599 19.7564C15.2746 19.6975 14.94 19.7373 14.638 19.87C14.3445 19.9976 14.0939 20.2134 13.9234 20.4891C13.7529 20.7648 13.6709 21.087 13.689 21.412C13.7038 21.7228 13.6586 22.0335 13.5568 22.3232C13.4551 22.6129 13.2994 22.875 13.0999 23.0937C12.9003 23.3124 12.6613 23.4831 12.3979 23.5946C12.1344 23.7061 11.8523 23.7559 11.5676 23.7406C11.2828 23.7252 11.0073 23.6452 10.7587 23.5059C10.51 23.3667 10.2944 23.1716 10.127 22.935C9.76 22.364 9.176 21.995 8.516 21.943C8.12298 21.9087 7.72576 21.7935 7.378 21.608C7.02888 21.4192 6.7289 21.1561 6.498 20.838L3.109 15.772C2.8778 15.4348 2.7429 15.0402 2.719 14.634C2.69294 14.2267 2.77575 13.8204 2.957 13.457C3.13825 13.0935 3.40544 12.7851 3.73262 12.5607C4.0598 12.3363 4.43591 12.2031 4.825 12.173C5.21347 12.1429 5.60443 12.2161 5.959 12.386L6.016 12.414C6.32139 12.5458 6.65577 12.5864 6.9836 12.5306C7.31144 12.4748 7.61607 12.3249 7.854 12.101C8.09133 11.8725 8.25041 11.571 8.30772 11.2406C8.36503 10.9102 8.31727 10.5697 8.171 10.272L8.156 10.236C7.95545 9.77381 7.90277 9.25792 8.00654 8.76272C8.11031 8.26752 8.36392 7.82105 8.729 7.487L11.924 4.578C12.1776 4.34544 12.4843 4.16998 12.819 4.067C13.1537 3.96403 13.5074 3.93686 13.854 3.988C14.2006 4.03913 14.5298 4.16679 14.8162 4.36145C15.1026 4.55611 15.3379 4.81299 15.504 5.112L15.552 5.211C15.6721 5.46298 15.8534 5.67882 16.0779 5.8375C16.3023 5.99618 16.5623 6.09154 16.833 6.114C17.1087 6.13211 17.3845 6.08075 17.6334 5.96614C17.8823 5.85154 18.096 5.67776 18.253 5.462C18.4023 5.24686 18.5008 4.99801 18.5402 4.73629C18.5797 4.47458 18.5589 4.2064 18.4795 3.9547C18.4001 3.703 18.2642 3.47495 18.0824 3.28602C17.9006 3.09708 17.678 2.9518 17.433 2.86L17.362 2.833C16.8516 2.60395 16.4116 2.24349 16.0886 1.7867C15.7656 1.32991 15.5718 0.797145 15.527 0.243C15.5068 0.03203 15.3751 -0.0556627 15.203 0.027C10.31 1.865 6.716 6.318 6.004 11.712C6.00109 11.7284 5.99973 11.7449 6 11.7614V11.766C6 11.786 6 11.808 6.01 11.83C6.01 11.892 6.01 11.954 6.01 12.015C6.01 12.076 6.01 12.151 6.01 12.217C6.01067 12.2408 6.01067 12.2645 6.01 12.288L6.039 12.449C6.61 17.65 10.294 22 15.203 24C15.7967 24.1974 16.4402 24.1847 17.025 23.9642C17.6099 23.7438 18.0975 23.329 18.4 22.79C19.8339 20.4403 20.5968 17.6837 20.591 14.863C20.591 14.838 20.591 14.812 20.591 14.787C20.5957 14.7411 20.5957 14.6949 20.591 14.649V14.598C20.5532 14.2817 20.4348 13.9803 20.246 13.724C20.0571 13.4677 19.8037 13.2643 19.512 13.134L19.436 13.1C19.1347 12.9667 18.8829 12.7486 18.7136 12.4733C18.5444 12.198 18.4655 11.8785 18.4879 11.5575C18.5104 11.2365 18.6331 10.9315 18.839 10.6859C19.0449 10.4403 19.3247 10.267 19.634 10.189L19.681 10.176C19.9166 10.121 20.1387 10.0247 20.3359 9.89144C20.5331 9.75822 20.7021 9.59053 20.834 9.395C21.4938 8.31832 21.8284 7.06295 21.795 5.789C21.7539 4.09276 21.0834 2.46981 19.9057 1.28708C18.728 0.104343 17.1327 -0.292635 15.593 0.146L15.203 0.027L15.204 0.033V0.039L15.203 0.027C14.859 0.135 14.72 0.27 14.857 0.633C15.1451 1.39458 15.1502 2.2405 14.8714 3.0051C14.5927 3.7697 14.0515 4.39647 13.347 4.77L10.173 7.658C10.0963 7.72351 10.0431 7.81275 10.022 7.91203C10.0008 8.0113 10.013 8.11446 10.056 8.205L10.072 8.241C10.3921 8.92839 10.512 9.69352 10.418 10.45C10.3239 11.2065 10.0198 11.92 9.54 12.51C9.25236 12.8494 8.8697 13.099 8.44097 13.2266C8.01223 13.3542 7.55865 13.354 7.13 13.226L7.072 13.198C6.6964 13.0248 6.27349 12.9867 5.873 13.09C5.4725 13.1932 5.12131 13.4313 4.878 13.764C4.6347 14.0967 4.51629 14.5033 4.545 14.914C4.57372 15.3247 4.74903 15.7111 5.039 16L8.428 21.066C8.5256 21.2006 8.6553 21.3099 8.80567 21.3836C8.95603 21.4573 9.12252 21.4933 9.29 21.488C9.48259 21.4843 9.67126 21.433 9.8335 21.3394C9.99574 21.2459 10.1263 21.1133 10.21 20.954L10.225 20.921C10.5541 20.2336 11.1045 19.6843 11.7926 19.3467C12.4807 19.0091 13.2604 18.9044 14.01 19.049C14.7596 19.1937 15.4346 19.5761 15.9123 20.1319C16.3901 20.6876 16.6381 21.3795 16.61 22.09C16.5914 22.478 16.7154 22.8569 16.9602 23.1517C17.205 23.4465 17.5533 23.6345 17.934 23.68C18.2343 23.7173 18.5389 23.6546 18.8007 23.5022C19.0625 23.3498 19.2668 23.1161 19.379 22.834C19.5534 22.3919 19.6396 21.9177 19.633 21.439C19.6339 21.1027 19.7394 20.776 19.93 20.505L19.948 20.479C20.0629 20.3103 20.2351 20.1813 20.4368 20.1107C20.6384 20.0402 20.858 20.0322 21.065 20.088C21.2734 20.1445 21.4539 20.2726 21.5751 20.4505C21.6964 20.6284 21.7505 20.8451 21.728 21.062C21.6783 21.5108 21.5546 21.9487 21.361 22.358C20.6243 23.8254 19.2825 24.8871 17.6995 25.2671C16.1164 25.6472 14.4364 25.3035 13.131 24.324C8.226 21.576 4.88 17.064 3.914 11.826C3.9 11.751 3.887 11.674 3.875 11.596C3.87033 11.5633 3.87033 11.5307 3.875 11.498C3.875 11.435 3.844 11.371 3.834 11.308L3.814 11.184C3.59933 8.80782 4.1083 6.4201 5.27799 4.35676C6.44767 2.29341 8.21916 0.658936 10.345 -0.349C10.5158 -0.422367 10.6988 -0.460762 10.885 -0.462C11.0241 -0.4621 11.1624 -0.440137 11.296 -0.396L11.365 -0.379C12.9112 0.0599504 14.2319 1.06 15.0354 2.40999C15.8389 3.75997 16.065 5.35697 15.661 6.865" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
              title="Configure Salary" 
              onClick={handleConfigureSalary} 
            />
            <QuickAction 
              icon={<svg className="text-2xl" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>}
              title="Manage Benefits" 
              onClick={handleManageBenefits} 
            />
          </QuickActionContainer>

          {/* Payroll Schedule */}
          <PayrollSchedule />

          {/* Compensation Analytics */}
          <AnalyticsChart 
            title="Compensation Analytics" 
            data={analyticsData}
            description="Payroll cost distribution by department"
            onExpand={() => {
              toast({
                title: 'Analytics',
                description: 'Detailed analytics view would open here',
              });
            }}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tasks & Reminders */}
          <TasksReminders 
            tasks={tasks} 
            onViewAll={() => {
              toast({
                title: 'Tasks & Reminders',
                description: 'View all tasks would open here',
              });
            }} 
          />

          {/* Recent Activity */}
          <RecentActivity 
            activities={activities} 
            onViewAll={() => {
              toast({
                title: 'Activity Log',
                description: 'Complete activity log would open here',
              });
            }} 
          />

          {/* Quick Access */}
          <QuickAccess items={quickAccessItems} />
        </div>
      </div>
    </div>
  );
}

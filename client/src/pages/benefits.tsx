import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Benefits() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Benefits Management</h1>
        <p className="text-neutral-600">Manage employee benefits and enrollments</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Benefits Management</CardTitle>
          <CardDescription>
            This page is under development. Check back soon for full benefits management capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Coming soon: Benefits plans, enrollment management, and cost analysis.</p>
        </CardContent>
      </Card>
    </div>
  );
}
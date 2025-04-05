import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Employees() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">Employee Management</h1>
        <p className="text-neutral-600">Manage your employee records and compensation details</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Employee Management</CardTitle>
          <CardDescription>
            This page is under development. Check back soon for full employee management capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Coming soon: Employee profiles, compensation history, and document management.</p>
        </CardContent>
      </Card>
    </div>
  );
}
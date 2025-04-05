import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Settings() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800">System Settings</h1>
        <p className="text-neutral-600">Configure system settings and preferences</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            This page is under development. Check back soon for full system configuration capabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Coming soon: Tax configuration, company details, and system preferences.</p>
        </CardContent>
      </Card>
    </div>
  );
}
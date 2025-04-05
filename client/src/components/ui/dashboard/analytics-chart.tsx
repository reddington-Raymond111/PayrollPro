import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsChartProps {
  title: string;
  data: DataItem[];
  description?: string;
  onExpand?: () => void;
}

export function AnalyticsChart({ title, data, description, onExpand }: AnalyticsChartProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <div className="p-6">
        {hasData ? (
          <div onClick={onExpand} className="cursor-pointer">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  labelFormatter={(label) => `Department: ${label}`}
                />
                <Legend />
                {data.map((item, index) => (
                  <Bar 
                    key={index} 
                    dataKey="value" 
                    fill={`hsl(var(--chart-${index + 1}))`} 
                    name={item.name} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 bg-neutral-50 rounded-lg flex items-center justify-center border border-dashed border-neutral-300">
            <div className="text-center">
              <svg className="mx-auto text-4xl text-neutral-400" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9H21M7 3V5M17 3V5M6 13H8M6 17H8M12 13H14M12 17H14M18 13H20M18 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 5H3V21H21V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="mt-2 text-sm text-neutral-600">{description || 'No data available for this period'}</p>
              <span className="text-xs text-neutral-500">Click to expand</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsChart;

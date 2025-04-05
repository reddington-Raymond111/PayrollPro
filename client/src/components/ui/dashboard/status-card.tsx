import React from 'react';

interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  badge?: {
    text: string;
    color: string;
  };
}

export function StatusCard({ icon, title, value, badge }: StatusCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <div className="rounded-full p-3 bg-primary-50 text-primary-600">
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-neutral-500">{title}</p>
        <div className="flex items-center">
          <span className="text-xl font-semibold">{value}</span>
          {badge && (
            <span className={`ml-2 px-2 py-0.5 text-xs font-medium ${badge.color} rounded-full`}>
              {badge.text}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatusCard;

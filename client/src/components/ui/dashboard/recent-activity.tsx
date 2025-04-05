import React from 'react';

export interface Activity {
  id: number;
  icon: React.ReactNode;
  user: string;
  action: string;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
  onViewAll: () => void;
}

export function RecentActivity({ activities, onViewAll }: RecentActivityProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="font-semibold text-lg">Recent Activity</h2>
      </div>
      <div className="p-4">
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-neutral-600"> {activity.action}</span>
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-neutral-500">
            No recent activities to display.
          </div>
        )}
        
        <button 
          onClick={onViewAll}
          className="mt-4 w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium text-center"
        >
          View All Activity
        </button>
      </div>
    </div>
  );
}

export default RecentActivity;

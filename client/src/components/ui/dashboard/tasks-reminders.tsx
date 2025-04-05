import React from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  dueIn: string;
  priority: 'high' | 'medium' | 'low';
}

const priorityStyles = {
  high: 'border-warning bg-warning/5',
  medium: 'border-info bg-info/5',
  low: 'border-primary-500 bg-primary-50/50',
};

interface TasksRemindersProps {
  tasks: Task[];
  onViewAll: () => void;
}

export function TasksReminders({ tasks, onViewAll }: TasksRemindersProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="font-semibold text-lg">Tasks & Reminders</h2>
      </div>
      <div className="p-4">
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3 border-l-4 ${priorityStyles[task.priority]} rounded-r-lg`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{task.title}</h3>
                    <p className="text-xs text-neutral-600 mt-1">{task.description}</p>
                  </div>
                  <span className="text-xs text-neutral-500">{task.dueIn}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-neutral-500">
            No tasks or reminders at the moment.
          </div>
        )}
        
        <button 
          onClick={onViewAll}
          className="mt-4 w-full py-2 text-sm text-primary-600 hover:text-primary-700 font-medium text-center"
        >
          View All Tasks
        </button>
      </div>
    </div>
  );
}

export default TasksReminders;

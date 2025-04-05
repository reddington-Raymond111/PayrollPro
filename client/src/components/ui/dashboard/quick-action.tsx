import React from 'react';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
}

export function QuickAction({ icon, title, onClick }: QuickActionProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition"
    >
      <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-3">
        {icon}
      </div>
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
}

export function QuickActionContainer({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

export default QuickAction;

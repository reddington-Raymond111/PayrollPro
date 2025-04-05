import React from 'react';

interface QuickAccessItem {
  id: string;
  icon: React.ReactNode;
  title: string;
  href: string;
}

interface QuickAccessProps {
  items: QuickAccessItem[];
}

export function QuickAccess({ items }: QuickAccessProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-neutral-200">
        <h2 className="font-semibold text-lg">Quick Access</h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <a 
              key={item.id}
              href={item.href} 
              className="p-3 flex flex-col items-center text-center border border-neutral-200 rounded hover:bg-neutral-50 transition"
            >
              <div className="text-2xl text-primary-600 mb-2">
                {item.icon}
              </div>
              <span className="text-sm">{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuickAccess;

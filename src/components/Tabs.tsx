'use client';

import React, { useState, ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  children: ReactNode;
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab = tabs[0]?.id,
  children,
  className = '',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const childrenArray = React.Children.toArray(children);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all whitespace-nowrap touch-manipulation
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-lg p-4">
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className={activeTab === tabs[index]?.id ? 'block' : 'hidden'}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
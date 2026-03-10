'use client';

import { useState, useCallback, ReactElement } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  children: ReactElement[];
}

export default function Tabs({
  tabs,
  defaultTab,
  onChange,
  className = '',
  children,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      let newIndex = currentIndex;

      if (e.key === 'ArrowLeft') {
        newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
      } else if (e.key === 'ArrowRight') {
        newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      handleTabClick(tabs[newIndex].id);
      const tabButton = document.getElementById(`tab-${tabs[newIndex].id}`);
      tabButton?.focus();
    },
    [tabs, handleTabClick]
  );

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);
  const activeChild = children[activeIndex];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-center mb-4">
        <div
          className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1"
          role="tablist"
          aria-label="功能选择"
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => handleTabClick(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
                relative px-4 py-2 min-h-[40px] text-sm font-medium rounded-md
                transition-all duration-200 ease-in-out
                flex items-center gap-1.5
                ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div
        key={activeTab}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        className="animate-fadeIn"
      >
        {activeChild}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

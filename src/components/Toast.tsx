'use client';

import React from 'react';
import { useToast } from '@/lib/toast';

interface ToastProps {
  className?: string;
}

export default function Toast({ className = '' }: ToastProps) {
  const toastContext = useToast();
  const messages = toastContext?.messages || [];
  const remove = toastContext?.remove || (() => {});

  const getToastClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white border-green-600';
      case 'error':
        return 'bg-red-500 text-white border-red-600';
      case 'info':
        return 'bg-blue-500 text-white border-blue-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  if (messages.length === 0) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg ${getToastClass(message.type)} animate-in slide-in-from-right fade-in duration-300`}
        >
          <div className="flex-1">
            <p className="text-sm font-medium">{message.message}</p>
          </div>
          <button
            onClick={() => remove(message.id)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="关闭通知"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
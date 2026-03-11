'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  messages: ToastMessage[];
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const addMessage = useCallback((message: string, type: ToastMessage['type'], duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9);
    setMessages(prev => [...prev, { id, message, type, duration }]);

    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, duration);
  }, []);

  const success = useCallback((message: string, duration?: number) => {
    addMessage(message, 'success', duration);
  }, [addMessage]);

  const error = useCallback((message: string, duration?: number) => {
    addMessage(message, 'error', duration);
  }, [addMessage]);

  const info = useCallback((message: string, duration?: number) => {
    addMessage(message, 'info', duration);
  }, [addMessage]);

  const warning = useCallback((message: string, duration?: number) => {
    addMessage(message, 'warning', duration);
  }, [addMessage]);

  const remove = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ messages, success, error, info, warning, remove }}>
      {children}
    </ToastContext.Provider>
  );
}

export const toast = {
  success: (message: string, duration?: number) => {
    console.warn('toast.success() 只能在 React 组件中使用');
  },
  error: (message: string, duration?: number) => {
    console.warn('toast.error() 只能在 React 组件中使用');
  },
  info: (message: string, duration?: number) => {
    console.warn('toast.info() 只能在 React 组件中使用');
  },
  warning: (message: string, duration?: number) => {
    console.warn('toast.warning() 只能在 React 组件中使用');
  },
};
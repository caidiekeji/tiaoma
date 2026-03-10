export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toastId = 0;
const listeners: Set<(toasts: Toast[]) => void> = new Set();
let toasts: Toast[] = [];

function notifyListeners() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function subscribe(listener: (toasts: Toast[]) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToasts() {
  return [...toasts];
}

export function showToast(
  type: ToastType,
  message: string,
  duration: number = 3000
) {
  const id = `toast-${++toastId}`;
  const toast: Toast = { id, type, message, duration };

  toasts = [...toasts, toast];
  notifyListeners();

  if (duration > 0) {
    setTimeout(() => {
      dismissToast(id);
    }, duration);
  }

  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
}

export function dismissAllToasts() {
  toasts = [];
  notifyListeners();
}

export const toast = {
  success: (message: string, duration?: number) =>
    showToast('success', message, duration),
  error: (message: string, duration?: number) =>
    showToast('error', message, duration),
  warning: (message: string, duration?: number) =>
    showToast('warning', message, duration),
  info: (message: string, duration?: number) =>
    showToast('info', message, duration),
  dismiss: dismissToast,
  dismissAll: dismissAllToasts,
};

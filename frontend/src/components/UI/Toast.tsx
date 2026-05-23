'use client';

import React, { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

type ToastCallback = (message: string, type: ToastType) => void;

const toastCallbacks: Set<ToastCallback> = new Set();

export const toast = {
  success: (message: string) => {
    toastCallbacks.forEach((cb) => cb(message, 'success'));
  },
  error: (message: string) => {
    toastCallbacks.forEach((cb) => cb(message, 'error'));
  },
  info: (message: string) => {
    toastCallbacks.forEach((cb) => cb(message, 'info'));
  },
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const addToast: ToastCallback = (message, type) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    toastCallbacks.add(addToast);
    return () => {
      toastCallbacks.delete(addToast);
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center justify-between p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 scale-100 ${
            t.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : t.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex-1 text-sm font-medium">{t.message}</div>
          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="ml-4 text-current opacity-75 hover:opacity-100 transition-opacity font-bold text-lg"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

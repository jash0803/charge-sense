'use client';

import { ReactNode } from 'react';

interface DynamicCardProps {
  children: ReactNode;
  variant?: 'normal' | 'warning' | 'alert' | 'eco' | 'night' | 'motion';
  className?: string;
}

export default function DynamicCard({ children, variant = 'normal', className = '' }: DynamicCardProps) {
  const variantStyles = {
    normal: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700',
    alert: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
    eco: 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700',
    night: 'bg-gray-800 border-gray-700',
    motion: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
  };

  return (
    <div
      className={`rounded-xl p-4 border-2 transition-all duration-300 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </div>
  );
}


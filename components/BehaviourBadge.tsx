'use client';

interface BehaviourBadgeProps {
  label: string;
  icon: string;
  variant?: 'warning' | 'info' | 'success';
}

export default function BehaviourBadge({ label, icon, variant = 'info' }: BehaviourBadgeProps) {
  const variantStyles = {
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${variantStyles[variant]}`}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
}


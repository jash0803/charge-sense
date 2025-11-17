'use client';

import { motion } from 'framer-motion';
import { Coins, TrendingUp } from 'lucide-react';

interface PointsDisplayProps {
  points: number;
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'text-lg',
  medium: 'text-2xl',
  large: 'text-4xl',
};

export default function PointsDisplay({ points, showLabel = true, size = 'medium' }: PointsDisplayProps) {
  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Coins
          size={size === 'small' ? 20 : size === 'medium' ? 24 : 32}
          className="text-yellow-500"
          fill="currentColor"
        />
      </motion.div>
      <div>
        <motion.span
          key={points}
          initial={{ scale: 1.2, color: '#eab308' }}
          animate={{ scale: 1, color: 'inherit' }}
          className={`${sizeClasses[size]} font-bold text-yellow-600 dark:text-yellow-400`}
        >
          {points.toLocaleString()}
        </motion.span>
        {showLabel && (
          <span className="text-xs text-gray-600 dark:text-gray-400 ml-1">points</span>
        )}
      </div>
    </motion.div>
  );
}



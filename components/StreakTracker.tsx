'use client';

import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakTracker({ currentStreak, longestStreak }: StreakTrackerProps) {
  const isOnFire = currentStreak >= 3;

  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-800">
      <motion.div
        animate={isOnFire ? {
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0],
        } : {}}
        transition={{ duration: 1, repeat: Infinity }}
        className="relative"
      >
        <Flame
          size={40}
          className={`${isOnFire ? 'text-orange-500' : 'text-gray-400'}`}
          fill={isOnFire ? 'currentColor' : 'none'}
        />
        {isOnFire && (
          <motion.div
            className="absolute inset-0"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Flame size={40} className="text-orange-400 opacity-50" fill="currentColor" />
          </motion.div>
        )}
      </motion.div>

      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <motion.span
            key={currentStreak}
            initial={{ scale: 1.5, color: '#f97316' }}
            animate={{ scale: 1, color: 'inherit' }}
            className="text-3xl font-bold text-orange-600 dark:text-orange-400"
          >
            {currentStreak}
          </motion.span>
          <span className="text-sm text-gray-600 dark:text-gray-400">day streak</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Best: {longestStreak} days
        </p>
      </div>

      {/* Fire particles animation */}
      {isOnFire && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              initial={{
                x: '50%',
                y: '100%',
                opacity: 0,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 40}%`,
                y: `${-20 + Math.random() * 20}%`,
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}



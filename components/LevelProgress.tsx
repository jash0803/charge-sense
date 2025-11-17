'use client';

import { motion } from 'framer-motion';
import { Award, Star } from 'lucide-react';

interface LevelProgressProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export default function LevelProgress({ level, xp, xpToNextLevel }: LevelProgressProps) {
  const progress = (xp / xpToNextLevel) * 100;
  const xpInCurrentLevel = xp;
  const totalXpForLevel = xpToNextLevel;

  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Award size={24} className="text-purple-600 dark:text-purple-400" fill="currentColor" />
          </motion.div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
              <motion.span
                key={level}
                initial={{ scale: 1.3, color: '#9333ea' }}
                animate={{ scale: 1, color: 'inherit' }}
                className="text-2xl font-bold text-purple-600 dark:text-purple-400"
              >
                {level}
              </motion.span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {xpInCurrentLevel} / {totalXpForLevel} XP
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            >
              <Star size={16} className="text-yellow-500" fill="currentColor" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* XP to next level */}
      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
        {totalXpForLevel - xpInCurrentLevel} XP to Level {level + 1}
      </p>
    </div>
  );
}



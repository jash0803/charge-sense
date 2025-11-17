'use client';

import { motion } from 'framer-motion';
import { Achievement } from '@/lib/gamificationData';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  small: 'w-16 h-16 text-2xl',
  medium: 'w-24 h-24 text-4xl',
  large: 'w-32 h-32 text-6xl',
};

const rarityColors = {
  common: 'border-gray-300 bg-gray-50 dark:bg-gray-800',
  rare: 'border-blue-400 bg-blue-50 dark:bg-blue-900/20',
  epic: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20',
  legendary: 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
};

export default function AchievementBadge({
  achievement,
  size = 'medium',
  showProgress = false,
  onClick,
}: AchievementBadgeProps) {
  const isUnlocked = achievement.unlocked;
  const progress = achievement.progress;

  return (
    <motion.div
      className={`relative ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.1 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
    >
      <motion.div
        className={`
          ${sizeClasses[size]}
          rounded-full border-4 flex items-center justify-center
          ${isUnlocked ? rarityColors[achievement.rarity] : 'border-gray-200 bg-gray-100 dark:bg-gray-800 opacity-50'}
          relative overflow-hidden
        `}
        animate={isUnlocked ? {
          boxShadow: [
            '0 0 0px rgba(55, 198, 109, 0)',
            '0 0 20px rgba(55, 198, 109, 0.5)',
            '0 0 0px rgba(55, 198, 109, 0)',
          ],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Icon */}
        <motion.span
          className={isUnlocked ? '' : 'grayscale'}
          animate={isUnlocked ? {
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {achievement.icon}
        </motion.span>

        {/* Progress ring for locked achievements */}
        {!isUnlocked && showProgress && (
          <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-gray-200 dark:text-gray-700"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className="text-green-500"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              transition={{ duration: 1 }}
              strokeDasharray={`${2 * Math.PI * 45}`}
            />
          </svg>
        )}

        {/* Unlock animation */}
        {isUnlocked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-full h-full bg-green-400 rounded-full opacity-30" />
          </motion.div>
        )}

        {/* Rarity indicator */}
        {isUnlocked && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 border-2 border-white dark:border-gray-800" />
        )}
      </motion.div>

      {/* Progress text */}
      {showProgress && !isUnlocked && (
        <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap z-10">
          {progress}%
        </div>
      )}

      {/* Unlocked checkmark */}
      {isUnlocked && (
        <motion.div
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}
    </motion.div>
  );
}


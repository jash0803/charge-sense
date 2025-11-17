'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AchievementBadge from './AchievementBadge';
import { Achievement } from '@/lib/gamificationData';

interface AchievementNotificationProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-yellow-400 p-6 max-w-sm w-full mx-4"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="text-center mb-3"
            >
              <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mb-1">
                Achievement Unlocked!
              </h3>
            </motion.div>
            <div className="flex flex-col items-center">
              <AchievementBadge achievement={achievement} size="large" />
              <h4 className="text-lg font-semibold mt-3 mb-1">{achievement.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-2">
                {achievement.description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full font-semibold">
                  +{achievement.points} points
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}



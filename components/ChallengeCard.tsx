'use client';

import { motion } from 'framer-motion';
import { Challenge } from '@/lib/gamificationData';
import { Trophy, Calendar, CheckCircle2 } from 'lucide-react';

interface ChallengeCardProps {
  challenge: Challenge;
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const daysRemaining = Math.ceil((challenge.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isActive = daysRemaining > 0 && !challenge.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border-2 ${
        challenge.completed
          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Trophy
              size={18}
              className={challenge.completed ? 'text-yellow-600' : 'text-gray-600 dark:text-gray-400'}
              fill={challenge.completed ? 'currentColor' : 'none'}
            />
            <h3 className="font-semibold text-sm">{challenge.title}</h3>
            {challenge.completed && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring' }}
              >
                <CheckCircle2 size={18} className="text-green-600" fill="currentColor" />
              </motion.div>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{challenge.description}</p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
              <Calendar size={12} />
              <span>
                {challenge.completed
                  ? 'Completed!'
                  : isActive
                  ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`
                  : 'Expired'}
              </span>
            </div>
            <span className="text-gray-500 dark:text-gray-500">
              {challenge.duration} days
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            challenge.completed ? 'bg-yellow-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(challenge.progress, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">
          {challenge.progress.toFixed(0)}% complete
        </span>
        <div className="flex items-center gap-2">
          {challenge.reward.badge && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
              {challenge.reward.badge}
            </span>
          )}
          <span className="font-semibold text-yellow-600 dark:text-yellow-400">
            +{challenge.reward.points} pts
          </span>
        </div>
      </div>
    </motion.div>
  );
}



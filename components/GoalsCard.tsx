'use client';

import { motion } from 'framer-motion';
import { Goal } from '@/lib/gamificationData';
import { Target, CheckCircle2, Clock } from 'lucide-react';

interface GoalsCardProps {
  goal: Goal;
}

export default function GoalsCard({ goal }: GoalsCardProps) {
  const daysRemaining = Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysRemaining <= 2 && !goal.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border-2 ${
        goal.completed
          ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
          : isUrgent
          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Target
              size={18}
              className={goal.completed ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}
            />
            <h3 className="font-semibold text-sm">{goal.title}</h3>
            {goal.completed && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <CheckCircle2 size={18} className="text-green-600" fill="currentColor" />
              </motion.div>
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{goal.description}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
            <Clock size={12} />
            <span>
              {goal.completed
                ? 'Completed!'
                : daysRemaining === 0
                ? 'Due today'
                : `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} left`}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
            {goal.current.toFixed(1)}g
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            / {goal.target}g
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full ${
            goal.completed
              ? 'bg-green-500'
              : isUrgent
              ? 'bg-red-500'
              : 'bg-blue-500'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(goal.progress, 100)}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-600 dark:text-gray-400">
          {goal.progress.toFixed(0)}% complete
        </span>
        <span className="font-semibold text-yellow-600 dark:text-yellow-400">
          +{goal.reward.points} pts
        </span>
      </div>
    </motion.div>
  );
}



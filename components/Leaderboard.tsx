'use client';

import { motion } from 'framer-motion';
import { LeaderboardEntry } from '@/lib/gamificationData';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export default function Leaderboard({ entries }: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="text-yellow-500" fill="currentColor" />;
    if (rank === 2) return <Medal className="text-gray-400" fill="currentColor" />;
    if (rank === 3) return <Award className="text-orange-600" fill="currentColor" />;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300';
    if (rank === 2) return 'bg-gray-50 dark:bg-gray-800 border-gray-300';
    if (rank === 3) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-300';
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
  };

  return (
    <div className="space-y-2">
      {entries.map((entry, index) => (
        <motion.div
          key={entry.rank}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`
            p-3 rounded-lg border-2 ${getRankColor(entry.rank)}
            ${entry.isCurrentUser ? 'ring-2 ring-green-500' : ''}
            transition-all
          `}
        >
          <div className="flex items-center gap-3">
            {/* Rank */}
            <div className="flex items-center justify-center w-10">
              {getRankIcon(entry.rank) ? (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {getRankIcon(entry.rank)}
                </motion.div>
              ) : (
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  #{entry.rank}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className="text-2xl">{entry.avatar}</div>

            {/* User info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${entry.isCurrentUser ? 'text-green-600 dark:text-green-400' : ''}`}>
                  {entry.username}
                </span>
                {entry.isCurrentUser && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span>Lv.{entry.level}</span>
                <span>🔥 {entry.streak}</span>
                <span>🌿 {entry.carbonReduced}g</span>
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <div className="flex items-center gap-1">
                <TrendingUp size={14} className="text-yellow-500" />
                <span className="font-bold text-yellow-600 dark:text-yellow-400">
                  {entry.points.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-500">pts</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}



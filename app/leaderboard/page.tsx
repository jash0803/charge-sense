'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import Leaderboard from '@/components/Leaderboard';
import { generateLeaderboard } from '@/lib/gamificationData';
import { LeaderboardEntry } from '@/lib/gamificationData';
import { Trophy, TrendingUp, Users } from 'lucide-react';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [timeFilter, setTimeFilter] = useState<'all' | 'week' | 'month'>('all');

  useEffect(() => {
    setEntries(generateLeaderboard());
  }, []);

  const currentUser = entries.find(e => e.isCurrentUser);
  const topThree = entries.slice(0, 3);

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6 flex items-center gap-2"
          >
            <Trophy size={24} className="text-yellow-500" fill="currentColor" />
            Leaderboard
          </motion.h1>

          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <AnimatedCard variant="normal" className="mb-4" index={0}>
              <h2 className="text-lg font-semibold mb-4 text-center">Top 3</h2>
              <div className="flex items-end justify-center gap-2 mb-4">
                {/* 2nd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-3xl mb-2">{topThree[1].avatar}</div>
                  <div className="w-16 h-20 bg-gray-300 dark:bg-gray-600 rounded-t-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">2</span>
                  </div>
                  <p className="text-xs font-semibold mt-2">{topThree[1].username}</p>
                  <p className="text-xs text-gray-500">{topThree[1].points.toLocaleString()} pts</p>
                </motion.div>

                {/* 1st Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl mb-2"
                  >
                    {topThree[0].avatar}
                  </motion.div>
                  <div className="w-20 h-24 bg-yellow-400 dark:bg-yellow-600 rounded-t-lg flex items-center justify-center">
                    <Trophy size={32} className="text-yellow-800" fill="currentColor" />
                  </div>
                  <p className="text-xs font-semibold mt-2">{topThree[0].username}</p>
                  <p className="text-xs text-gray-500">{topThree[0].points.toLocaleString()} pts</p>
                </motion.div>

                {/* 3rd Place */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-3xl mb-2">{topThree[2].avatar}</div>
                  <div className="w-16 h-16 bg-orange-300 dark:bg-orange-600 rounded-t-lg flex items-center justify-center">
                    <span className="text-xl font-bold text-orange-800 dark:text-orange-200">3</span>
                  </div>
                  <p className="text-xs font-semibold mt-2">{topThree[2].username}</p>
                  <p className="text-xs text-gray-500">{topThree[2].points.toLocaleString()} pts</p>
                </motion.div>
              </div>
            </AnimatedCard>
          )}

          {/* Current User Rank */}
          {currentUser && (
            <AnimatedCard variant="eco" className="mb-4" index={1}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Rank</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                      #{currentUser.rank}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      of {entries.length}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <TrendingUp size={16} className="text-yellow-500" />
                    <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {currentUser.points.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            </AnimatedCard>
          )}

          {/* Full Leaderboard */}
          <AnimatedCard variant="normal" index={2}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users size={20} />
                Rankings
              </h2>
              <div className="flex gap-1">
                {(['all', 'week', 'month'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-2 py-1 rounded text-xs ${
                      timeFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            <Leaderboard entries={entries} />
          </AnimatedCard>
        </div>

        <Navigation />
      </div>
    </PageTransition>
  );
}



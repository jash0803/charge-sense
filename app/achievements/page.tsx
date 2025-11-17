'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import AchievementBadge from '@/components/AchievementBadge';
import { generateAchievements, generateUserProgress } from '@/lib/gamificationData';
import { Achievement } from '@/lib/gamificationData';
import { Trophy, Filter } from 'lucide-react';

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState(generateUserProgress());
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setAchievements(generateAchievements());
  }, []);

  const categories = ['all', 'charging', 'network', 'streak', 'carbon', 'challenge'];
  const filteredAchievements = achievements.filter(ach => {
    if (filter === 'unlocked' && !ach.unlocked) return false;
    if (filter === 'locked' && ach.unlocked) return false;
    if (selectedCategory !== 'all' && ach.category !== selectedCategory) return false;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

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
            Achievements
          </motion.h1>

          {/* Progress Summary */}
          <AnimatedCard variant="normal" className="mb-4" index={0}>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {unlockedCount} / {totalCount}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Achievements Unlocked
              </p>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </AnimatedCard>

          {/* Filters */}
          <AnimatedCard variant="normal" className="mb-4" index={1}>
            <div className="flex items-center gap-2 mb-3">
              <Filter size={18} />
              <span className="font-semibold text-sm">Filters</span>
            </div>
            <div className="space-y-3">
              {/* Status Filter */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Status</p>
                <div className="flex gap-2">
                  {(['all', 'unlocked', 'locked'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        filter === f
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {/* Category Filter */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Category</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* Achievements Grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">All Achievements</h2>
            <div className="grid grid-cols-2 gap-4">
              {filteredAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AnimatedCard variant="normal" index={index + 2}>
                    <div className="flex flex-col items-center text-center pb-2">
                      <div className="mb-4">
                        <AchievementBadge
                          achievement={achievement}
                          size="medium"
                          showProgress={!achievement.unlocked}
                        />
                      </div>
                      <h3 className="font-semibold text-sm mb-1 px-1">{achievement.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 px-1 line-clamp-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap justify-center">
                        <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full">
                          +{achievement.points} pts
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          achievement.rarity === 'legendary' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                          achievement.rarity === 'epic' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                          achievement.rarity === 'rare' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          Unlocked {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Navigation />
      </div>
    </PageTransition>
  );
}


'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import AchievementBadge from '@/components/AchievementBadge';
import { generateAchievements, generateUserProgress } from '@/lib/gamificationData';
import { Achievement } from '@/lib/gamificationData';
import { Trophy, Filter, X, MapPin, Sparkles } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userProgress, setUserProgress] = useState(generateUserProgress());
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const { settings } = useAccessibility();
  const disableMotion = settings.reduceMotion || settings.screenReaderMode;

  useEffect(() => {
    setAchievements(generateAchievements());
  }, []);

  useEffect(() => {
    if (selectedAchievement && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [selectedAchievement]);

  const handleOpenDetail = useCallback((achievement: Achievement) => {
    setSelectedAchievement(achievement);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedAchievement(null);
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
                  initial={disableMotion ? false : { opacity: 0, scale: 0.8 }}
                  animate={disableMotion ? undefined : { opacity: 1, scale: 1 }}
                  transition={disableMotion ? undefined : { delay: index * 0.05 }}
                >
                  <AnimatedCard variant="normal" index={index + 2}>
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(achievement)}
                      className="flex flex-col items-center text-center pb-2 w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-lg"
                      aria-label={`View details for ${achievement.name}`}
                    >
                      <div className="mb-4">
                        <AchievementBadge
                          achievement={achievement}
                          size="medium"
                          showProgress={!achievement.unlocked}
                        />
                      </div>
                      <h3 className="font-semibold text-sm mb-1 px-1">{achievement.name}</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 px-1 leading-snug">
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
                    </button>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <Navigation />
        <AnimatePresence>
          {selectedAchievement && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
              <button
                type="button"
                className="absolute inset-0 bg-black/60"
                aria-label="Close achievement detail"
                onClick={handleCloseDetail}
              />
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="achievement-detail-title"
                aria-describedby="achievement-detail-description"
                initial={disableMotion ? false : { opacity: 0, translateY: 50 }}
                animate={disableMotion ? undefined : { opacity: 1, translateY: 0 }}
                exit={disableMotion ? undefined : { opacity: 0, translateY: 50 }}
                transition={
                  disableMotion ? undefined : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
                }
                className="relative w-full sm:max-w-md mx-auto bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase font-semibold text-green-500 tracking-wider flex items-center gap-1">
                      <Sparkles size={14} aria-hidden="true" />
                      Achievement Detail
                    </p>
                    <h3
                      id="achievement-detail-title"
                      className="text-xl font-bold mt-1"
                    >
                      {selectedAchievement.name}
                    </h3>
                  </div>
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={handleCloseDetail}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    aria-label="Close detail view"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-5">
                  <AchievementBadge
                    achievement={selectedAchievement}
                    size="large"
                    showProgress={!selectedAchievement.unlocked}
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 capitalize">
                        {selectedAchievement.category}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full capitalize ${
                          selectedAchievement.rarity === 'legendary'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : selectedAchievement.rarity === 'epic'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : selectedAchievement.rarity === 'rare'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {selectedAchievement.rarity}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <MapPin size={14} aria-hidden="true" />
                      {selectedAchievement.unlocked ? 'Unlocked' : 'In progress'}
                      {selectedAchievement.unlockedDate &&
                        ` • ${new Date(
                          selectedAchievement.unlockedDate
                        ).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
                <p
                  id="achievement-detail-description"
                  className="text-sm text-gray-600 dark:text-gray-300 mb-5"
                >
                  {selectedAchievement.description}
                </p>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Progress</span>
                      <span className="font-semibold">
                        {Math.min(selectedAchievement.progress, 100)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: `${Math.min(selectedAchievement.progress, 100)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Target: {selectedAchievement.target} goal units
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Points</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      +{selectedAchievement.points}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}


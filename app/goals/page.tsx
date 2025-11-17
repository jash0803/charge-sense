'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import GoalsCard from '@/components/GoalsCard';
import ChallengeCard from '@/components/ChallengeCard';
import { generateGoals, generateChallenges } from '@/lib/gamificationData';
import { Goal, Challenge } from '@/lib/gamificationData';
import { Target, Trophy, Calendar } from 'lucide-react';

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<'goals' | 'challenges'>('goals');

  useEffect(() => {
    setGoals(generateGoals());
    setChallenges(generateChallenges());
  }, []);

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);
  const activeChallenges = challenges.filter(c => !c.completed && new Date(c.endDate) > new Date());
  const completedChallenges = challenges.filter(c => c.completed || new Date(c.endDate) <= new Date());

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
            <Target size={24} className="text-blue-500" fill="currentColor" />
            Goals & Challenges
          </motion.h1>

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-4">
            <motion.button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'goals'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Target size={18} />
                <span>Goals</span>
              </div>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab('challenges')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'challenges'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-2">
                <Trophy size={18} />
                <span>Challenges</span>
              </div>
            </motion.button>
          </div>

          {activeTab === 'goals' ? (
            <>
              {/* Active Goals */}
              {activeGoals.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar size={20} />
                    Active Goals
                  </h2>
                  <div className="space-y-3">
                    {activeGoals.map((goal, index) => (
                      <GoalsCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Goals */}
              {completedGoals.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Completed Goals</h2>
                  <div className="space-y-3">
                    {completedGoals.map((goal, index) => (
                      <GoalsCard key={goal.id} goal={goal} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Active Challenges */}
              {activeChallenges.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Trophy size={20} className="text-yellow-500" fill="currentColor" />
                    Active Challenges
                  </h2>
                  <div className="space-y-3">
                    {activeChallenges.map((challenge, index) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Challenges */}
              {completedChallenges.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Completed Challenges</h2>
                  <div className="space-y-3">
                    {completedChallenges.map((challenge, index) => (
                      <ChallengeCard key={challenge.id} challenge={challenge} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <Navigation />
      </div>
    </PageTransition>
  );
}



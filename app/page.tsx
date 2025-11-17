'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CarbonScoreBadge from '@/components/CarbonScoreBadge';
import AnimatedCard from '@/components/AnimatedCard';
import EnvironmentBar from '@/components/EnvironmentBar';
import Navigation from '@/components/Navigation';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import PageTransition from '@/components/PageTransition';
import ChargingPollutionAnimation from '@/components/ChargingPollutionAnimation';
import TreeImpactVisualization from '@/components/TreeImpactVisualization';
import StreakTracker from '@/components/StreakTracker';
import PointsDisplay from '@/components/PointsDisplay';
import LevelProgress from '@/components/LevelProgress';
import AchievementBadge from '@/components/AchievementBadge';
import ShareCard from '@/components/ShareCard';
import { useTheme } from '@/contexts/ThemeContext';
import { generateUserProgress, generateAchievements } from '@/lib/gamificationData';
import { motion } from 'framer-motion';
import {
  generateChargingSessions,
  getCurrentEnvironment,
  getTodaySessions,
  calculateCarbonImpact,
  getBehaviorInsights,
  getTimeBasedInsight,
} from '@/lib/mockData';
import { themes, getEmissionColor } from '@/lib/theme';
import { ChargingSession, EnvironmentState } from '@/lib/mockData';
import { ArrowRight, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { theme } = useTheme();
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [environment, setEnvironment] = useState<EnvironmentState | null>(null);
  const [carbonData, setCarbonData] = useState(calculateCarbonImpact([]));
  const [insights, setInsights] = useState<string[]>([]);
  const [isCharging, setIsCharging] = useState(false);
  const [prevBatteryLevel, setPrevBatteryLevel] = useState(0);
  const [userProgress, setUserProgress] = useState(generateUserProgress());
  const [recentAchievements, setRecentAchievements] = useState(generateAchievements().filter(a => a.unlocked).slice(0, 3));

  useEffect(() => {
    const initialSessions = generateChargingSessions();
    setSessions(initialSessions);
    const env = getCurrentEnvironment();
    setEnvironment(env);
    setPrevBatteryLevel(env.batteryLevel);
    setCarbonData(calculateCarbonImpact(initialSessions));
    setInsights(getBehaviorInsights(initialSessions));

    // Simulate real-time updates and charging detection
    const interval = setInterval(() => {
      const newEnv = getCurrentEnvironment();
      const batteryIncreased = newEnv.batteryLevel > prevBatteryLevel;
      
      // Detect charging: battery level increased or is at 100%
      if (batteryIncreased || newEnv.batteryLevel === 100) {
        setIsCharging(true);
        // Simulate charging session
        setTimeout(() => setIsCharging(false), 10000);
      } else {
        setIsCharging(false);
      }
      
      setPrevBatteryLevel(newEnv.batteryLevel);
      setEnvironment(newEnv);
    }, 5000);

    return () => clearInterval(interval);
  }, [prevBatteryLevel]);

  if (!environment) return null;

  const todaySessions = getTodaySessions(sessions);
  const lastSession = todaySessions[0] || sessions[0];
  const themeColors = themes[theme];
  const emissionColor = getEmissionColor(carbonData.today);

  return (
    <PageTransition>
      <div
        className="min-h-screen pb-20"
        style={{
          background: typeof themeColors.background === 'string' && themeColors.background.includes('gradient')
            ? themeColors.background
            : themeColors.background,
          color: themeColors.text,
        }}
      >
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Carbon Impact Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-6"
          >
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold mb-2"
            >
              Your CO₂ impact today
            </motion.h1>
            <CarbonScoreBadge emission={carbonData.today} />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-2 text-sm"
              style={{ color: emissionColor }}
            >
              Emission Level: {carbonData.today < 10 ? 'Low' : carbonData.today < 20 ? 'Moderate' : 'High'}
            </motion.p>
          </motion.div>

          {/* Time-based Insight */}
          <AnimatedCard variant="normal" className="mb-4" index={0}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              {getTimeBasedInsight(theme)}
            </motion.p>
          </AnimatedCard>

          {/* Charging Summary Card */}
          {lastSession && (
            <AnimatedCard variant="normal" className="mb-4" index={1}>
              <motion.h2
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg font-semibold mb-3"
              >
                Last Charging Session
              </motion.h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                {[
                  { label: 'Start → End', value: `${lastSession.startPercent}% → ${lastSession.endPercent}%` },
                  { label: 'Estimated CO₂', value: `${lastSession.co2Emitted}g` },
                  { label: 'Time Plugged In', value: `${lastSession.duration} min` },
                  { label: 'Charger Type', value: lastSession.chargerType },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                    className="flex justify-between"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatedCard>
          )}

          {/* Behaviour Insight Card */}
          <AnimatedCard variant="normal" className="mb-4" index={2}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg font-semibold mb-3 flex items-center gap-2"
            >
              <TrendingUp size={18} />
              Behaviour Insights
            </motion.h2>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  • {insight}
                </motion.p>
              ))}
            </div>
          </AnimatedCard>

          {/* Real-time Environment Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-4"
          >
            <EnvironmentBar
              networkType={environment.networkType}
              motionState={environment.motionState}
              lightLevel={environment.lightLevel}
              batteryLevel={environment.batteryLevel}
            />
          </motion.div>

          {/* Gamification Summary */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <AnimatedCard variant="normal" index={3}>
              <StreakTracker
                currentStreak={userProgress.currentStreak}
                longestStreak={userProgress.longestStreak}
              />
            </AnimatedCard>
            <AnimatedCard variant="normal" index={4}>
              <PointsDisplay points={userProgress.points} size="medium" />
            </AnimatedCard>
          </div>

          {/* Level Progress */}
          <AnimatedCard variant="normal" className="mb-4" index={5}>
            <LevelProgress
              level={userProgress.level}
              xp={userProgress.xp}
              xpToNextLevel={userProgress.xpToNextLevel}
            />
          </AnimatedCard>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <AnimatedCard variant="eco" className="mb-4" index={6}>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                Recent Achievements
              </h2>
              <div className="flex gap-3 justify-center">
                {recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AchievementBadge achievement={achievement} size="small" />
                  </motion.div>
                ))}
              </div>
            </AnimatedCard>
          )}

          {/* Tree Impact Visualization */}
          <AnimatedCard variant="normal" className="mb-4" index={7}>
            <TreeImpactVisualization co2Emission={carbonData.today} />
          </AnimatedCard>

          {/* Charging Pollution Animation */}
          <AnimatedCard variant="alert" className="mb-4" index={8}>
            <h2 className="text-lg font-semibold mb-3 text-center">
              Charging Impact Visualization
            </h2>
            <ChargingPollutionAnimation
              charging={isCharging}
              chargeRate={lastSession ? Math.min(1, lastSession.co2Emitted / 5) : 0.5}
              showToggle={true}
            />
          </AnimatedCard>

          {/* Share Card */}
          <AnimatedCard variant="normal" className="mb-4" index={9}>
            <ShareCard progress={userProgress} co2Today={carbonData.today} />
          </AnimatedCard>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Link href="/achievements">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatedCard variant="normal" className="text-center py-3 cursor-pointer text-gray-900 dark:text-gray-100">
                  <div className="text-2xl mb-1">🏆</div>
                  <div className="text-xs font-semibold">Achievements</div>
                </AnimatedCard>
              </motion.div>
            </Link>
            <Link href="/goals">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatedCard variant="normal" className="text-center py-3 cursor-pointer text-gray-900 dark:text-gray-100">
                  <div className="text-2xl mb-1">🎯</div>
                  <div className="text-xs font-semibold">Goals</div>
                </AnimatedCard>
              </motion.div>
            </Link>
            <Link href="/leaderboard">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatedCard variant="normal" className="text-center py-3 cursor-pointer text-gray-900 dark:text-gray-100">
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-xs font-semibold">Leaderboard</div>
                </AnimatedCard>
              </motion.div>
            </Link>
          </div>

          {/* CTA Buttons Row */}
          <div className="space-y-3">
            {[
              { href: '/charging', label: 'View Charging Patterns', variant: 'normal' as const },
              { href: '/carbon', label: 'See CO₂ Breakdown', variant: 'normal' as const },
              { href: '/recommendations', label: 'Improve My Habits', variant: 'eco' as const },
            ].map((button, index) => (
              <motion.div
                key={button.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={button.href}>
                  <AnimatedCard variant={button.variant} className="cursor-pointer text-gray-900 dark:text-gray-100">
                    <motion.div
                      className="flex items-center justify-between"
                      whileHover={{ x: 5 }}
                    >
                      <span className="font-semibold">{button.label}</span>
                      <ArrowRight size={20} className="text-gray-500 dark:text-gray-300" />
                    </motion.div>
                  </AnimatedCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <ThemeSwitcher />
        <Navigation />
      </div>
    </PageTransition>
  );
}


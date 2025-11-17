'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import FeedbackWidget from '@/components/FeedbackWidget';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { useTheme } from '@/contexts/ThemeContext';
import {
  generateChargingSessions,
  getCurrentEnvironment,
  getBehaviorInsights,
} from '@/lib/mockData';
import { ChargingSession, EnvironmentState } from '@/lib/mockData';
import { Lightbulb, CheckCircle, AlertCircle, Sun, Moon } from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

export default function Recommendations() {
  const { theme } = useTheme();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [environment, setEnvironment] = useState<EnvironmentState | null>(null);
  const [isInMotion, setIsInMotion] = useState(false);

  useEffect(() => {
    const sessions = generateChargingSessions();
    const env = getCurrentEnvironment();
    const insights = getBehaviorInsights(sessions);

    setEnvironment(env);
    setIsInMotion(env?.motionState !== 'Stationary');

    // Generate personalized recommendations
    const recs: Recommendation[] = [];

    // Time-based recommendations
    if (theme === 'night') {
      recs.push({
        id: 'night-1',
        title: 'Avoid Overnight Charging',
        description: 'Overnight charging creates higher peak-load emissions. Try charging during daylight hours when the grid uses more renewable energy.',
        priority: 'high',
        icon: '🌙',
      });
    } else if (theme === 'morning') {
      recs.push({
        id: 'morning-1',
        title: 'Plan Your Charging',
        description: 'Plan your charging for the day. Aim to charge between 20-80% for optimal emissions and battery health.',
        priority: 'medium',
        icon: '☀️',
      });
    }

    // Behavior-based recommendations
    const avgStartPercent = sessions.reduce((sum, s) => sum + s.startPercent, 0) / sessions.length;
    if (avgStartPercent < 15) {
      recs.push({
        id: 'behavior-1',
        title: 'Charge Earlier',
        description: 'Your typical charging level is below 15%, which causes battery strain and increases carbon emissions. Try charging when battery is between 20-80%.',
        priority: 'high',
        icon: '⚠️',
      });
    }

    const fastChargeCount = sessions.filter(s => s.chargerType === 'Fast').length;
    if (fastChargeCount > sessions.length * 0.5) {
      recs.push({
        id: 'behavior-2',
        title: 'Reduce Fast-Charging',
        description: 'You use fast-charging frequently. While convenient, it increases CO₂ emissions. Use slow charging when time permits.',
        priority: 'medium',
        icon: '🌀',
      });
    }

    // Network-based recommendations
    if (env?.networkType === 'Mobile Data') {
      recs.push({
        id: 'network-1',
        title: 'Switch to WiFi',
        description: 'Mobile data increases energy consumption. Switch to WiFi at home to reduce your carbon footprint.',
        priority: 'high',
        icon: '📶',
      });
    }

    // General recommendations
    recs.push({
      id: 'general-1',
      title: 'Optimal Charging Range',
      description: 'Charge between 20-80% for optimal emissions. This range is most efficient and better for battery health.',
      priority: 'low',
      icon: '🌿',
    });

    if (theme === 'day') {
      recs.push({
        id: 'general-2',
        title: 'Charge During Sunlight Hours',
        description: 'Charging during sunlight hours (10 AM - 6 PM) often uses greener grid energy with more renewable sources.',
        priority: 'medium',
        icon: '☀️',
      });
    }

    setRecommendations(recs);

    const interval = setInterval(() => {
      const updatedEnv = getCurrentEnvironment();
      setEnvironment(updatedEnv);
      setIsInMotion(updatedEnv?.motionState !== 'Stationary');
    }, 5000);

    return () => clearInterval(interval);
  }, [theme]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-green-600 dark:text-green-400';
    }
  };

  const getPriorityVariant = (priority: string): 'normal' | 'warning' | 'alert' | 'eco' => {
    switch (priority) {
      case 'high':
        return 'alert';
      case 'medium':
        return 'warning';
      default:
        return 'eco';
    }
  };

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
            <Lightbulb size={24} />
            Recommendations
          </motion.h1>

          {/* Time-based header */}
          <AnimatedCard variant="normal" className="mb-4" index={0}>
          <div className="flex items-center gap-2 mb-2">
            {theme === 'night' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="font-semibold">
              {theme === 'night'
                ? 'Night Mode'
                : theme === 'morning'
                ? 'Morning Mode'
                : theme === 'day'
                ? 'Day Mode'
                : 'Evening Mode'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {theme === 'night'
              ? 'Overnight charging creates higher peak-load emissions.'
              : theme === 'morning'
              ? 'Plan your charging for the day.'
              : theme === 'day'
              ? 'Your highest carbon emissions happen around lunch.'
              : "You tend to fast-charge at night. Here's how to reduce emissions."}
          </p>
          </AnimatedCard>

          {/* Recommendations List */}
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={rec.id}
                className="observation-target rounded-3xl"
                data-observation-label={`recommendation-${rec.priority}`}
              >
                <AnimatedCard variant={getPriorityVariant(rec.priority)} index={index + 1}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <h3 className="font-semibold">{rec.title}</h3>
                          <span className={`text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                            {rec.priority.toUpperCase()}
                          </span>
                        </div>
                        <p
                          className={`text-sm ${
                            isInMotion
                              ? 'text-gray-700 dark:text-gray-300'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {isInMotion ? `${rec.description.substring(0, 80)}...` : rec.description}
                        </p>
                      </div>
                    </div>
                    <FeedbackWidget entityId={rec.id} scope="recommendations" />
                  </div>
                </AnimatedCard>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <AnimatedCard variant="eco" className="mt-6" index={recommendations.length + 1}>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle size={18} />
            Quick Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• Charge between 20-80% for optimal emissions</li>
            <li>• Switch to WiFi at home when possible</li>
            <li>• Avoid fast-charging late at night</li>
            <li>• Charge during sunlight hours for greener grid energy</li>
          </ul>
          </AnimatedCard>
        </div>

        <Navigation />
      </div>
    </PageTransition>
  );
}


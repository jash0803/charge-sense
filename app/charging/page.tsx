'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import BehaviourBadge from '@/components/BehaviourBadge';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { generateChargingSessions, getBehaviorInsights } from '@/lib/mockData';
import { ChargingSession } from '@/lib/mockData';
import { getChargingStartColor } from '@/lib/theme';
import { Battery, Clock, Zap } from 'lucide-react';

export default function ChargingBehaviour() {
  const [sessions, setSessions] = useState<ChargingSession[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    const initialSessions = generateChargingSessions();
    setSessions(initialSessions);
    setInsights(getBehaviorInsights(initialSessions));
  }, []);

  // Prepare data for charts
  const timelineData = sessions.slice(0, 10).map((session, index) => ({
    name: `Session ${index + 1}`,
    startPercent: session.startPercent,
    endPercent: session.endPercent,
    color: getChargingStartColor(session.startPercent),
  }));

  const startPercentData = sessions.reduce((acc, session) => {
    const range = session.startPercent < 15 ? '<15%' : 
                  session.startPercent < 30 ? '15-30%' :
                  session.startPercent < 80 ? '30-80%' : '>80%';
    acc[range] = (acc[range] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const startPercentChartData = Object.entries(startPercentData).map(([range, count]) => ({
    range,
    count,
    color: range === '<15%' ? '#E84747' : 
           range === '15-30%' ? '#FFCF4A' :
           range === '30-80%' ? '#37C66D' : '#4A90E2',
  }));

  // Behavior flags
  const avgStartPercent = sessions.reduce((sum, s) => sum + s.startPercent, 0) / sessions.length;
  const fastChargeCount = sessions.filter(s => s.chargerType === 'Fast').length;
  const lowStartCount = sessions.filter(s => s.startPercent < 15).length;
  const neverReach80 = sessions.filter(s => s.endPercent < 80).length;

  const hasBatteryAnxiety = lowStartCount > sessions.length * 0.3;
  const isFastChargeHeavy = fastChargeCount > sessions.length * 0.5;
  const isEcoCharging = avgStartPercent >= 20 && avgStartPercent <= 80;
  const isPartialCharging = neverReach80 > sessions.length * 0.5;

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6"
          >
            Charging Behaviour
          </motion.h1>

          {/* Charging Timeline Graph */}
          <AnimatedCard variant="normal" className="mb-4" index={0}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg font-semibold mb-4"
            >
              Charge Start % Over Time
            </motion.h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip animationDuration={300} />
                <Line 
                  type="monotone" 
                  dataKey="startPercent" 
                  stroke="#37C66D" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  animationDuration={1000}
                  animationBegin={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnimatedCard>

          {/* Start % Distribution */}
          <AnimatedCard variant="normal" className="mb-4" index={1}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-semibold mb-4"
            >
              Start % Distribution
            </motion.h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={startPercentChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip animationDuration={300} />
                <Bar 
                  dataKey="count" 
                  fill="#37C66D"
                  animationDuration={1000}
                  animationBegin={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </AnimatedCard>

          {/* Behaviour Flags */}
          <AnimatedCard 
            variant={hasBatteryAnxiety ? 'alert' : isPartialCharging ? 'normal' : 'eco'} 
            className="mb-4"
            index={2}
          >
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg font-semibold mb-3"
            >
              Behaviour Patterns
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-3"
            >
              {hasBatteryAnxiety && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  <BehaviourBadge icon="⚠️" label="Battery Anxiety" variant="warning" />
                </motion.div>
              )}
              {isFastChargeHeavy && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: "spring" }}
                >
                  <BehaviourBadge icon="🌀" label="Fast-charge Heavy" variant="info" />
                </motion.div>
              )}
              {isEcoCharging && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <BehaviourBadge icon="🌿" label="Eco Charging" variant="success" />
                </motion.div>
              )}
              {isPartialCharging && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: "spring" }}
                >
                  <BehaviourBadge icon="🔌" label="Partial Charging" variant="info" />
                </motion.div>
              )}
            </motion.div>
            {hasBatteryAnxiety && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-red-700 dark:text-red-300"
              >
                Your battery anxiety pattern increases carbon emissions. Try charging earlier.
              </motion.p>
            )}
            {isPartialCharging && !hasBatteryAnxiety && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-sm text-blue-700 dark:text-blue-300"
              >
                Partial charging detected — good for battery health!
              </motion.p>
            )}
          </AnimatedCard>

          {/* Session List */}
          <AnimatedCard variant="normal" index={3}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg font-semibold mb-4"
            >
              Recent Sessions
            </motion.h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sessions.slice(0, 10).map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05, duration: 0.3 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {new Date(session.startTime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      , {new Date(session.startTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      {session.chargerType}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Battery size={14} />
                      <span>Start {session.startPercent}% → End {session.endPercent}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{session.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap size={14} />
                      <span>{session.co2Emitted}g CO₂</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedCard>
        </div>

        <Navigation />
      </div>
    </PageTransition>
  );
}


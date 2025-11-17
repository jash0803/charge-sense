'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { getCurrentEnvironment, getAppUsage } from '@/lib/mockData';
import { EnvironmentState, AppUsage } from '@/lib/mockData';
import { Wifi, Signal, Move, TrendingUp } from 'lucide-react';

export default function DigitalHabits() {
  const [environment, setEnvironment] = useState<EnvironmentState | null>(null);
  const [appUsage, setAppUsage] = useState<AppUsage[]>([]);
  const [networkHistory, setNetworkHistory] = useState<{ wifi: number; mobile: number }>({ wifi: 0, mobile: 0 });

  useEffect(() => {
    setEnvironment(getCurrentEnvironment());
    setAppUsage(getAppUsage());
    
    // Simulate network history (70% WiFi, 30% Mobile)
    setNetworkHistory({ wifi: 70, mobile: 30 });

    const interval = setInterval(() => {
      setEnvironment(getCurrentEnvironment());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!environment) return null;

  const isMobileDataOnly = environment.networkType === 'Mobile Data';
  const isInMotion = environment.motionState !== 'Stationary';
  const isLowLight = environment.lightLevel === 'Dim';

  // Prepare app usage data
  const appUsageData = appUsage.map(app => ({
    name: app.appName.length > 10 ? app.appName.substring(0, 10) + '...' : app.appName,
    duration: app.duration,
  }));

  // Network pattern data
  const networkData = [
    { name: 'WiFi', value: networkHistory.wifi, color: '#37C66D' },
    { name: 'Mobile Data', value: networkHistory.mobile, color: '#FFCF4A' },
  ];

  // Motion pattern data (simulated)
  const motionData = [
    { name: 'Stationary', value: 60, color: '#4A90E2' },
    { name: 'Walking', value: 30, color: '#37C66D' },
    { name: 'Running', value: 10, color: '#E84747' },
  ];

  return (
    <PageTransition>
      <div className={`min-h-screen pb-20 ${isLowLight ? 'bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'}`}>
        <div className="max-w-md mx-auto px-4 py-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6"
          >
            Digital Habits
          </motion.h1>

          {/* Mobile Data Warning */}
          {isMobileDataOnly && (
            <AnimatedCard variant="warning" className="mb-4" index={0}>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium text-yellow-800 dark:text-yellow-200"
              >
                ⚠️ Mobile data increases energy consumption.
              </motion.p>
            </AnimatedCard>
          )}

          {/* App Usage Timeline */}
          <AnimatedCard variant={isInMotion ? 'motion' : 'normal'} className="mb-4" index={1}>
          <h2 className="text-lg font-semibold mb-4">Top Apps Usage</h2>
          {isInMotion ? (
            <div className="space-y-2">
              {appUsage.slice(0, 3).map((app, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <span className="text-sm font-medium">{app.appName}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{app.duration} min</span>
                </div>
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={appUsageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="duration" fill="#37C66D" />
              </BarChart>
            </ResponsiveContainer>
          )}
          </AnimatedCard>

          {/* Motion Pattern Card */}
          <AnimatedCard variant="normal" className="mb-4" index={2}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Move size={18} />
            Motion Patterns
          </h2>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={motionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {motionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          </AnimatedCard>

          {/* Network Pattern Card */}
          <AnimatedCard variant={isMobileDataOnly ? 'warning' : 'normal'} className="mb-4" index={3}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {environment.networkType === 'WiFi' ? <Wifi size={18} /> : <Signal size={18} />}
            Network Usage
          </h2>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie
                data={networkData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {networkData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2"
          >
            Current: {environment.networkType}
          </motion.p>
          </AnimatedCard>

          {/* Top Apps List */}
          {!isInMotion && (
            <AnimatedCard variant="normal" index={4}>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={18} />
              App Usage Details
            </h2>
            <div className="space-y-2">
              {appUsage.map((app, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{app.appName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{app.category}</p>
                  </div>
                  <span className="text-sm font-semibold">{app.duration} min</span>
                </div>
              ))}
            </div>
          </AnimatedCard>
        )}
        </div>

        <Navigation />
      </div>
    </PageTransition>
  );
}


'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import CarbonScoreBadge from '@/components/CarbonScoreBadge';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import TreeImpactVisualization from '@/components/TreeImpactVisualization';
import { generateChargingSessions, calculateCarbonImpact } from '@/lib/mockData';
import { CarbonData } from '@/lib/mockData';
import { getEmissionColor } from '@/lib/theme';
import { Leaf, TrendingDown, TrendingUp } from 'lucide-react';

export default function CarbonAwareness() {
  const [carbonData, setCarbonData] = useState<CarbonData | null>(null);
  const [isHighEmission, setIsHighEmission] = useState(false);

  useEffect(() => {
    const sessions = generateChargingSessions();
    const data = calculateCarbonImpact(sessions);
    setCarbonData(data);
    setIsHighEmission(data.today >= 20);
  }, []);

  if (!carbonData) return null;

  const emissionColor = getEmissionColor(carbonData.today);
  const isLowEmission = carbonData.today < 10;

  // Weekly data for chart
  const weeklyData = carbonData.weekly.map((value, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      co2: value,
    };
  });

  // Breakdown data for pie chart
  const breakdownData = [
    { name: 'Charging', value: carbonData.breakdown.charging, color: '#37C66D' },
    { name: 'Fast-charging', value: carbonData.breakdown.fastCharging, color: '#FFCF4A' },
    { name: 'Network Type', value: carbonData.breakdown.networkType, color: '#4A90E2' },
    { name: 'Screen Brightness', value: carbonData.breakdown.screenBrightness, color: '#E84747' },
  ];

  const averageEmission = carbonData.weekly.reduce((sum, val) => sum + val, 0) / carbonData.weekly.length;
  const comparison = carbonData.today > averageEmission ? 'above' : 'below';

  return (
    <PageTransition>
      <div
        className={`min-h-screen pb-20 transition-colors duration-500 ${
          isHighEmission
            ? 'bg-red-50 dark:bg-red-900/10'
            : isLowEmission
            ? 'bg-green-50 dark:bg-green-900/10'
            : 'bg-gray-50 dark:bg-gray-900'
        }`}
      >
        <div className="max-w-md mx-auto px-4 py-6">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-2xl font-bold mb-6 flex items-center gap-2"
          >
            <Leaf size={24} />
            Carbon Awareness
          </motion.h1>

        {/* CO₂ Gauge */}
        <div className="text-center mb-6">
          <CarbonScoreBadge emission={carbonData.today} size={150} />
          <p
            className={`mt-4 text-lg font-semibold ${
              isHighEmission
                ? 'text-red-700 dark:text-red-300'
                : isLowEmission
                ? 'text-green-700 dark:text-green-300'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {isHighEmission
              ? `Your charging today produced ${carbonData.today}g CO₂.`
              : isLowEmission
              ? `Great job! You kept your CO₂ footprint minimal.`
              : `Your CO₂ impact today: ${carbonData.today}g`}
          </p>
        </div>

          {/* Weekly Carbon Bar Chart */}
          <AnimatedCard variant={isHighEmission ? 'alert' : isLowEmission ? 'eco' : 'normal'} className="mb-4" index={1}>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg font-semibold mb-4"
            >
              Weekly Carbon Emissions
            </motion.h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip animationDuration={300} />
                <Bar 
                  dataKey="co2" 
                  fill={emissionColor}
                  animationDuration={1000}
                  animationBegin={200}
                />
              </BarChart>
            </ResponsiveContainer>
          </AnimatedCard>

          {/* Comparison Card */}
          <AnimatedCard variant="normal" className="mb-4" index={2}>
          <h2 className="text-lg font-semibold mb-3">You vs Average</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Today's Emission</p>
              <p className="text-2xl font-bold" style={{ color: emissionColor }}>
                {carbonData.today}g
              </p>
            </div>
            <div className="flex items-center gap-2">
              {comparison === 'above' ? (
                <TrendingUp size={24} className="text-red-500" />
              ) : (
                <TrendingDown size={24} className="text-green-500" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Average</p>
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                {averageEmission.toFixed(1)}g
              </p>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
            You are {Math.abs(carbonData.today - averageEmission).toFixed(1)}g {comparison} average
          </p>
          </AnimatedCard>

          {/* Tree Impact Visualization */}
          <AnimatedCard variant="normal" className="mb-4" index={3}>
            <TreeImpactVisualization co2Emission={carbonData.today} />
          </AnimatedCard>

          {/* Breakdown Card */}
          <AnimatedCard variant="normal" className="mb-4" index={4}>
          <h2 className="text-lg font-semibold mb-4">What caused today's emissions?</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {breakdownData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">{item.value.toFixed(1)}g</span>
              </div>
            ))}
          </div>
          </AnimatedCard>
        </div>

        <Navigation />
      </div>
    </PageTransition>
  );
}


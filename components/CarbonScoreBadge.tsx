'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getEmissionColor, getEmissionLevel } from '@/lib/theme';

interface CarbonScoreBadgeProps {
  emission: number;
  size?: number;
}

export default function CarbonScoreBadge({ emission, size = 120 }: CarbonScoreBadgeProps) {
  const [animatedEmission, setAnimatedEmission] = useState(0);
  const color = getEmissionColor(emission);
  const level = getEmissionLevel(emission);
  const percentage = Math.min(100, (emission / 30) * 100); // Assuming 30g is max for visualization
  
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const strokeDasharray = circumference;
  const animatedPercentage = Math.min(100, (animatedEmission / 30) * 100);
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepValue = emission / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setAnimatedEmission(Math.min(emission, stepValue * currentStep));
      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedEmission(emission);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [emission]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative flex flex-col items-center justify-center"
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute flex flex-col items-center justify-center"
      >
        <motion.span
          key={emission}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold"
          style={{ color }}
        >
          {animatedEmission.toFixed(1)}g
        </motion.span>
        <span className="text-xs text-gray-500 dark:text-gray-400">CO₂</span>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-2 text-sm font-semibold"
        style={{ color }}
      >
        {level}
      </motion.div>
    </motion.div>
  );
}


'use client';

import { motion } from 'framer-motion';
import { Wifi, Signal, Move, Sun, Moon, Battery } from 'lucide-react';
import { getBatteryColor } from '@/lib/theme';

interface EnvironmentBarProps {
  networkType: 'WiFi' | 'Mobile Data';
  motionState: 'Stationary' | 'Walking' | 'Running';
  lightLevel: 'Dim' | 'Bright';
  batteryLevel: number;
}

export default function EnvironmentBar({
  networkType,
  motionState,
  lightLevel,
  batteryLevel,
}: EnvironmentBarProps) {
  const batteryColor = getBatteryColor(batteryLevel);
  const isLowBattery = batteryLevel < 10;

  const items = [
    {
      icon: networkType === 'WiFi' ? Wifi : Signal,
      label: networkType,
      key: 'network',
    },
    {
      icon: Move,
      label: motionState,
      key: 'motion',
    },
    {
      icon: lightLevel === 'Bright' ? Sun : Moon,
      label: lightLevel,
      key: 'light',
    },
    {
      icon: Battery,
      label: `${batteryLevel}%`,
      key: 'battery',
      color: batteryColor,
      pulse: isLowBattery,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
    >
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={item.pulse ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon
                size={18}
                className={item.pulse ? 'pulse-battery' : 'text-gray-600 dark:text-gray-400'}
                style={item.color ? { color: item.color } : {}}
              />
            </motion.div>
            <motion.span
              key={item.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-semibold"
              style={item.color ? { color: item.color } : { color: 'inherit' }}
            >
              {item.label}
            </motion.span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}


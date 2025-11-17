'use client';

import { motion } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings as SettingsIcon, Bell, Moon, Sun, BarChart3, Palette } from 'lucide-react';

export default function Settings() {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themeOptions = [
    { value: 'auto', label: 'Auto (Time-based)', icon: '🕐' },
    { value: 'night', label: 'Night Mode', icon: '🌙' },
    { value: 'morning', label: 'Morning Mode', icon: '🌅' },
    { value: 'day', label: 'Day Mode', icon: '☀️' },
    { value: 'evening', label: 'Evening Mode', icon: '🌆' },
  ];

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
            <SettingsIcon size={24} />
            Settings
          </motion.h1>

          {/* Theme Settings */}
          <AnimatedCard variant="normal" className="mb-4" index={0}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Palette size={20} />
            Theme Settings
          </h2>
          <div className="space-y-3">
            <div className="mb-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Current Theme: <span className="font-semibold capitalize">{theme}</span>
              </p>
              {themeMode === 'auto' && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  Theme changes automatically based on time of day
                </p>
              )}
            </div>
            <div className="space-y-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setThemeMode(option.value as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    themeMode === option.value
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span className="text-xl">{option.icon}</span>
                  <span className="flex-1 text-left font-medium">{option.label}</span>
                  {themeMode === option.value && (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
          </AnimatedCard>

          {/* App Settings */}
          <AnimatedCard variant="normal" className="mb-4" index={1}>
          <h2 className="text-lg font-semibold mb-4">App Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} />
                <span>Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon size={20} />
                <span>Dark Mode</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 size={20} />
                <span>Data Collection</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
          </AnimatedCard>

          {/* About */}
          <AnimatedCard variant="normal" className="mb-4" index={2}>
          <h2 className="text-lg font-semibold mb-4">About ChargeSense</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            A behaviour-adaptive carbon-impact smartphone assistant that helps you reduce your carbon footprint through intelligent charging habits.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Build</span>
              <span className="font-medium">2024.01</span>
            </div>
          </div>
          </AnimatedCard>

          {/* Credits */}
          <AnimatedCard variant="normal" index={3}>
          <h2 className="text-lg font-semibold mb-4">Credits</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ChargeSense uses real-time sensor data to provide personalized recommendations for reducing your carbon impact.
          </p>
          </AnimatedCard>
        </div>

        <Navigation />
      </div>
    </PageTransition>
  );
}


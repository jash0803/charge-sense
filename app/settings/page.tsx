'use client';

import { motion } from 'framer-motion';
import AnimatedCard from '@/components/AnimatedCard';
import Navigation from '@/components/Navigation';
import PageTransition from '@/components/PageTransition';
import { useTheme } from '@/contexts/ThemeContext';
import { useAccessibility, AccessibilitySettingKey } from '@/contexts/AccessibilityContext';
import { useResearch } from '@/contexts/ResearchContext';
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  BarChart3,
  Palette,
  UserCheck,
  Eye,
  Type,
  Volume2,
  Wind,
  FlaskConical,
  Activity,
  ClipboardList,
} from 'lucide-react';

export default function Settings() {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { settings: accessibilitySettings, updateSetting, resetSettings } = useAccessibility();
  const {
    observationMode,
    eventLoggingEnabled,
    eventLog,
    toggleObservationMode,
    setEventLoggingEnabled,
    clearEventLog,
  } = useResearch();

  const formatEventTime = (timestamp: number) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const recentEvents = eventLog.slice(0, 4);
  const getEventLabel = (metadata?: Record<string, unknown>) => {
    if (!metadata) return undefined;
    const maybeLabel = metadata.label;
    return typeof maybeLabel === 'string' ? maybeLabel : undefined;
  };

  const themeOptions = [
    { value: 'auto', label: 'Auto (Time-based)', icon: '🕐' },
    { value: 'night', label: 'Night Mode', icon: '🌙' },
    { value: 'morning', label: 'Morning Mode', icon: '🌅' },
    { value: 'day', label: 'Day Mode', icon: '☀️' },
    { value: 'evening', label: 'Evening Mode', icon: '🌆' },
  ];

  const accessibilityOptions: {
    key: AccessibilitySettingKey;
    label: string;
    description: string;
    Icon: typeof Eye;
  }[] = [
    {
      key: 'screenReaderMode',
      label: 'Screen Reader Mode',
      description: 'Adds skip links, persistent focus outlines, and aria helpers for blind users.',
      Icon: Volume2,
    },
    {
      key: 'highContrast',
      label: 'High Contrast Colors',
      description: 'Boosts contrast, simplifies color palettes, and improves icon visibility.',
      Icon: Eye,
    },
    {
      key: 'largeText',
      label: 'Larger Text',
      description: 'Increases base font sizes for improved readability across the experience.',
      Icon: Type,
    },
    {
      key: 'reduceMotion',
      label: 'Reduce Motion',
      description: 'Disables complex transitions, parallax effects, and hover animations.',
      Icon: Wind,
    },
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

          {/* Accessibility Settings */}
          <AnimatedCard variant="normal" className="mb-4" index={1}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <UserCheck size={20} />
            Accessibility
          </h2>
          <div className="space-y-5">
            {accessibilityOptions.map((option) => {
              const OptionIcon = option.Icon;
              const isEnabled = accessibilitySettings[option.key];
              const controlId = `a11y-${option.key}`;

              return (
                <div
                  key={option.key}
                  className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <OptionIcon size={20} aria-hidden="true" focusable={false} />
                      <span className="font-medium">{option.label}</span>
                      <span
                        className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400"
                        aria-hidden={!isEnabled}
                      >
                        {isEnabled ? 'On' : ''}
                      </span>
                    </div>
                    <p
                      id={`${controlId}-description`}
                      className="text-sm text-gray-600 dark:text-gray-400 mt-1"
                    >
                      {option.description}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id={controlId}
                      type="checkbox"
                      className="sr-only peer"
                      checked={isEnabled}
                      onChange={(event) => updateSetting(option.key, event.target.checked)}
                      aria-describedby={`${controlId}-description`}
                      aria-checked={isEnabled}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
              );
            })}
            <button
              type="button"
              onClick={resetSettings}
              className="text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline self-start"
            >
              Reset accessibility defaults
            </button>
          </div>
          </AnimatedCard>

          {/* App Settings */}
          <AnimatedCard variant="normal" className="mb-4" index={2}>
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

          {/* Research Hooks */}
          <AnimatedCard variant="warning" className="mb-4" index={3}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FlaskConical size={20} />
            Research & Testing Hooks
          </h2>
          <div className="space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Activity size={18} />
                  <span className="font-medium">Observation mode</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Adds persistent focus outlines and annotation badges for usability studies.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={observationMode}
                  onChange={() => toggleObservationMode()}
                  aria-checked={observationMode}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 dark:peer-focus:ring-orange-900 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-orange-500 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
              </label>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Activity size={18} />
                  <span className="font-medium">Event logging</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Capture click, focus, and keyboard events while testing flows.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={eventLoggingEnabled}
                  onChange={(event) => setEventLoggingEnabled(event.target.checked)}
                  aria-checked={eventLoggingEnabled}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 dark:peer-focus:ring-orange-900 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:bg-orange-500 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
              </label>
            </div>

            <div className="observation-target rounded-2xl border border-dashed border-gray-200 bg-gray-50/70 p-3 dark:border-gray-700 dark:bg-gray-900/40" data-observation-label="event-log">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ClipboardList size={16} />
                  Recent events
                </div>
                <button
                  type="button"
                  onClick={clearEventLog}
                  disabled={eventLog.length === 0}
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    eventLog.length === 0
                      ? 'text-gray-400 dark:text-gray-500'
                      : 'text-orange-600 hover:text-orange-700 dark:text-orange-400'
                  }`}
                >
                  Clear
                </button>
              </div>
              {recentEvents.length > 0 ? (
                <ul className="max-h-32 space-y-2 overflow-y-auto text-xs text-gray-600 dark:text-gray-300">
                  {recentEvents.map((event) => {
                    const label = getEventLabel(event.metadata);
                    return (
                      <li key={event.id} className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-semibold">{event.action ?? event.type}</span>
                          <span className="text-gray-400 dark:text-gray-500">
                            {' '}
                            • {event.scope ?? 'app'}
                          </span>
                          {label && (
                            <p className="text-[11px] text-gray-500 dark:text-gray-400">“{label}”</p>
                          )}
                        </div>
                        <span className="text-[10px] uppercase tracking-wide text-gray-400">
                          {formatEventTime(event.timestamp)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Interactions will appear here while logging is enabled.
                </p>
              )}
            </div>
          </div>
          </AnimatedCard>

          {/* About */}
          <AnimatedCard variant="normal" className="mb-4" index={4}>
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
          <AnimatedCard variant="normal" index={5}>
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


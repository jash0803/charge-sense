'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type AccessibilitySettingKey =
  | 'screenReaderMode'
  | 'highContrast'
  | 'largeText'
  | 'reduceMotion';

export interface AccessibilitySettings {
  screenReaderMode: boolean;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: (key: AccessibilitySettingKey, value: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  screenReaderMode: false,
  highContrast: false,
  largeText: false,
  reduceMotion: false,
};

const STORAGE_KEY = 'charge-sense-accessibility';

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load persisted settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings', error);
    }
  }, []);

  // Persist settings
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings', error);
    }
  }, [settings]);

  // Apply body classes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    body.classList.toggle('a11y-high-contrast', settings.highContrast);
    body.classList.toggle('a11y-large-text', settings.largeText);
    body.classList.toggle('a11y-screen-reader', settings.screenReaderMode);
    body.classList.toggle('a11y-reduce-motion', settings.reduceMotion || settings.screenReaderMode);
  }, [settings]);

  const updateSetting = (key: AccessibilitySettingKey, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => setSettings(defaultSettings);

  const value = useMemo(
    () => ({
      settings,
      updateSetting,
      resetSettings,
    }),
    [settings]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}



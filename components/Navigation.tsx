'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Leaf, Trophy, Target, Users, Settings } from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/achievements', icon: Trophy, label: 'Achievements' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/leaderboard', icon: Users, label: 'Leaderboard' },
  { href: '/carbon', icon: Leaf, label: 'Carbon' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { settings } = useAccessibility();
  const disableMotion = settings.reduceMotion || settings.screenReaderMode;

  return (
    <motion.div
      initial={disableMotion ? false : { y: 100, opacity: 0 }}
      animate={disableMotion ? undefined : { y: 0, opacity: 1 }}
      transition={disableMotion ? undefined : { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed bottom-0 left-0 right-0 z-50 pb-5 px-4"
    >
      <nav
        className="max-w-md mx-auto bg-white/95 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl backdrop-blur-md px-4 py-2"
        role="navigation"
        aria-label="Primary"
      >
        <div className="flex items-center justify-between gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.href}
                initial={disableMotion ? false : { opacity: 0, y: 20 }}
                animate={disableMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  disableMotion ? undefined : { delay: index * 0.05, duration: 0.3 }
                }
                whileHover={disableMotion ? undefined : { scale: 1.05 }}
                whileTap={disableMotion ? undefined : { scale: 0.95 }}
                className="flex-1"
              >
                <Link
                  href={item.href}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-all ${
                    isActive
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <motion.div
                    className={`p-2 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-green-50 dark:bg-green-900/40 text-green-600 dark:text-green-400 shadow-sm'
                        : 'bg-transparent'
                    }`}
                    animate={
                      disableMotion
                        ? undefined
                        : isActive
                        ? { scale: 1.05 }
                        : { scale: 1 }
                    }
                    transition={disableMotion ? undefined : { duration: 0.2 }}
                  >
                    <Icon size={20} aria-hidden="true" focusable={false} />
                  </motion.div>
                  <span>{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>
    </motion.div>
  );
}


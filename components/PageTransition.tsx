'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const { settings } = useAccessibility();
  const disableMotion = settings.reduceMotion || settings.screenReaderMode;

  if (disableMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}



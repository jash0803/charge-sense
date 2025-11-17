'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import DynamicCard from './DynamicCard';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface AnimatedCardProps {
  children: ReactNode;
  variant?: 'normal' | 'warning' | 'alert' | 'eco' | 'night' | 'motion';
  className?: string;
  delay?: number;
  index?: number;
}

export default function AnimatedCard({ 
  children, 
  variant = 'normal', 
  className = '',
  delay = 0,
  index = 0
}: AnimatedCardProps) {
  const { settings } = useAccessibility();
  const disableMotion = settings.reduceMotion || settings.screenReaderMode;

  return (
    <motion.div
      initial={disableMotion ? false : { opacity: 0, y: 20 }}
      animate={disableMotion ? undefined : { opacity: 1, y: 0 }}
      transition={
        disableMotion
          ? undefined
          : {
              duration: 0.4,
              delay: delay + index * 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }
      }
      whileHover={
        disableMotion
          ? undefined
          : {
              y: -4,
              transition: { duration: 0.2 },
            }
      }
    >
      <DynamicCard variant={variant} className={className}>
        {children}
      </DynamicCard>
    </motion.div>
  );
}



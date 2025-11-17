'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import DynamicCard from './DynamicCard';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay + (index * 0.1),
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
    >
      <DynamicCard variant={variant} className={className}>
        {children}
      </DynamicCard>
    </motion.div>
  );
}



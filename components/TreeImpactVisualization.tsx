'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TreeImpactVisualizationProps {
  co2Emission: number; // in grams
}

// Calculate trees destroyed based on CO₂ emissions
// Average tree absorbs ~22kg CO₂ per year, so ~60g per day
// For visualization: 1 tree destroyed = ~60g CO₂
function calculateTreesDestroyed(co2: number): number {
  return Math.max(0, Math.floor(co2 / 60));
}

// Tree component
function Tree({ index, isCut }: { index: number; isCut: boolean }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 1, scale: 1 }}
      animate={isCut ? { 
        opacity: 0, 
        scale: 0,
        rotate: -90,
        y: 20
      } : { 
        opacity: 1, 
        scale: 1,
        rotate: 0,
        y: 0
      }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      {/* Tree trunk */}
      <div className="w-3 h-8 bg-amber-800 mx-auto rounded-b-sm" />
      {/* Tree leaves */}
      <motion.div
        className="w-12 h-12 bg-green-600 rounded-full -mt-6 mx-auto relative"
        animate={!isCut ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Tree leaves detail */}
        <div className="absolute top-2 left-2 w-4 h-4 bg-green-700 rounded-full" />
        <div className="absolute top-4 right-3 w-3 h-3 bg-green-500 rounded-full" />
        <div className="absolute bottom-3 left-4 w-3 h-3 bg-green-800 rounded-full" />
      </motion.div>
    </motion.div>
  );
}

export default function TreeImpactVisualization({ co2Emission }: TreeImpactVisualizationProps) {
  const [treesDestroyed, setTreesDestroyed] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const totalTrees = 20; // Show a forest of 20 trees
  const treesToCut = Math.min(calculateTreesDestroyed(co2Emission), totalTrees);

  useEffect(() => {
    if (co2Emission > 0) {
      setShowAnimation(true);
      // Animate trees being cut progressively
      const interval = setInterval(() => {
        setTreesDestroyed(prev => {
          if (prev < treesToCut) {
            return prev + 1;
          }
          return prev;
        });
      }, 200);
      
      return () => clearInterval(interval);
    }
  }, [co2Emission, treesToCut]);

  if (treesToCut === 0) {
    return (
      <div className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-6xl mb-4"
        >
          🌳
        </motion.div>
        <p className="text-green-600 dark:text-green-400 font-semibold">
          Forest is safe! Keep it up!
        </p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
          🌲 Forest Impact
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {treesDestroyed} of {treesToCut} trees affected by today's emissions
        </p>
      </motion.div>

      {/* Forest Grid */}
      <div className="relative">
        <div className="grid grid-cols-5 gap-4 p-4 bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border-2 border-green-200 dark:border-green-800">
          {Array.from({ length: totalTrees }).map((_, index) => {
            const isCut = index < treesDestroyed;
            return (
              <div key={index} className="relative">
                <Tree index={index} isCut={isCut} />
                {/* Axe animation when cutting this specific tree */}
                <AnimatePresence>
                  {isCut && treesDestroyed === index + 1 && (
                    <motion.div
                      initial={{ 
                        x: -30, 
                        y: -30,
                        rotate: -45,
                        opacity: 0 
                      }}
                      animate={{ 
                        x: 0,
                        y: 0,
                        rotate: [0, 45, 0],
                        opacity: [0, 1, 0]
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 text-4xl pointer-events-none"
                      style={{ zIndex: 10 }}
                    >
                      🪓
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact Message */}
      <AnimatePresence>
        {treesDestroyed > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
          >
            <p className="text-sm text-red-700 dark:text-red-300 text-center">
              <span className="font-bold">{treesDestroyed}</span> tree{treesDestroyed !== 1 ? 's' : ''} would need to grow for a year to offset today's emissions
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Power } from 'lucide-react';

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
}

interface ChargingPollutionAnimationProps {
  charging: boolean;
  chargeRate?: number; // 0-1, controls intensity
  showToggle?: boolean; // Show/hide toggle button
  onChargingChange?: (charging: boolean) => void; // Callback when toggle changes
}

export default function ChargingPollutionAnimation({
  charging: externalCharging,
  chargeRate = 0.5,
  showToggle = true,
  onChargingChange,
}: ChargingPollutionAnimationProps) {
  const [internalCharging, setInternalCharging] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [dissipatingParticles, setDissipatingParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const particleIdRef = useRef(0);

  // Use internal state if no external charging prop, otherwise use external
  const isCharging = externalCharging !== undefined ? externalCharging : internalCharging;
  const actualChargeRate = Math.max(0, Math.min(1, chargeRate));

  // Calculate particle properties based on charge rate
  const particleSpawnRate = 50 + actualChargeRate * 200; // 50-250ms between particles
  const particleSize = 3 + actualChargeRate * 7; // 3-10px
  const particleOpacity = 0.3 + actualChargeRate * 0.5; // 0.3-0.8

  useEffect(() => {
    if (isCharging) {
      // Start particle generation
      const spawnParticle = () => {
        const newParticle: Particle = {
          id: `particle-${particleIdRef.current++}`,
          x: 50 + (Math.random() - 0.5) * 20, // Center around phone (50% with some variance)
          y: 100, // Start at bottom (phone position)
          size: particleSize + (Math.random() - 0.5) * 2,
          opacity: particleOpacity + (Math.random() - 0.5) * 0.2,
          duration: 2000 + Math.random() * 1000, // 2-3 seconds
        };

        setParticles((prev) => [...prev, newParticle]);

        // Remove particle after animation
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, newParticle.duration);
      };

      // Spawn first particle immediately
      spawnParticle();

      // Set up interval for continuous spawning
      const interval = setInterval(spawnParticle, particleSpawnRate);
      animationRef.current = interval as unknown as number;

      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current);
        }
      };
    } else {
      // Stop spawning and start dissipation
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }

      // Move all active particles to dissipating state
      setDissipatingParticles((prev) => [...prev, ...particles]);
      setParticles([]);

      // Clear dissipating particles after they fade
      const timeout = setTimeout(() => {
        setDissipatingParticles([]);
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [isCharging, particleSpawnRate, particleSize, particleOpacity]);

  const handleToggle = () => {
    const newState = !internalCharging;
    setInternalCharging(newState);
    if (onChargingChange) {
      onChargingChange(newState);
    }
  };

  return (
    <div className="relative w-full h-64 flex flex-col items-center justify-center">
      {/* Phone Icon */}
      <div className="relative z-10 mb-4">
        <motion.div
          animate={
            isCharging
              ? {
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, -1, 0],
                }
              : {}
          }
          transition={{ duration: 2, repeat: isCharging ? Infinity : 0 }}
          className="relative"
        >
          <Smartphone
            size={64}
            className={`${
              isCharging ? 'text-green-500' : 'text-gray-400'
            } transition-colors duration-300`}
            fill={isCharging ? 'currentColor' : 'none'}
          />
          {/* Charging indicator */}
          {isCharging && (
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Power size={20} className="text-green-500" fill="currentColor" />
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Pollution Particles Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Active particles (when charging) */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-gray-600 dark:bg-gray-500"
            style={{
              left: `${particle.x}%`,
              bottom: `${100 - particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{
              opacity: particle.opacity,
              y: 0,
              x: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: [particle.opacity, particle.opacity * 0.8, 0],
              y: -150 - Math.random() * 50,
              x: (Math.random() - 0.5) * 100,
              scale: [0.5, 1.2, 1.5],
            }}
            transition={{
              duration: particle.duration / 1000,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Dissipating particles (when charging stops) */}
        {dissipatingParticles.map((particle) => (
          <motion.div
            key={`dissipate-${particle.id}`}
            className="absolute rounded-full bg-gray-600 dark:bg-gray-500"
            style={{
              left: `${particle.x}%`,
              bottom: `${100 - particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{
              opacity: particle.opacity,
            }}
            animate={{
              opacity: [particle.opacity, particle.opacity * 0.5, 0],
              scale: [1, 1.5, 2],
              x: (Math.random() - 0.5) * 50,
              y: -20 - Math.random() * 30,
            }}
            transition={{
              duration: 2,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Smog effect (background haze when charging) */}
        <AnimatePresence>
          {isCharging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.1, 0.2 * actualChargeRate, 0.1],
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-t from-gray-400/20 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Toggle Button */}
      {showToggle && (
        <motion.button
          onClick={handleToggle}
          disabled={externalCharging !== undefined}
          className={`
            relative z-20 mt-4 px-4 py-2 rounded-lg font-medium text-sm
            transition-all duration-300
            ${
              isCharging
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }
            ${externalCharging !== undefined ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          whileHover={{ scale: externalCharging === undefined ? 1.05 : 1 }}
          whileTap={{ scale: externalCharging === undefined ? 0.95 : 1 }}
        >
          <div className="flex items-center gap-2">
            <Power
              size={16}
              className={isCharging ? 'animate-spin' : ''}
            />
            <span>{isCharging ? 'Stop Charging' : 'Start Charging'}</span>
          </div>
        </motion.button>
      )}

      {/* Intensity Indicator */}
      {isCharging && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
            <span>Pollution Level:</span>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < Math.ceil(actualChargeRate * 5)
                      ? 'bg-red-500'
                      : 'bg-gray-500'
                  }`}
                  animate={
                    i < Math.ceil(actualChargeRate * 5)
                      ? {
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}



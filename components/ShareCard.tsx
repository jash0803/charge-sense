'use client';

import { motion } from 'framer-motion';
import { Share2, Download, Twitter, Facebook, Instagram } from 'lucide-react';
import { UserProgress } from '@/lib/gamificationData';

interface ShareCardProps {
  progress: UserProgress;
  co2Today: number;
  onShare?: (platform: string) => void;
}

export default function ShareCard({ progress, co2Today, onShare }: ShareCardProps) {
  const shareData = {
    text: `I've reduced ${progress.totalCarbonReduced}g of CO₂ and maintained a ${progress.currentStreak}-day streak! 🌿 #ChargeSense #CarbonFootprint`,
    url: 'https://chargesense.app',
  };

  const handleShare = async (platform: string) => {
    if (onShare) {
      onShare(platform);
      return;
    }

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
      instagram: '#', // Instagram doesn't support direct sharing
    };

    if (platform === 'native' && navigator.share) {
      try {
        await navigator.share({
          title: 'My Carbon Impact',
          text: shareData.text,
          url: shareData.url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800"
    >
      {/* Card Header */}
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          🌿 ChargeSense
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          My Carbon Impact Report
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {progress.totalCarbonReduced}g
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            CO₂ Reduced
          </div>
        </div>
        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            🔥 {progress.currentStreak}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Day Streak
          </div>
        </div>
        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            Lv.{progress.level}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Level
          </div>
        </div>
        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {progress.points.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Points
          </div>
        </div>
      </div>

      {/* Today's Impact */}
      <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg mb-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
          Today's CO₂ Impact
        </div>
        <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
          {co2Today.toFixed(1)}g
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('native')}
          className="flex-1 flex items-center justify-center gap-2 p-2 bg-green-600 text-white rounded-lg font-medium text-sm"
        >
          <Share2 size={16} />
          Share
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('twitter')}
          className="p-2 bg-blue-400 text-white rounded-lg"
        >
          <Twitter size={16} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleShare('facebook')}
          className="p-2 bg-blue-600 text-white rounded-lg"
        >
          <Facebook size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
}



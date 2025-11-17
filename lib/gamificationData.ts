// Gamification data models and mock data generators

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'charging' | 'network' | 'streak' | 'carbon' | 'challenge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  unlockedDate?: Date;
  progress: number; // 0-100
  target: number;
}

export interface UserProgress {
  points: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalCarbonReduced: number; // grams
  currentStreak: number; // consecutive days
  longestStreak: number;
  achievementsUnlocked: number;
  totalAchievements: number;
}

export interface Goal {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  description: string;
  target: number; // CO₂ reduction in grams
  current: number;
  progress: number; // 0-100
  deadline: Date;
  completed: boolean;
  reward: {
    points: number;
    badge?: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  startDate: Date;
  endDate: Date;
  target: string; // e.g., "Charge only during daylight hours"
  progress: number; // 0-100
  completed: boolean;
  reward: {
    points: number;
    badge?: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  points: number;
  level: number;
  carbonReduced: number;
  streak: number;
  isCurrentUser: boolean;
}

// Generate demo achievements
export function generateAchievements(): Achievement[] {
  return [
    {
      id: 'eco-warrior',
      name: 'Eco Warrior',
      description: 'Reduce CO₂ emissions by 50g in a week',
      icon: '🌿',
      category: 'carbon',
      rarity: 'rare',
      points: 100,
      unlocked: false,
      progress: 65,
      target: 50,
    },
    {
      id: 'night-charger',
      name: 'Night Charger',
      description: 'Avoid charging during peak hours (22:00-06:00) for 7 days',
      icon: '🌙',
      category: 'charging',
      rarity: 'epic',
      points: 150,
      unlocked: false,
      progress: 42,
      target: 7,
    },
    {
      id: 'wifi-master',
      name: 'WiFi Master',
      description: 'Use WiFi for 80% of your usage time',
      icon: '📶',
      category: 'network',
      rarity: 'common',
      points: 50,
      unlocked: true,
      unlockedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      progress: 100,
      target: 80,
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Maintain a 10-day low-emission streak',
      icon: '🔥',
      category: 'streak',
      rarity: 'epic',
      points: 200,
      unlocked: false,
      progress: 70,
      target: 10,
    },
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Charge only during daylight hours for 5 days',
      icon: '☀️',
      category: 'charging',
      rarity: 'rare',
      points: 120,
      unlocked: false,
      progress: 60,
      target: 5,
    },
    {
      id: 'slow-charger',
      name: 'Slow Charger',
      description: 'Use slow charging for 20 sessions',
      icon: '🐌',
      category: 'charging',
      rarity: 'common',
      points: 75,
      unlocked: true,
      unlockedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      progress: 100,
      target: 20,
    },
    {
      id: 'carbon-zero',
      name: 'Carbon Zero',
      description: 'Achieve zero CO₂ emissions in a day',
      icon: '✨',
      category: 'carbon',
      rarity: 'legendary',
      points: 500,
      unlocked: false,
      progress: 0,
      target: 1,
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Complete 5 weekly challenges',
      icon: '🏆',
      category: 'challenge',
      rarity: 'epic',
      points: 300,
      unlocked: false,
      progress: 40,
      target: 5,
    },
    {
      id: 'battery-optimizer',
      name: 'Battery Optimizer',
      description: 'Keep battery between 20-80% for 30 days',
      icon: '🔋',
      category: 'charging',
      rarity: 'rare',
      points: 150,
      unlocked: false,
      progress: 23,
      target: 30,
    },
    {
      id: 'green-grid',
      name: 'Green Grid',
      description: 'Charge only during renewable energy hours for a week',
      icon: '⚡',
      category: 'carbon',
      rarity: 'legendary',
      points: 400,
      unlocked: false,
      progress: 28,
      target: 7,
    },
  ];
}

// Generate user progress
export function generateUserProgress(): UserProgress {
  return {
    points: 1250,
    level: 5,
    xp: 750,
    xpToNextLevel: 1000,
    totalCarbonReduced: 450, // grams
    currentStreak: 7,
    longestStreak: 12,
    achievementsUnlocked: 2,
    totalAchievements: 10,
  };
}

// Generate goals
export function generateGoals(): Goal[] {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const nextMonth = new Date(today);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  return [
    {
      id: 'daily-1',
      type: 'daily',
      title: 'Daily Low Emission',
      description: 'Keep today\'s CO₂ emissions below 15g',
      target: 15,
      current: 12.5,
      progress: 83,
      deadline: tomorrow,
      completed: false,
      reward: { points: 50 },
    },
    {
      id: 'weekly-1',
      type: 'weekly',
      title: 'Weekly Carbon Reduction',
      description: 'Reduce weekly CO₂ emissions by 30g',
      target: 30,
      current: 18,
      progress: 60,
      deadline: nextWeek,
      completed: false,
      reward: { points: 150, badge: 'weekly-warrior' },
    },
    {
      id: 'monthly-1',
      type: 'monthly',
      title: 'Monthly Eco Champion',
      description: 'Reduce monthly CO₂ emissions by 100g',
      target: 100,
      current: 45,
      progress: 45,
      deadline: nextMonth,
      completed: false,
      reward: { points: 500, badge: 'eco-champion' },
    },
  ];
}

// Generate challenges
export function generateChallenges(): Challenge[] {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: 'challenge-1',
      title: 'Daylight Charging',
      description: 'Charge only during daylight hours (6 AM - 8 PM) this week',
      duration: 7,
      startDate: today,
      endDate: nextWeek,
      target: 'Charge only during daylight hours',
      progress: 57,
      completed: false,
      reward: { points: 200, badge: 'daylight-charger' },
    },
    {
      id: 'challenge-2',
      title: 'WiFi Only Week',
      description: 'Use WiFi exclusively for 7 days',
      duration: 7,
      startDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
      target: 'Use WiFi only',
      progress: 28,
      completed: false,
      reward: { points: 150, badge: 'wifi-warrior' },
    },
    {
      id: 'challenge-3',
      title: 'Slow Charge Challenge',
      description: 'Use only slow charging for 10 sessions',
      duration: 14,
      startDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(today.getTime() + 9 * 24 * 60 * 60 * 1000),
      target: '10 slow charge sessions',
      progress: 70,
      completed: false,
      reward: { points: 180, badge: 'slow-charger' },
    },
  ];
}

// Generate leaderboard
export function generateLeaderboard(currentUserId: string = 'user-1'): LeaderboardEntry[] {
  const demoUsers = [
    { username: 'EcoChampion', avatar: '🌿', points: 3500, level: 12, carbonReduced: 1200, streak: 25 },
    { username: 'GreenWarrior', avatar: '🌳', points: 3200, level: 11, carbonReduced: 1100, streak: 20 },
    { username: 'CarbonZero', avatar: '✨', points: 2800, level: 10, carbonReduced: 950, streak: 18 },
    { username: 'EcoMaster', avatar: '🌱', points: 2500, level: 9, carbonReduced: 850, streak: 15 },
    { username: 'GreenHero', avatar: '🍃', points: 2200, level: 8, carbonReduced: 750, streak: 12 },
    { username: 'EcoUser', avatar: '🌲', points: 2000, level: 8, carbonReduced: 700, streak: 10 },
    { username: 'GreenUser', avatar: '🌿', points: 1800, level: 7, carbonReduced: 650, streak: 9 },
    { username: 'EcoFan', avatar: '🌳', points: 1600, level: 7, carbonReduced: 600, streak: 8 },
    { username: 'GreenFan', avatar: '🌱', points: 1400, level: 6, carbonReduced: 550, streak: 7 },
    { username: 'EcoNewbie', avatar: '🍃', points: 1250, level: 5, carbonReduced: 450, streak: 7 },
    { username: 'GreenNewbie', avatar: '🌲', points: 1100, level: 5, carbonReduced: 400, streak: 6 },
    { username: 'EcoBeginner', avatar: '🌿', points: 950, level: 4, carbonReduced: 350, streak: 5 },
    { username: 'GreenBeginner', avatar: '🌳', points: 800, level: 4, carbonReduced: 300, streak: 4 },
    { username: 'EcoStarter', avatar: '🌱', points: 650, level: 3, carbonReduced: 250, streak: 3 },
    { username: 'GreenStarter', avatar: '🍃', points: 500, level: 3, carbonReduced: 200, streak: 2 },
  ];

  return demoUsers.map((user, index) => ({
    rank: index + 1,
    username: user.username,
    avatar: user.avatar,
    points: user.points,
    level: user.level,
    carbonReduced: user.carbonReduced,
    streak: user.streak,
    isCurrentUser: index === 9, // Mark 10th user as current user
  }));
}

// Calculate level from XP
export function calculateLevel(xp: number): { level: number; xpInCurrentLevel: number; xpToNextLevel: number } {
  let level = 1;
  let xpRequired = 0;
  let xpForNextLevel = 100;

  while (xp >= xpRequired + xpForNextLevel) {
    xpRequired += xpForNextLevel;
    level++;
    xpForNextLevel = Math.floor(100 * Math.pow(1.2, level - 1)); // Exponential growth
  }

  return {
    level,
    xpInCurrentLevel: xp - xpRequired,
    xpToNextLevel: xpForNextLevel,
  };
}

// Calculate points from actions
export function calculatePoints(action: {
  type: 'low_emission' | 'wifi_usage' | 'slow_charge' | 'daylight_charge' | 'streak' | 'goal_complete' | 'challenge_complete';
  value?: number;
}): number {
  const pointValues = {
    low_emission: 10,
    wifi_usage: 5,
    slow_charge: 15,
    daylight_charge: 20,
    streak: 25,
    goal_complete: 50,
    challenge_complete: 100,
  };

  return pointValues[action.type] || 0;
}



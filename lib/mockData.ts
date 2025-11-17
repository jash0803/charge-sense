// Mock data service for simulating sensor readings and charging data

export interface ChargingSession {
  id: string;
  startTime: Date;
  endTime: Date;
  startPercent: number;
  endPercent: number;
  duration: number; // minutes
  chargerType: 'Fast' | 'Slow' | 'Wireless';
  co2Emitted: number; // grams
}

export interface EnvironmentState {
  networkType: 'WiFi' | 'Mobile Data';
  motionState: 'Stationary' | 'Walking' | 'Running';
  lightLevel: 'Dim' | 'Bright';
  batteryLevel: number;
}

export interface AppUsage {
  appName: string;
  duration: number; // minutes
  category: string;
}

export interface CarbonData {
  today: number; // grams
  weekly: number[];
  breakdown: {
    charging: number;
    fastCharging: number;
    networkType: number;
    screenBrightness: number;
  };
}

// Generate mock charging sessions
export function generateChargingSessions(): ChargingSession[] {
  const sessions: ChargingSession[] = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const startTime = new Date(now);
    startTime.setDate(startTime.getDate() - i);
    startTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    
    const duration = Math.floor(Math.random() * 60) + 15; // 15-75 minutes
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);
    
    const startPercent = Math.floor(Math.random() * 50) + 5; // 5-55%
    const endPercent = Math.min(100, startPercent + Math.floor(Math.random() * 60) + 20);
    
    const chargerTypes: ('Fast' | 'Slow' | 'Wireless')[] = ['Fast', 'Slow', 'Wireless'];
    const chargerType = chargerTypes[Math.floor(Math.random() * chargerTypes.length)];
    
    const co2Emitted = (duration / 60) * (chargerType === 'Fast' ? 2.5 : chargerType === 'Wireless' ? 2.0 : 1.5);
    
    sessions.push({
      id: `session-${i}`,
      startTime,
      endTime,
      startPercent,
      endPercent,
      duration,
      chargerType,
      co2Emitted: Math.round(co2Emitted * 10) / 10,
    });
  }
  
  return sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
}

// Get current environment state
export function getCurrentEnvironment(): EnvironmentState {
  const hour = new Date().getHours();
  const batteryLevel = Math.floor(Math.random() * 40) + 40; // 40-80%
  
  return {
    networkType: Math.random() > 0.3 ? 'WiFi' : 'Mobile Data',
    motionState: Math.random() > 0.5 ? 'Stationary' : 'Walking',
    lightLevel: hour >= 6 && hour < 20 ? 'Bright' : 'Dim',
    batteryLevel,
  };
}

// Get today's charging sessions
export function getTodaySessions(sessions: ChargingSession[]): ChargingSession[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    sessionDate.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });
}

// Calculate carbon impact
export function calculateCarbonImpact(sessions: ChargingSession[]): CarbonData {
  const todaySessions = getTodaySessions(sessions);
  const today = todaySessions.reduce((sum, s) => sum + s.co2Emitted, 0);
  
  // Generate weekly data
  const weekly: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const daySessions = sessions.filter(s => {
      const sessionDate = new Date(s.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === date.getTime();
    });
    
    weekly.push(daySessions.reduce((sum, s) => sum + s.co2Emitted, 0));
  }
  
  const breakdown = {
    charging: today * 0.4,
    fastCharging: todaySessions.filter(s => s.chargerType === 'Fast').reduce((sum, s) => sum + s.co2Emitted, 0) * 0.3,
    networkType: today * 0.2,
    screenBrightness: today * 0.1,
  };
  
  return {
    today: Math.round(today * 10) / 10,
    weekly,
    breakdown,
  };
}

// Get behavior insights
export function getBehaviorInsights(sessions: ChargingSession[]): string[] {
  const todaySessions = getTodaySessions(sessions);
  const allSessions = sessions.slice(0, 30); // Last 30 sessions
  
  const avgStartPercent = allSessions.reduce((sum, s) => sum + s.startPercent, 0) / allSessions.length;
  const fastChargeCount = allSessions.filter(s => s.chargerType === 'Fast').length;
  const fastChargePercent = Math.round((fastChargeCount / allSessions.length) * 100);
  
  const insights: string[] = [];
  
  insights.push(`You charged ${todaySessions.length} time${todaySessions.length !== 1 ? 's' : ''} today.`);
  
  if (avgStartPercent < 15) {
    insights.push(`Your typical charging level is ${Math.round(avgStartPercent)}% — this causes battery strain.`);
  } else if (avgStartPercent > 80) {
    insights.push(`You typically charge when above ${Math.round(avgStartPercent)}% — consider waiting longer.`);
  } else {
    insights.push(`Your typical charging level is ${Math.round(avgStartPercent)}% — good range!`);
  }
  
  insights.push(`You use fast-charging ${fastChargePercent}% of the time.`);
  
  return insights;
}

// Get app usage data
export function getAppUsage(): AppUsage[] {
  const apps = [
    { name: 'Social Media', category: 'Social', duration: 120 },
    { name: 'Messaging', category: 'Communication', duration: 90 },
    { name: 'Browser', category: 'Productivity', duration: 60 },
    { name: 'Video Streaming', category: 'Entertainment', duration: 45 },
    { name: 'Music', category: 'Entertainment', duration: 30 },
  ];
  
  return apps.map(app => ({
    appName: app.name,
    duration: app.duration,
    category: app.category,
  }));
}

// Get time-based theme
export function getTimeBasedTheme(): 'night' | 'morning' | 'day' | 'evening' {
  const hour = new Date().getHours();
  
  if (hour >= 22 || hour < 6) return 'night';
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 18) return 'day';
  return 'evening';
}

// Get time-based insight
export function getTimeBasedInsight(theme: 'night' | 'morning' | 'day' | 'evening'): string {
  switch (theme) {
    case 'night':
      return "Night-time charging emits more CO₂ on peak grids in your region.";
    case 'morning':
      return "You usually start your day at 45% battery.";
    case 'day':
      return "Your highest carbon emissions happen around lunch.";
    case 'evening':
      return "You tend to fast-charge at night. Here's how to reduce emissions.";
    default:
      return "";
  }
}


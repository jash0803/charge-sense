# 🌱 ChargeSense

*A behaviour-adaptive carbon-impact smartphone assistant.*

ChargeSense is a Next.js frontend application that helps users understand and reduce their carbon footprint through intelligent charging habits. The app adapts in real-time to various environmental factors including battery level, charging behavior, time of day, network type, motion state, and ambient light.

## Features

- **Dashboard**: Real-time carbon impact visualization with charging summaries and behavior insights
- **Charging Behaviour**: Detailed analysis of charging patterns with timeline graphs and session history
- **Digital Habits**: App usage tracking, motion patterns, and network usage analysis
- **Carbon Awareness**: CO₂ emissions breakdown with weekly charts and comparisons
- **Recommendations**: Personalized suggestions based on time of day and user behavior
- **Dynamic Themes**: Automatically adapts UI based on time of day (night/morning/day/evening)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
chargesense/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── charging/
│   │   └── page.tsx          # Charging Behaviour screen
│   ├── habits/
│   │   └── page.tsx          # Digital Habits screen
│   ├── carbon/
│   │   └── page.tsx          # Carbon Awareness screen
│   ├── recommendations/
│   │   └── page.tsx          # Recommendations screen
│   ├── settings/
│   │   └── page.tsx          # Settings screen
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── CarbonScoreBadge.tsx  # Circular CO₂ indicator
│   ├── DynamicCard.tsx       # Adaptive card component
│   ├── BehaviourBadge.tsx    # Behavior pattern badges
│   ├── EnvironmentBar.tsx    # Real-time environment display
│   └── Navigation.tsx        # Bottom navigation
├── lib/
│   ├── mockData.ts           # Mock data service
│   └── theme.ts              # Theme system
└── package.json
```

## Design System

### Colors
- **Eco Green**: `#37C66D`
- **Warning Yellow**: `#FFCF4A`
- **Alert Red**: `#E84747`
- **Night Blue**: `#0B1B2B`
- **Dim Grey**: `#1A1C1F`
- **Neutral Light**: `#F4F4F4`

### Typography
- **Title**: Inter Bold 24px
- **Section Header**: Inter Semibold 18px
- **Body**: Inter Regular 14px
- **Microcopy**: Inter Light 12px

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for data visualization
- **Lucide React**: Icon library

## Mock Data

The app uses mock data to simulate:
- Charging sessions with start/end percentages, duration, and CO₂ emissions
- Environment states (network type, motion, light, battery level)
- App usage statistics
- Carbon impact calculations

All data is generated dynamically and updates every 5 seconds to simulate real-time behavior.

## Dynamic States

The app adapts to:
- **Time of Day**: Different themes for night (22:00-06:00), morning (06:00-10:00), day (10:00-18:00), and evening (18:00-22:00)
- **Battery Level**: Color-coded indicators and low battery warnings
- **Motion State**: Simplified UI when in motion
- **Light Level**: Auto-dim mode in low light
- **Network Type**: Warnings for mobile data usage
- **Charging Behavior**: Personalized insights and recommendations

## Theme Switcher (Prototype Feature)

For prototype testing, you can manually switch between themes:
- **Quick Switcher**: Floating button on the Dashboard (bottom-right) for quick theme changes
- **Settings**: Full theme selector in Settings page with options:
  - Auto (Time-based) - Theme changes automatically based on current time
  - Night Mode - Dark theme with navy gradients
  - Morning Mode - Warm pastel gradient theme
  - Day Mode - Light neutral theme
  - Evening Mode - Calm purple-grey theme

## Build for Production

```bash
npm run build
npm start
```

## License

This project is created for HCI prototype purposes.


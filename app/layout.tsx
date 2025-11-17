import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AccessibilityProvider } from '@/contexts/AccessibilityContext'
import { ResearchProvider } from '@/contexts/ResearchContext'

export const metadata: Metadata = {
  title: 'ChargeSense - Carbon Impact Assistant',
  description: 'A behaviour-adaptive carbon-impact smartphone assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AccessibilityProvider>
            <ResearchProvider>
              <a href="#main-content" className="skip-link">
                Skip to main content
              </a>
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
            </ResearchProvider>
          </AccessibilityProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


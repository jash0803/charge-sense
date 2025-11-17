'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

type ResearchEventType = 'interaction' | 'feedback' | 'system';

export interface ResearchEvent {
  id: string;
  timestamp: number;
  type: ResearchEventType;
  scope?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

interface ResearchContextValue {
  observationMode: boolean;
  eventLoggingEnabled: boolean;
  eventLog: ResearchEvent[];
  toggleObservationMode: (value?: boolean) => void;
  setEventLoggingEnabled: (value: boolean) => void;
  logEvent: (event: Omit<ResearchEvent, 'id' | 'timestamp'>) => void;
  clearEventLog: () => void;
}

const STORAGE_KEY = 'charge-sense-research';

const ResearchContext = createContext<ResearchContextValue | undefined>(undefined);

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

const getElementLabel = (target: HTMLElement | null) => {
  if (!target) return 'unknown';
  const labelledBy =
    target.getAttribute('data-observation-label') ||
    target.getAttribute('aria-label') ||
    target.getAttribute('aria-labelledby');

  if (labelledBy) return labelledBy;

  const textContent = target.textContent?.trim();
  if (textContent) {
    return textContent.length > 40 ? `${textContent.slice(0, 37)}...` : textContent;
  }

  return target.tagName.toLowerCase();
};

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [observationMode, setObservationMode] = useState(false);
  const [eventLoggingEnabled, setEventLoggingEnabled] = useState(false);
  const [eventLog, setEventLog] = useState<ResearchEvent[]>([]);

  // Load persisted preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setObservationMode(Boolean(parsed.observationMode));
        setEventLoggingEnabled(Boolean(parsed.eventLoggingEnabled));
      }
    } catch (error) {
      console.warn('[Research] Failed to load preferences', error);
    }
  }, []);

  // Persist preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          observationMode,
          eventLoggingEnabled,
        })
      );
    } catch (error) {
      console.warn('[Research] Failed to store preferences', error);
    }
  }, [observationMode, eventLoggingEnabled]);

  // Apply body class for observation mode
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('observation-mode', observationMode);
  }, [observationMode]);

  const logEvent = useCallback(
    (event: Omit<ResearchEvent, 'id' | 'timestamp'>) => {
      setEventLog((prev) => {
        const next = [{ ...event, id: generateId(), timestamp: Date.now() }, ...prev];
        return next.slice(0, 50);
      });

      if (eventLoggingEnabled && typeof window !== 'undefined') {
        // eslint-disable-next-line no-console
        console.debug('[Research]', event);
      }
    },
    [eventLoggingEnabled]
  );

  const toggleObservationMode = useCallback(
    (value?: boolean) => {
      setObservationMode((prev) => {
        const nextValue = typeof value === 'boolean' ? value : !prev;
        logEvent({
          type: 'system',
          scope: 'research',
          action: nextValue ? 'observation_mode_enabled' : 'observation_mode_disabled',
          metadata: { nextValue },
        });
        return nextValue;
      });
    },
    [logEvent]
  );

  const updateEventLogging = useCallback(
    (value: boolean) => {
      setEventLoggingEnabled(value);
      logEvent({
        type: 'system',
        scope: 'research',
        action: value ? 'event_logging_enabled' : 'event_logging_disabled',
        metadata: { nextValue: value },
      });
    },
    [logEvent]
  );

  const clearEventLog = useCallback(() => {
    setEventLog([]);
  }, []);

  // Passive event instrumentation
  useEffect(() => {
    if (!eventLoggingEnabled || typeof window === 'undefined') return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      logEvent({
        type: 'interaction',
        scope: 'global',
        action: 'click',
        metadata: {
          label: getElementLabel(target),
          tagName: target?.tagName?.toLowerCase(),
        },
      });
    };

    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      logEvent({
        type: 'interaction',
        scope: 'global',
        action: 'focus',
        metadata: {
          label: getElementLabel(target),
          tagName: target?.tagName?.toLowerCase(),
        },
      });
    };

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Shift' || event.key === 'Tab') return;
      logEvent({
        type: 'interaction',
        scope: 'global',
        action: 'key_down',
        metadata: { key: event.key },
      });
    };

    window.addEventListener('click', handleClick, true);
    window.addEventListener('focusin', handleFocus, true);
    window.addEventListener('keydown', handleKeydown, true);

    return () => {
      window.removeEventListener('click', handleClick, true);
      window.removeEventListener('focusin', handleFocus, true);
      window.removeEventListener('keydown', handleKeydown, true);
    };
  }, [eventLoggingEnabled, logEvent]);

  const value = useMemo<ResearchContextValue>(
    () => ({
      observationMode,
      eventLoggingEnabled,
      eventLog,
      toggleObservationMode,
      setEventLoggingEnabled: updateEventLogging,
      logEvent,
      clearEventLog,
    }),
    [observationMode, eventLoggingEnabled, eventLog, toggleObservationMode, logEvent, clearEventLog, updateEventLogging]
  );

  return <ResearchContext.Provider value={value}>{children}</ResearchContext.Provider>;
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
}



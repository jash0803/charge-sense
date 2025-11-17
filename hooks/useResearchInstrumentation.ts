'use client';

import { useCallback } from 'react';
import { useResearch } from '@/contexts/ResearchContext';

export function useResearchInstrumentation(scope: string) {
  const { logEvent, observationMode, eventLoggingEnabled } = useResearch();

  const logInteraction = useCallback(
    (action: string, metadata?: Record<string, unknown>) => {
      logEvent({
        type: 'interaction',
        scope,
        action,
        metadata,
      });
    },
    [logEvent, scope]
  );

  const recordFeedback = useCallback(
    (value: string, metadata?: Record<string, unknown>) => {
      logEvent({
        type: 'feedback',
        scope,
        action: 'inline-feedback',
        metadata: {
          value,
          ...metadata,
        },
      });
    },
    [logEvent, scope]
  );

  return {
    observationMode,
    eventLoggingEnabled,
    logInteraction,
    recordFeedback,
  };
}



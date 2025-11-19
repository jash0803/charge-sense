'use client';

import { useMemo, useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useResearchInstrumentation } from '@/hooks/useResearchInstrumentation';

type FeedbackValue = 'useful' | 'not_useful';

interface FeedbackWidgetProps {
  entityId: string;
  scope?: string;
  question?: string;
  onFeedback?: (value: FeedbackValue, note?: string) => void;
}

export default function FeedbackWidget({
  entityId,
  scope = 'global',
  question = 'Was this recommendation useful?',
  onFeedback,
}: FeedbackWidgetProps) {
  const [selection, setSelection] = useState<FeedbackValue | null>(null);
  const [note, setNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const { recordFeedback } = useResearchInstrumentation(`${scope}:${entityId}`);

  const valueLabel = useMemo(() => {
    if (selection === 'useful') return 'Glad this helped!';
    if (selection === 'not_useful') return 'We’ll improve this insight.';
    return null;
  }, [selection]);

  const handleSelection = (value: FeedbackValue) => {
    setSelection(value);
    setNote('');
    setNoteSaved(false);
    recordFeedback(value, { entityId, type: 'quick-response' });
    onFeedback?.(value);
  };

  const handleSubmitNote = () => {
    if (!selection || !note.trim()) return;
    const trimmedNote = note.trim();
    recordFeedback(selection, {
      entityId,
      note: trimmedNote,
      type: 'qualitative-note',
    });
    onFeedback?.(selection, trimmedNote);
    setNote('');
    setNoteSaved(true);
  };

  return (
    <div
      className="mt-3 rounded-2xl border border-dashed border-gray-200 bg-white/70 p-3 text-sm dark:border-gray-700 dark:bg-gray-900/60"
      data-observation-label={`feedback-${entityId}`}
    >
      <p className="font-medium text-gray-800 dark:text-gray-100">{question}</p>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleSelection('useful')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            selection === 'useful'
              ? 'border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900/30 dark:text-green-200'
              : 'border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 dark:border-gray-700 dark:text-gray-300'
          }`}
          aria-pressed={selection === 'useful'}
          data-observation-label={`feedback-useful-${entityId}`}
        >
          <ThumbsUp size={16} />
          Yes
        </button>
        <button
          type="button"
          onClick={() => handleSelection('not_useful')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
            selection === 'not_useful'
              ? 'border-rose-500 bg-rose-50 text-rose-700 dark:border-rose-400 dark:bg-rose-900/30 dark:text-rose-200'
              : 'border-gray-200 text-gray-600 hover:border-rose-500 hover:text-rose-600 dark:border-gray-700 dark:text-gray-300'
          }`}
          aria-pressed={selection === 'not_useful'}
          data-observation-label={`feedback-not-useful-${entityId}`}
        >
          <ThumbsDown size={16} />
          No
        </button>
      </div>

      {selection ? (
        <div className="mt-3 space-y-2">
          {valueLabel && (
            <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{valueLabel}</p>
          )}
          <label
            htmlFor={`feedback-note-${entityId}`}
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"
          >
            <MessageSquare size={12} />
            Add context (optional)
          </label>
          <textarea
            id={`feedback-note-${entityId}`}
            value={note}
            rows={2}
            onChange={(event) => setNote(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white/80 p-2 text-sm text-gray-800 placeholder:text-gray-400 focus:border-green-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            placeholder="Tell us why this was or wasn’t helpful..."
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleSubmitNote}
              disabled={!note.trim()}
              className={`text-xs font-semibold uppercase tracking-wide ${
                note.trim()
                  ? 'text-green-600 hover:text-green-700 dark:text-green-400'
                  : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              Share note
            </button>
            {noteSaved && (
              <span className="text-xs font-medium text-green-500 dark:text-green-300">Saved</span>
            )}
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Your feedback helps us train better charging insights.
        </p>
      )}
    </div>
  );
}




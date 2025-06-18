
import React from 'react';
import { DiffSegment } from '../types';
import Button from './Button';

interface ResultsDisplayProps {
  originalText: string;
  refinedText: string;
  showDiff: boolean;
  onToggleDiff: () => void;
}

const renderDiff = (original: string, refined: string): React.ReactNode => {
  if (!window.Diff || !window.Diff.diffWordsWithSpace) {
    // Fallback if diff library isn't loaded
    return (
      <>
        <p className="text-red-400">Biblioteka porównywania zmian nie jest dostępna. Wyświetlanie zwykłego tekstu.</p>
        <span className="whitespace-pre-wrap break-words">{refined || original || "Brak tekstu."}</span>
      </>
    );
  }

  // Ensure inputs are strings, defaulting to empty string if null/undefined
  const originalStr = original || "";
  const refinedStr = refined || "";

  // If both are essentially empty (after being processed to strings), display a message.
  if (!originalStr && !refinedStr) {
    return <p className="text-slate-400 italic">Brak tekstu do porównania.</p>;
  }

  const diffs: DiffSegment[] = window.Diff.diffWordsWithSpace(originalStr, refinedStr);
  
  // Check if there are no actual changes (e.g., original and refined are identical non-empty strings)
  // This happens if diffs has only one part without added/removed flags,
  // or more robustly, if originalStr === refinedStr.
  if (originalStr && refinedStr && originalStr === refinedStr) {
    return (
      <>
        <p className="text-sm text-slate-400 italic mb-2" role="status">
          AI nie wykryło potrzeby wprowadzenia znaczących zmian w tekście dla wybranych parametrów, lub tekst oryginalny już je spełniał.
        </p>
        <span className="whitespace-pre-wrap break-words">{refinedStr}</span>
      </>
    );
  }
  
  return diffs.map((part, index) => {
    let style = "whitespace-pre-wrap break-words"; // Base style for text rendering
    if (part.added) {
      style += " bg-green-500/30 text-green-300 rounded px-0.5";
    } else if (part.removed) {
      style += " bg-red-500/30 text-red-300 line-through rounded px-0.5";
    }
    return (
      <span key={index} className={style}>
        {part.value}
      </span>
    );
  });
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  originalText,
  refinedText,
  showDiff,
  onToggleDiff,
}) => {
  if (!originalText && !refinedText && !showDiff) { // Adjusted condition to allow showing "no text to compare" when diff is toggled
    return null; 
  }

  return (
    <div className="mt-8 p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-sky-300">Wyniki</h2>
        {(originalText || refinedText) && ( // Only show button if there's any text
             <Button onClick={onToggleDiff} variant="secondary" size="sm">
                {showDiff ? 'Ukryj Zmiany' : 'Pokaż Zmiany'}
            </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 id="original-text-heading" className="text-lg font-medium text-slate-300 mb-2">Tekst Oryginalny</h3>
          <div 
            className="prose prose-sm prose-invert max-w-none p-4 bg-slate-700/50 rounded-md h-96 overflow-y-auto whitespace-pre-wrap break-words border border-slate-600"
            aria-labelledby="original-text-heading"
            role="article"
            tabIndex={0}
          >
            {originalText || "Nie podano tekstu oryginalnego."}
          </div>
        </div>
        <div>
          <h3 id="refined-text-heading" className="text-lg font-medium text-slate-300 mb-2">Tekst Udoskonalony</h3>
          <div 
            className="prose prose-sm prose-invert max-w-none p-4 bg-slate-700/50 rounded-md h-96 overflow-y-auto border border-slate-600"
            aria-labelledby="refined-text-heading"
            role="article"
            tabIndex={0}
          >
            {showDiff 
              ? renderDiff(originalText, refinedText) 
              : <span className="whitespace-pre-wrap break-words">{refinedText || (originalText ? "Nie wygenerowano jeszcze udoskonalonego tekstu." : "Oczekiwanie na tekst...")}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;

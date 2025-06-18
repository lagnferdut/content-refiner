
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
    return <p className="text-red-400">Biblioteka Diff niedostępna. Wyświetlanie zwykłego tekstu.</p>;
  }
  const diffs: DiffSegment[] = window.Diff.diffWordsWithSpace(original, refined);
  
  return diffs.map((part, index) => {
    let style = "";
    if (part.added) {
      style = "bg-green-500/30 text-green-300 rounded px-0.5";
    } else if (part.removed) {
      style = "bg-red-500/30 text-red-300 line-through rounded px-0.5";
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
  if (!originalText && !refinedText) {
    return null; // Don't render if there's no data yet
  }

  return (
    <div className="mt-8 p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-sky-300">Wyniki</h2>
        <Button onClick={onToggleDiff} variant="secondary" size="sm">
          {showDiff ? 'Ukryj zmiany' : 'Pokaż zmiany'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">Tekst oryginalny</h3>
          <div className="prose prose-sm prose-invert max-w-none p-4 bg-slate-700/50 rounded-md h-96 overflow-y-auto whitespace-pre-wrap break-words border border-slate-600">
            {originalText || "Nie podano tekstu oryginalnego."}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-300 mb-2">Tekst ulepszony</h3>
          <div className="prose prose-sm prose-invert max-w-none p-4 bg-slate-700/50 rounded-md h-96 overflow-y-auto whitespace-pre-wrap break-words border border-slate-600">
            {showDiff 
              ? renderDiff(originalText, refinedText) 
              : (refinedText || "Nie wygenerowano jeszcze ulepszonego tekstu.")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
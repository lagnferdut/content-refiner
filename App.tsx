
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import ResultsDisplay from './components/ResultsDisplay';
import ExportControls from './components/ExportControls';
import { LoaderIcon } from './components/icons';
import { Language, Purpose, Tone, DesiredLength, RefinementParams } from './types';
import { generateRefinedText } from './services/geminiService';

interface AppState {
  originalText: string;
  refinedText: string;
  showDiff: boolean;
  isLoading: boolean;
  error: string | null;
}

const App: React.FC = () => {
  const initialParams: RefinementParams = {
    language: Language.POLISH, // Default to Polish
    purpose: Purpose.EMAIL_TO_CLIENT,
    tone: Tone.FORMAL,
    length: DesiredLength.ORIGINAL_LENGTH,
  };

  const [appState, setAppState] = useState<AppState>({
    originalText: '',
    refinedText: '',
    showDiff: false,
    isLoading: false,
    error: null,
  });

  const handleRefine = useCallback(async (
    text: string,
    params: RefinementParams,
    suggestions: string
  ) => {
    setAppState(prev => ({ ...prev, isLoading: true, error: null, originalText: text, refinedText: '' }));
    try {
      const result = await generateRefinedText(text, params, suggestions);
      setAppState(prev => ({ ...prev, refinedText: result, isLoading: false }));
    } catch (err) {
      console.error("Błąd ulepszania:", err);
      const errorMessage = err instanceof Error ? err.message : "Wystąpił nieznany błąd podczas ulepszania.";
      setAppState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  }, []);

  const toggleDiff = useCallback(() => {
    setAppState(prev => ({ ...prev, showDiff: !prev.showDiff }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-slate-100 flex flex-col items-center pb-12">
      <Header />
      <main className="container mx-auto px-4 py-8 w-full max-w-4xl">
        <ConfigPanel
          initialParams={initialParams}
          onRefine={handleRefine}
          isLoading={appState.isLoading}
        />

        {appState.isLoading && (
          <div className="mt-8 flex flex-col items-center justify-center p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700">
            <LoaderIcon className="w-12 h-12 text-sky-400 mb-4" />
            <p className="text-lg text-sky-300">Ulepszanie Twojej treści, proszę czekać...</p>
          </div>
        )}

        {appState.error && (
          <div className="mt-8 p-4 bg-red-700/30 text-red-300 border border-red-500 rounded-md shadow-lg">
            <h3 className="font-semibold text-lg mb-1">Błąd</h3>
            <p>{appState.error}</p>
          </div>
        )}

        {!appState.isLoading && (appState.originalText || appState.refinedText) && (
          <>
            <ResultsDisplay
              originalText={appState.originalText}
              refinedText={appState.refinedText}
              showDiff={appState.showDiff}
              onToggleDiff={toggleDiff}
            />
            {appState.refinedText && (
               <ExportControls textToExport={appState.refinedText} filename="ulepszona_tresc" />
            )}
          </>
        )}
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        Oparte na Gemini API & React. Zaprojektowano z myślą o elegancji i wydajności.
      </footer>
    </div>
  );
};

export default App;
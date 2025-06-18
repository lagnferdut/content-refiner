
import React, { useState, useCallback } from 'react';
import { Language, Purpose, Tone, DesiredLength, RefinementParams } from '../types';
import { LANGUAGE_OPTIONS, PURPOSE_OPTIONS, TONE_OPTIONS, LENGTH_OPTIONS } from '../constants';
import SelectDropdown from './SelectDropdown';
import Button from './Button';
import { UploadIcon } from './icons';
import { extractTextFromFile } from '../services/fileHandlers';

interface ConfigPanelProps {
  initialParams: RefinementParams;
  onRefine: (text: string, params: RefinementParams, suggestions: string) => void;
  isLoading: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ initialParams, onRefine, isLoading }) => {
  const [params, setParams] = useState<RefinementParams>(initialParams);
  const [inputText, setInputText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleParamChange = <K extends keyof RefinementParams,>(
    key: K,
    value: RefinementParams[K]
  ) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileError(null);
      setFileName(file.name);
      try {
        const text = await extractTextFromFile(file);
        setInputText(text);
      } catch (error) {
        console.error("Błąd ekstrakcji pliku:", error);
        setFileError(error instanceof Error ? error.message : "Nie udało się odczytać pliku.");
        setInputText('');
        setFileName(null);
      }
    }
    // Reset file input to allow re-uploading the same file
    event.target.value = '';
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!inputText.trim()) {
      alert("Proszę wprowadzić tekst lub przesłać plik do udoskonalenia.");
      return;
    }
    onRefine(inputText, params, suggestions);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 glowing-border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectDropdown
          id="language"
          label="Język Tekstu"
          value={params.language}
          options={LANGUAGE_OPTIONS}
          onChange={(val) => handleParamChange('language', val)}
        />
        <SelectDropdown
          id="purpose"
          label="Cel / Potrzeba"
          value={params.purpose}
          options={PURPOSE_OPTIONS}
          onChange={(val) => handleParamChange('purpose', val)}
        />
        <SelectDropdown
          id="tone"
          label="Ton"
          value={params.tone}
          options={TONE_OPTIONS}
          onChange={(val) => handleParamChange('tone', val)}
        />
        <SelectDropdown
          id="length"
          label="Pożądana Długość"
          value={params.length}
          options={LENGTH_OPTIONS}
          onChange={(val) => handleParamChange('length', val)}
        />
      </div>

      <div>
        <label htmlFor="inputText" className="block text-sm font-medium text-sky-300 mb-1">
          Tekst Wejściowy
        </label>
        <textarea
          id="inputText"
          rows={8}
          className="block w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm p-3 placeholder-slate-400 transition-colors duration-150"
          placeholder="Wklej tutaj swój tekst lub prześlij plik..."
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (fileName) setFileName(null); // Clear file name if text is manually changed
          }}
          aria-label="Tekst Wejściowy"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center justify-center px-4 py-2 border border-sky-500 text-sm font-medium rounded-md text-sky-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors duration-150 w-full sm:w-auto"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') (document.getElementById('file-upload') as HTMLInputElement)?.click(); }}
        >
          <UploadIcon className="w-5 h-5 mr-2" />
          Prześlij Plik (.txt, .docx, .pdf)
        </label>
        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".txt,.docx,.pdf,.md" aria-hidden="true" />
        {fileName && <span className="text-sm text-slate-400 truncate max-w-xs" aria-live="polite">Wybrano: {fileName}</span>}
      </div>
      {fileError && <p className="text-sm text-red-400" role="alert">{fileError}</p>}


      <div>
        <label htmlFor="suggestions" className="block text-sm font-medium text-sky-300 mb-1">
          Opcjonalne Sugestie dla AI
        </label>
        <input
          type="text"
          id="suggestions"
          className="block w-full bg-slate-700 border border-slate-600 text-slate-100 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm p-2.5 placeholder-slate-400 transition-colors duration-150"
          placeholder="np. 'Podkreśl korzyści dla nowych użytkowników', 'Niech brzmi bardziej pilnie'"
          value={suggestions}
          onChange={(e) => setSuggestions(e.target.value)}
          aria-label="Opcjonalne Sugestie dla AI"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading} disabled={isLoading || !inputText.trim()}>
        {isLoading ? 'Udoskonalanie...' : 'Udoskonal Treść'}
      </Button>
    </form>
  );
};

export default ConfigPanel;
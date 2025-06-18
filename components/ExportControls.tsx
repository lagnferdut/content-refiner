
import React, { useState } from 'react';
import Button from './Button';
import { CopyIcon, DownloadIcon } from './icons';
import { exportTextAsFile } from '../services/fileHandlers';

interface ExportControlsProps {
  textToExport: string;
  filename?: string;
}

const ExportControls: React.FC<ExportControlsProps> = ({ textToExport, filename = "ulepszona_tresc" }) => {
  const [copied, setCopied] = useState(false);

  if (!textToExport) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(textToExport)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error('Nie udało się skopiować tekstu: ', err));
  };

  return (
    <div className="mt-6 p-4 bg-slate-800/50 rounded-lg shadow-lg border border-slate-700">
      <h3 className="text-lg font-medium text-sky-300 mb-3">Opcje eksportu</h3>
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleCopy} variant="secondary" size="sm" leftIcon={<CopyIcon className="w-4 h-4" />}>
          {copied ? 'Skopiowano!' : 'Kopiuj do schowka'}
        </Button>
        <Button onClick={() => exportTextAsFile(textToExport, filename, 'txt')} variant="secondary" size="sm" leftIcon={<DownloadIcon className="w-4 h-4" />}>
          Eksportuj jako .txt
        </Button>
        <Button onClick={() => exportTextAsFile(textToExport, filename, 'pdf')} variant="secondary" size="sm" leftIcon={<DownloadIcon className="w-4 h-4" />}>
          Eksportuj jako .pdf
        </Button>
        <Button onClick={() => exportTextAsFile(textToExport, filename, 'docx')} variant="secondary" size="sm" leftIcon={<DownloadIcon className="w-4 h-4" />}>
          Eksportuj jako .docx
        </Button>
      </div>
    </div>
  );
};

export default ExportControls;
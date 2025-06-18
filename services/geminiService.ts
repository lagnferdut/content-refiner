import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { RefinementParams } from '../types';
import { GEMINI_MODEL_TEXT } from "../constants";

// Klucz API MUSI być pobierany wyłącznie ze zmiennej środowiskowej process.env.API_KEY.
// Zakładamy, że ta zmienna jest wstępnie skonfigurowana, ważna i dostępna w kontekście wykonania.
// Konstruktor GoogleGenAI zgłosi błąd, jeśli process.env.API_KEY będzie niezdefiniowany.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! }); // Użycie '!' ponieważ musimy założyć, że jest dostarczony.

// Nie ma potrzeby niestandardowego sprawdzania klucza API tutaj, polegamy na błędzie SDK
// zgłaszanym podczas inicjalizacji w przypadku braku klucza.

export const generateRefinedText = async (
  originalText: string,
  params: RefinementParams,
  suggestions?: string
): Promise<string> => {
  const prompt = `
    Jesteś zaawansowanym asystentem AI specjalizującym się w transformacji i ulepszaniu treści. Twoim zadaniem jest nie tylko poprawa błędów (lingwistycznych, ortograficznych, syntaktycznych), ale przede wszystkim gruntowne przepisanie dostarczonego tekstu, aby w pełni odpowiadał podanym parametrom. 
    Nie wahaj się dokonywać znaczących zmian w strukturze zdań, doborze słownictwa i ogólnym stylu, jeśli prowadzi to do wyraźnie lepszego, bardziej angażującego lub bardziej odpowiedniego tekstu. Twoim celem jest stworzenie wersji, która jest znacząco ulepszona w stosunku do oryginału, a nie tylko lekko skorygowana.
    Użytkownik chce ulepszyć tekst w następującym celu: "${params.purpose}".
    Pożądany ton to: "${params.tone}".
    Pożądana długość to: "${params.length}".
    Tekst jest w języku: "${params.language}".
    ${suggestions ? `Użytkownik podał również następujące konkretne sugestie: "${suggestions}"` : ""}

    Proszę ulepszyć następujący tekst:
    ---
    ${originalText}
    ---

    Zwróć TYLKO ulepszony tekst jako zwykły ciąg znaków. Nie dołączaj żadnych preambuł, wyjaśnień ani formatowania markdown, takiego jak \`\`\`json lub \`\`\`.
    Na przykład, jeśli ulepszony tekst to "To jest gruntownie poprawione zdanie.", cała Twoja odpowiedź powinna brzmieć właśnie tak:
    To jest gruntownie poprawione zdanie.
  `;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
    });

    const refinedText = response.text;
    if (typeof refinedText === 'string') {
        let cleanedText = refinedText.trim();
        if (cleanedText.startsWith('"') && cleanedText.endsWith('"')) {
            cleanedText = cleanedText.substring(1, cleanedText.length - 1);
        }
        if (cleanedText.startsWith('```') && cleanedText.includes('\n')) {
            // Remove potential markdown fences and language specifier
            const lines = cleanedText.split('\n');
            if (lines.length > 1 && lines[0].startsWith('```')) {
                lines.shift(); // remove first line like ```json or ```
            }
            if (lines.length > 0 && lines[lines.length - 1].startsWith('```')) {
                lines.pop(); // remove last line ```
            }
            cleanedText = lines.join('\n').trim();
        }
        return cleanedText;
    } else {
        throw new Error("Nieprawidłowy format odpowiedzi od AI. Oczekiwano zwykłego tekstu.");
    }

  } catch (error) {
    console.error("Błąd wywołania API Gemini:", error);
    if (error instanceof Error) {
        // Sprawdź, czy błąd jest związany z kluczem API i podaj bardziej szczegółowy komunikat.
        // Błąd "API Key must be set" powinien być idealnie przechwycony podczas inicjalizacji.
        // Ten blok catch obsługuje błędy podczas wywołania generateContent (np. nieprawidłowy klucz, problemy z limitem itp.)
        if (error.message.includes("API key not valid") || 
            error.message.includes("API Key is missing") || // Przykłady innych potencjalnych komunikatów
            error.message.includes("API Key must be set")) { // Chociaż ten błąd występuje przy new GoogleGenAI()
             throw new Error(`Błąd konfiguracji API Gemini: Klucz API (process.env.API_KEY) jest nieprawidłowy, brakujący lub nie został poprawnie udostępniony w środowisku przeglądarki. Sprawdź konfigurację zmiennej środowiskowej process.env.API_KEY. Oryginalny błąd: ${error.message}`);
        }
        throw new Error(`Błąd usługi AI: ${error.message}`);
    }
    throw new Error("Wystąpił nieznany błąd usługi AI.");
  }
};
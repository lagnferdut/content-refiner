
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { RefinementParams, Language } from '../types';
import { GEMINI_MODEL_TEXT } from "../constants";

// Ensure API_KEY is handled by the environment, not hardcoded.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Klucz API dla Gemini nie jest ustawiony. Proszę ustawić zmienną środowiskową API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

// Helper to map UI language selection to English for the model if needed,
// though a Polish prompt should handle Polish language names correctly.
// For this version, we assume the Polish prompt will suffice.
// const mapLanguageToEnglishForPrompt = (lang: Language): string => {
//   switch (lang) {
//     case Language.POLISH: return "Polish";
//     case Language.GERMAN: return "German";
//     case Language.ENGLISH: return "English";
//     default: return "English"; // Fallback
//   }
// };

export const generateRefinedText = async (
  originalText: string,
  params: RefinementParams,
  suggestions?: string
): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Klucz API dla Gemini nie został skonfigurowany.");
  }

  // const languageForPrompt = mapLanguageToEnglishForPrompt(params.language);

  const prompt = `
    Jesteś ekspertem w dziedzinie udoskonalania treści. Twoim zadaniem jest przeanalizowanie dostarczonego tekstu, poprawienie wszelkich błędów (językowych, ortograficznych, składniowych itp.) oraz przepisanie go zgodnie z podanymi parametrami.
    Użytkownik chce udoskonalić tekst w następującym celu: "${params.purpose}".
    Pożądany ton to: "${params.tone}".
    Pożądana długość to: "${params.length}".
    Tekst jest w języku: "${params.language}". 
    ${suggestions ? `Użytkownik podał również następujące konkretne sugestie: "${suggestions}"` : ""}

    Proszę udoskonalić następujący tekst:
    ---
    ${originalText}
    ---

    Zwróć TYLKO udoskonalony tekst jako zwykły ciąg znaków. Nie dołączaj żadnych wstępów, wyjaśnień ani formatowania markdown, takiego jak \`\`\`json lub \`\`\`.
    Na przykład, jeśli udoskonalony tekst to "To jest poprawione zdanie.", cała Twoja odpowiedź powinna brzmieć właśnie tak:
    To jest poprawione zdanie.
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
        // More robust markdown fence removal
        const fenceRegex = /^```(?:\w*\s*\n)?(.*?)(?:\n\s*```)?$/s;
        const match = cleanedText.match(fenceRegex);
        if (match && match[1]) {
            cleanedText = match[1].trim();
        }
        return cleanedText;
    } else {
        throw new Error("Nieprawidłowy format odpowiedzi od AI. Oczekiwano zwykłego tekstu.");
    }

  } catch (error) {
    console.error("Błąd wywołania API Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Błąd usługi AI: ${error.message}`);
    }
    throw new Error("Wystąpił nieznany błąd podczas komunikacji z usługą AI.");
  }
};
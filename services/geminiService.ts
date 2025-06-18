
export const sendPromptToGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data.response || "Brak odpowiedzi.";
  } catch (error) {
    console.error("Błąd przy wysyłaniu do AI:", error);
    return "Błąd połączenia z serwerem.";
  }
};

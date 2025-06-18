
import { jsPDF } from 'jspdf'; // For type, actual object is window.jspdf.jsPDF
import { Packer, Document, Paragraph, TextRun } from 'docx'; // For type, actual object is window.docx

export const extractTextFromFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          return reject(new Error("Nie udało się odczytać pliku."));
        }
        const arrayBuffer = event.target.result as ArrayBuffer;

        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith(".docx")) {
          const result = await window.mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } else if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let textContent = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const text = await page.getTextContent();
            textContent += text.items.map((s: any) => s.str).join(" ") + "\n";
          }
          resolve(textContent);
        } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
          resolve(new TextDecoder().decode(arrayBuffer));
        } else {
          reject(new Error("Nieobsługiwany typ pliku. Proszę wgrać pliki .docx, .pdf lub .txt."));
        }
      } catch (error) {
        console.error("Błąd przetwarzania pliku:", error);
        reject(new Error(`Nie udało się przetworzyć pliku: ${error instanceof Error ? error.message : String(error)}`));
      }
    };
    reader.onerror = () => reject(new Error("Błąd podczas odczytu pliku."));
    reader.readAsArrayBuffer(file);
  });
};

export const exportTextAsFile = (content: string, filename: string, type: 'txt' | 'pdf' | 'docx'): void => {
  if (type === 'txt') {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    window.saveAs(blob, `${filename}.txt`);
  } else if (type === 'pdf') {
    const pdfDoc = new window.jspdf.jsPDF();
    // Split text into lines that fit the PDF width
    const lines = pdfDoc.splitTextToSize(content, 180); // 180 is approx width in mm
    pdfDoc.text(lines, 10, 10);
    pdfDoc.save(`${filename}.pdf`);
  } else if (type === 'docx') {
    const doc = new window.docx.Document({
      sections: [{
        properties: {},
        children: [
          new window.docx.Paragraph({
            children: content.split('\n').map(line => new window.docx.TextRun(line))
          }),
        ],
      }],
    });

    window.docx.Packer.toBlob(doc).then((blob: Blob) => {
      window.saveAs(blob, `${filename}.docx`);
    }).catch((err: Error) => {
        console.error("Błąd tworzenia pliku DOCX:", err);
        // Fallback to TXT if DOCX creation fails
        alert("Nie udało się wygenerować pliku DOCX. Eksportowanie jako TXT.");
        exportTextAsFile(content, filename, 'txt');
    });
  }
};
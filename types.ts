
export enum Language {
  ENGLISH = "Angielski",
  POLISH = "Polski",
  GERMAN = "Niemiecki",
}

export enum Purpose {
  EMAIL_TO_CLIENT = "Email do klienta",
  SOCIAL_MEDIA_POST = "Post na media społecznościowe",
  BLOG_ARTICLE = "Artykuł na bloga",
  FORMAL_REPORT = "Raport formalny",
  CASUAL_MESSAGE = "Wiadomość nieformalna",
  MARKETING_COPY = "Tekst marketingowy",
  TECHNICAL_DOCUMENTATION = "Dokumentacja techniczna",
  CREATIVE_STORY = "Opowiadanie kreatywne",
}

export enum Tone {
  FORMAL = "Formalny",
  INFORMAL = "Nieformalny",
  SERIOUS = "Poważny",
  HUMOROUS = "Humorystyczny",
  PERSUASIVE = "Perswazyjny",
  EMPATHETIC = "Empatyczny",
  CONFIDENT = "Pewny siebie",
  NEUTRAL = "Neutralny",
}

export enum DesiredLength {
  CONCISE = "Zwięzła (podsumuj)",
  DETAILED = "Szczegółowa (rozwiń)",
  ORIGINAL_LENGTH = "Podobna do oryginału",
  VERY_SHORT = "Bardzo krótka (np. tweet)",
  MEDIUM = "Średnia długość (kilka akapitów)",
}

export interface RefinementParams {
  language: Language;
  purpose: Purpose;
  tone: Tone;
  length: DesiredLength;
}

export interface DiffSegment {
  value: string;
  added?: boolean;
  removed?: boolean;
  count?: number;
}

// Declare global variables from CDN scripts
declare global {
  interface Window {
    mammoth: any;
    pdfjsLib: any;
    Diff: {
      diffChars: (oldStr: string, newStr: string) => DiffSegment[];
      diffWordsWithSpace: (oldStr: string, newStr: string) => DiffSegment[];
    };
    saveAs: (blob: Blob, filename: string) => void;
    jspdf: {
      jsPDF: new (options?: any) => any; // Constructor for jsPDF
    };
    docx: any; 
  }
}
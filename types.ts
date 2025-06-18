
export enum Language {
  ENGLISH = "Angielski",
  POLISH = "Polski",
  GERMAN = "Niemiecki",
}

export enum Purpose {
  EMAIL_TO_CLIENT = "Email do Klienta",
  SOCIAL_MEDIA_POST = "Post na Media Społecznościowe",
  BLOG_ARTICLE = "Artykuł Blogowy",
  FORMAL_REPORT = "Raport Formalny",
  CASUAL_MESSAGE = "Wiadomość Nieformalna",
  MARKETING_COPY = "Tekst Marketingowy",
  TECHNICAL_DOCUMENTATION = "Dokumentacja Techniczna",
  CREATIVE_STORY = "Opowiadanie Kreatywne",
}

export enum Tone {
  FORMAL = "Formalny",
  INFORMAL = "Nieformalny",
  SERIOUS = "Poważny",
  HUMOROUS = "Humorystyczny",
  PERSUASIVE = "Perswazyjny",
  EMPATHETIC = "Empatyczny",
  CONFIDENT = "Pewny Siebie",
  NEUTRAL = "Neutralny",
}

export enum DesiredLength {
  CONCISE = "Zwięzły (podsumuj)",
  DETAILED = "Szczegółowy (rozwiń)",
  ORIGINAL_LENGTH = "Zbliżona do oryginału",
  VERY_SHORT = "Bardzo krótki (np. tweet)",
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
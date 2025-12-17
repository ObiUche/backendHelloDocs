export interface Flashcard {
  id: number;
  frontContent: string;
  backContent: string;
  category: string;
  difficultyLevel: string;
  exampleCode?: string;
  tags?: string;
  language: string;
}

export interface FilterOptions {
  difficultyLevel?: string;
  category?: string;
  language?: string;
  tag?: string;
}
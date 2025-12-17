import { Flashcard } from '../types/flashcard';

export const normalizeFlashcard = (data: any): Flashcard => {
  console.log('Normalizing flashcard:', {
    id: data.id,
    hasFront: !!data.frontContent,
    hasBack: !!data.backContent,
    tagsType: typeof data.tags,
    tagsValue: data.tags
  });

  const normalized: Flashcard = {
    id: Number(data.id) || 0,
    frontContent: String(data.frontContent || ''),
    backContent: String(data.backContent || ''),
    difficultyLevel: data.difficultyLevel || 'BEGINNER',
    category: String(data.category || ''),
    language: String(data.language || 'java'),
    tags: String(data.tags || ''),
    exampleCode: data.exampleCode,
    createdAt: data.createdAt
  };

  console.log('Normalized result:', normalized);
  return normalized;
};

export const normalizeFlashcards = (data: any[]): Flashcard[] => {
  return data.map(normalizeFlashcard);
};
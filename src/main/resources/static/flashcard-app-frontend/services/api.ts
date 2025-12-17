import { FilterOptions, Flashcard } from '../types/flashcard';
import { normalizeFlashcard, normalizeFlashcards } from '../utils/flashcardUtils';

// CHANGE THIS TO YOUR IP: 172.20.10.5
const API_BASE_URL = 'http://172.20.10.5:8080/api';

export const FlashcardService = {
  async getAllFlashcards(): Promise<Flashcard[]> {
    try {
      console.log('Fetching from:', `${API_BASE_URL}/flashcards`);
      const response = await fetch(`${API_BASE_URL}/flashcards`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch`);
      }
      
      const data = await response.json();
      console.log(`Received ${data.length} flashcards`);
      
      // NORMALIZE THE DATA
      const normalized = normalizeFlashcards(data);
      console.log(`Normalized ${normalized.length} flashcards`);
      
      return normalized;
      
    } catch (error) {
      console.error('API Error:', error);
      // Return empty array instead of throwing for better UX
      return [];
    }
  },

  async getFlashcardsWithFilters(filters: FilterOptions): Promise<Flashcard[]> {
    try {
      const params = new URLSearchParams();
      if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel);
      if (filters.category) params.append('category', filters.category);
      if (filters.language) params.append('language', filters.language);
      if (filters.tag) params.append('tag', filters.tag);

      const url = `${API_BASE_URL}/flashcards${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Failed to fetch filtered flashcards');
      
      const data = await response.json();
      return normalizeFlashcards(data);
      
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },

  async getFlashcardById(id: number): Promise<Flashcard | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/${id}`);
      if (!response.ok) return null;
      
      const data = await response.json();
      return normalizeFlashcard(data);
      
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  },

  async getDifficultyLevels(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/difficulties`);
      if (!response.ok) throw new Error('Failed to fetch difficulty levels');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
    }
  },

  async getCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/flashcards/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  },
};
export const AuthService = {
  async login(username: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) throw new Error('Login failed');
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async register(userData: any): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) throw new Error('Registration failed');
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  async checkUsername(username: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check-username/${username}`);
      if (!response.ok) return false;
      const data = await response.json();
      return data.available;
    } catch (error) {
      console.error('Username check error:', error);
      return false;
    }
  },
};
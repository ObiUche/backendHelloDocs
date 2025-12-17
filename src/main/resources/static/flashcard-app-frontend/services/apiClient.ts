import { useAuth } from '../context/AuthContext';

export const createApiClient = () => {
  const { getToken } = useAuth();
  
  return {
    async fetchWithAuth(url: string, options: RequestInit = {}) {
      const token = getToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP ${response.status}`);
      }
      
      return response;
    },
    
    async get(url: string) {
      return this.fetchWithAuth(url);
    },
    
    async post(url: string, data: any) {
      return this.fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    async put(url: string, data: any) {
      return this.fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    
    async delete(url: string) {
      return this.fetchWithAuth(url, {
        method: 'DELETE',
      });
    },
  };
};
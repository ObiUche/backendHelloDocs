// context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  token: string;
}

interface GuestProgress {
  flashcardId: number;
  isCorrect: boolean;
  timestamp: Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  guestProgress: GuestProgress[];
  isGuest: boolean;
  login: (username: string, password: string) => Promise<string>;
  register: (userData: any) => Promise<string>;
  logout: () => Promise<void>;
  getToken: () => string | null;
  addGuestProgress: (flashcardId: number, isCorrect: boolean) => boolean;
  clearGuestProgress: () => void;
  migrateGuestProgress: (token: string) => Promise<boolean>;
  canAddMoreGuestProgress: () => boolean;
  getGuestProgressCount: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const GUEST_PROGRESS_LIMIT = 50;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestProgress, setGuestProgress] = useState<GuestProgress[]>([]);
  const [isGuest, setIsGuest] = useState(true);

  useEffect(() => {
    checkStoredAuth();
  }, []);

  const checkStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsGuest(false);
      } else {
        setIsGuest(true);
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      setIsGuest(true);
    } finally {
      setLoading(false);
    }
  };

  const addGuestProgress = (flashcardId: number, isCorrect: boolean): boolean => {
    if (!canAddMoreGuestProgress()) {
      return false;
    }
    
    setGuestProgress(prev => [
      ...prev,
      {
        flashcardId,
        isCorrect,
        timestamp: new Date(),
      }
    ]);
    return true;
  };

  const clearGuestProgress = () => {
    setGuestProgress([]);
  };

  const canAddMoreGuestProgress = () => {
    return guestProgress.length < GUEST_PROGRESS_LIMIT;
  };

  const getGuestProgressCount = () => {
    return guestProgress.length;
  };

  const migrateGuestProgress = async (token: string): Promise<boolean> => {
    if (guestProgress.length === 0) return true;
    
    try {
      // Send all guest progress to backend
      const response = await fetch('http://172.20.10.5:8080/api/user-progress/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          progressRecords: guestProgress,
        }),
      });
      
      if (response.ok) {
        clearGuestProgress();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error migrating guest progress:', error);
      return false;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://172.20.10.5:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Login failed');
      }
      
      const data = await response.json();
      const userData: User = {
        id: data.username,
        username: data.username,
        email: data.email,
        role: data.role,
        token: data.token,
      };
      
      // Migrate guest progress before setting user
      let migrationMessage = '';
      if (guestProgress.length > 0) {
        const migrationSuccess = await migrateGuestProgress(data.token);
        if (migrationSuccess) {
          migrationMessage = ` (${guestProgress.length} progress records saved)`;
        } else {
          migrationMessage = ' (some progress may not have been saved)';
        }
      }
      
      setUser(userData);
      setIsGuest(false);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      
      // Return the migration message for UI display
      return migrationMessage;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch('http://172.20.10.5:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Registration failed');
      }
      
      const data = await response.json();
      const newUser: User = {
        id: data.username,
        username: data.username,
        email: data.email,
        role: data.role,
        token: data.token,
      };
      
      // Migrate guest progress for registration too
      let migrationMessage = '';
      if (guestProgress.length > 0) {
        const migrationSuccess = await migrateGuestProgress(data.token);
        if (migrationSuccess) {
          migrationMessage = ` (${guestProgress.length} progress records saved)`;
        } else {
          migrationMessage = ' (some progress may not have been saved)';
        }
      }
      
      setUser(newUser);
      setIsGuest(false);
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      
      return migrationMessage;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      setIsGuest(true);
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getToken = (): string | null => {
    return user?.token || null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      guestProgress,
      isGuest,
      login, 
      register, 
      logout,
      getToken,
      addGuestProgress,
      clearGuestProgress,
      migrateGuestProgress,
      canAddMoreGuestProgress,
      getGuestProgressCount
    }}>
      {children}
    </AuthContext.Provider>
  );
};
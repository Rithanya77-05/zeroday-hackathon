import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('campuslink-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call - in production, this would be a real authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data based on email
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.includes('admin') ? 'Admin User' : 'Student User',
        role: email.includes('admin') ? 'admin' : 'student',
        studentId: email.includes('admin') ? undefined : 'ST' + Math.floor(Math.random() * 10000),
        department: email.includes('admin') ? undefined : 'Computer Science',
        year: email.includes('admin') ? undefined : 3,
        hostelRoom: email.includes('admin') ? undefined : 'H' + Math.floor(Math.random() * 500),
        createdAt: new Date().toISOString()
      };

      setUser(mockUser);
      localStorage.setItem('campuslink-user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      setUser(newUser);
      localStorage.setItem('campuslink-user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('campuslink-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
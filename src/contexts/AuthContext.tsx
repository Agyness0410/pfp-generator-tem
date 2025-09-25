import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (invitationCode: string) => Promise<boolean>;
  logout: () => void;
  userId: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INVITATION_CODE = 'vumnaz-pinwu1990-ziXqyx'; // This would be provided by you manually

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const storedAuth = localStorage.getItem('herstory_auth');
    const storedUserId = localStorage.getItem('herstory_user_id');
    if (storedAuth === 'true' && storedUserId) {
      setIsAuthenticated(true);
      setUserId(storedUserId);
    }
  }, []);

  const login = async (invitationCode: string): Promise<boolean> => {
    if (invitationCode === INVITATION_CODE) {
      // Generate a unique user ID
      const newUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setIsAuthenticated(true);
      setUserId(newUserId);

      localStorage.setItem('herstory_auth', 'true');
      localStorage.setItem('herstory_user_id', newUserId);

      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserId(null);
    localStorage.removeItem('herstory_auth');
    localStorage.removeItem('herstory_user_id');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
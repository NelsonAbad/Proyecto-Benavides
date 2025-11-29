import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'medico' | 'farmaceutico' | 'paciente';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  addLog: (action: string, module: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock authentication - In production, this would call a secure API
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role,
      permissions: getPermissionsByRole(role)
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Add login log
    addLog('Inicio de sesión', 'Autenticación');
  };

  const register = async (email: string, password: string, name: string, role: UserRole) => {
    // Mock registration
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role,
      permissions: getPermissionsByRole(role)
    };

    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Add registration log
    addLog('Registro de usuario', 'Autenticación');
  };

  const logout = () => {
    addLog('Cierre de sesión', 'Autenticación');
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  const addLog = (action: string, module: string) => {
    const logs = JSON.parse(localStorage.getItem('accessLogs') || '[]');
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      userId: user?.id || 'system',
      userName: user?.name || 'Sistema',
      userEmail: user?.email || 'system@benavides.com',
      action,
      module
    };
    logs.unshift(newLog);
    localStorage.setItem('accessLogs', JSON.stringify(logs.slice(0, 100))); // Keep last 100 logs
  };

  const getPermissionsByRole = (role: UserRole): string[] => {
    const permissions: Record<UserRole, string[]> = {
      admin: ['users', 'patients', 'logs', 'settings', 'reports'],
      medico: ['patients', 'records', 'prescriptions'],
      farmaceutico: ['prescriptions', 'inventory', 'patients'],
      paciente: ['own_records', 'appointments']
    };
    return permissions[role] || [];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, addLog }}>
      {children}
    </AuthContext.Provider>
  );
};

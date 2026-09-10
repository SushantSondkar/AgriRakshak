import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  phone: string;
  region: string;
}

interface AuthContextType {
  user: User | null;
  login: (phone: string, pin: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (phone: string, pin: string): Promise<void> => {
    // Fake login implementation
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (phone === '9876543210' && pin === '1234') {
          setUser({ id: '1', name: 'Ramesh Patil', phone: '9876543210', region: 'Pune' });
          resolve();
        } else {
          reject(new Error('Invalid credentials. Use 9876543210 / 1234'));
        }
      }, 1000); // simulate network delay
    });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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

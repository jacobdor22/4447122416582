import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: number;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

// default context values so screens don't crash if used outside the provider
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // check if user was previously logged in when app starts
  useEffect(() => {
    AsyncStorage.getItem('user').then((saved) => {
      if (saved) setUser(JSON.parse(saved));
    });
  }, []);

  // save user to async storage so they stay logged in after closing the app
  const login = (user: User) => {
    setUser(user);
    AsyncStorage.setItem('user', JSON.stringify(user));
  };

  // clear user from state and storage on logout
  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook so any screen can access auth without importing useContext directly
export const useAuth = () => useContext(AuthContext);
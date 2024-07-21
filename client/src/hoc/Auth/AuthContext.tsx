import { createContext } from 'react';
import { User } from './AuthProvider';
import { ApolloQueryResult } from '@apollo/client';

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  refetchUser: () => Promise<ApolloQueryResult<any>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

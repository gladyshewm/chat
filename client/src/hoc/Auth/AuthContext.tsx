import { createContext } from 'react';
import { UserQueryResult } from './auth.generated';
import { UserInfo, UserInput, UserWithToken } from '../../types.generated';

interface AuthContextType {
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  fetchUser: () => Promise<UserQueryResult>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  register: (input: UserInput) => Promise<UserWithToken>;
  login: (email: string, password: string) => Promise<UserWithToken>;
  logout: () => Promise<void>;
  loadingStates: {
    checkAuth: boolean;
    user: boolean;
    createUser: boolean;
    logIn: boolean;
    logOut: boolean;
  };
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

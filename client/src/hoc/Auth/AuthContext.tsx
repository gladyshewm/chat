import { createContext } from 'react';
import { UserQueryResult } from './auth.generated';
import {
  UserInfo,
  CreateUserInput,
  LoginUserInput,
  UserWithToken,
} from '../../types.generated';

interface AuthContextType {
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  fetchUser: () => Promise<UserQueryResult>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  register: (createInput: CreateUserInput) => Promise<UserWithToken>;
  login: (loginInput: LoginUserInput) => Promise<UserWithToken>;
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

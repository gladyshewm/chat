import React, { useState, useEffect, FC } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_USER } from '../../graphql/query/user';
import { SIGN_OUT_USER } from '../../graphql/mutations/user';
import { LOGIN_USER } from '../../graphql/mutations/user';
import CustomLoader from '../../components/CustomLoader/CustomLoader';
import { AuthContext } from './AuthContext';

export interface User {
  uuid: string;
  name: string;
  email: string;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const client = useApolloClient();

  const { refetch } = useQuery(GET_USER, {
    fetchPolicy: 'network-only',
    skip: true,
  });
  const [signOut] = useMutation(SIGN_OUT_USER);
  const [signIn] = useMutation(LOGIN_USER);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const { data } = await refetch();
          if (data && data.user) {
            setUser({
              uuid: data.user.user.uuid,
              name: data.user.user.name,
              email: data.user.user.email,
            });
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error('Ошибка получения пользователя:', error.message);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [refetch]);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await signIn({
        variables: {
          email,
          password,
        },
      });
      const { user, token }: { user: User; token: string } = res.data.logInUser;
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', token);
      client.resetStore();
    } catch (error) {
      console.error('Ошибка при входе в систему:', error.message);
      throw new Error(error.message);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { data } = await signOut();
      if (data.logOutUser) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        client.clearStore();
      } else {
        console.error('Не удалось выйти из системы', data.message);
      }
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error.message);
      throw new Error(error.message);
    }
  };

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

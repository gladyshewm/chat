import React, { useState, useEffect, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { AuthContext } from './AuthContext';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useLogInUserMutation,
  useLogOutUserMutation,
  useRefreshTokenMutation,
  useUserLazyQuery,
} from './auth.generated';
import {
  CreateUserInput,
  LoginUserInput,
  UserInfo,
  UserWithToken,
} from '@shared/types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const client = useApolloClient();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loadingStates, setLoadingStates] = useState({
    checkAuth: false,
    user: false,
    createUser: false,
    logIn: false,
    logOut: false,
    deleteUser: false,
  });

  const setLoading = useCallback(
    (key: keyof typeof loadingStates, value: boolean) => {
      setLoadingStates((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const [createUser] = useCreateUserMutation();
  const [fetchUser] = useUserLazyQuery();
  const [logOutUserMutation] = useLogOutUserMutation();
  const [logInUserMutation] = useLogInUserMutation();
  const [deleteUserMutation] = useDeleteUserMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading('checkAuth', true);
      const token = localStorage.getItem('accessToken');

      if (!token) {
        setIsAuthenticated(false);
        setLoading('checkAuth', false);
        return;
      }

      try {
        const { data } = await fetchUser();

        if (!data || !data.user) {
          const { data: refresh } = await refreshTokenMutation();

          if (!refresh || !refresh.refreshToken.accessToken) {
            localStorage.removeItem('accessToken');
            setIsAuthenticated(false);
            setUser(null);
            setLoading('checkAuth', false);
            return;
          }

          const { accessToken: newToken, user: refreshedUser } =
            refresh.refreshToken;
          localStorage.setItem('accessToken', newToken);
          setUser({
            uuid: refreshedUser.uuid,
            name: refreshedUser.name,
            email: refreshedUser.email,
          });
          setIsAuthenticated(true);
          setLoading('checkAuth', false);

          return;
        }

        setUser({
          uuid: data.user.user.uuid,
          name: data.user.user.name,
          email: data.user.user.email,
        });
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Ошибка получения пользователя:', error.message);
        setIsAuthenticated(false);
        setUser(null);
      }

      setLoading('checkAuth', false);
    };

    checkAuth();
  }, [fetchUser, setLoading, refreshTokenMutation]);

  const register = async (input: CreateUserInput): Promise<UserWithToken> => {
    setLoading('createUser', true);
    try {
      const res = await createUser({
        variables: {
          createInput: {
            name: input.name,
            email: input.email,
            password: input.password,
          },
        },
      });

      if (!res.data) {
        console.error('Не удалось зарегистрироваться');
        throw new Error('Не удалось зарегистрироваться');
      }

      const { user, accessToken } = res.data.createUser;
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', accessToken);
      client.resetStore();

      return { user, token: accessToken };
    } catch (error) {
      console.error('Ошибка при регистрации:', error.message);
      throw new Error(error.message);
    } finally {
      setLoading('createUser', false);
    }
  };

  const login = async (input: LoginUserInput): Promise<UserWithToken> => {
    setLoading('logIn', true);
    try {
      const res = await logInUserMutation({
        variables: {
          loginInput: {
            email: input.email,
            password: input.password,
          },
        },
      });

      if (!res.data) {
        console.error('Не удалось войти в систему');
        throw new Error('Не удалось войти в систему');
      }

      const { user, accessToken } = res.data.logInUser;
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('accessToken', accessToken);
      client.resetStore();

      return { user, token: accessToken };
    } catch (error) {
      console.error('Ошибка при входе в систему:', error.message);
      throw new Error(error.message);
    } finally {
      setLoading('logIn', false);
    }
  };

  const logout = async (): Promise<void> => {
    setLoading('logOut', true);
    try {
      await logOutUserMutation();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      client.clearStore();
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error.message);
      throw new Error(error.message);
    } finally {
      setLoading('logOut', false);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    setLoading('deleteUser', true);
    try {
      await deleteUserMutation();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('accessToken');
      client.clearStore();
    } catch (error) {
      console.error('Ошибка при удалении аккаунта:', error.message);
      throw new Error(error.message);
    } finally {
      setLoading('deleteUser', false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        fetchUser,
        isAuthenticated,
        setIsAuthenticated,
        register,
        login,
        logout,
        deleteAccount,
        loadingStates,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

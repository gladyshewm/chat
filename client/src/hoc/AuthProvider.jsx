import { createContext, useState, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_USER } from "../graphql/query/user";
import { SIGN_OUT_USER } from "../graphql/mutations/user";
import { LOGIN_USER } from "../graphql/mutations/user";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
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
                    if (data && data.getUser) {
                        setUser({
                            id: data.getUser.id,
                            name: data.getUser.name,
                            email: data.getUser.email,
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

    const login = async (email, password) => {
        try {
            await signIn({
                variables: {
                    email,
                    password
                }
            }).then((res) => {
                const { user, token } = res.data.loginUser;
                setUser(user);
                setIsAuthenticated(true);
                localStorage.setItem('authToken', token);
                client.resetStore();
            }).catch((error) => {
                console.error('Ошибка входа. Проверьте правильность введённых данных:', error.message);
            });
        } catch (error) {
            console.error('Ошибка при входе в систему:', error.message);
        }
    };

    const logout = async () => {
        try {
            const { data } = await signOut();
            if (data.signOutUser) {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('authToken');
                client.resetStore();
            } else {
                console.error('Не удалось выйти из системы', data.message);
            }
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error.message);
        }
    };

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return <AuthContext.Provider value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        login,
        logout,
        isLoading
    }}>
        {children}
    </AuthContext.Provider>;
};
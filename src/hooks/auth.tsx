import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface Credentials {
  email: string;
  password: string;
}
interface AuthContextData {
  user: User;
  token: string | null;
  signIn(credentials: Credentials): Promise<void>;
  signInWithGoogle(accessToken: string): Promise<void>;
  signUp(user: SignUp): Promise<void>;
  signOut(): void;
  updateToken(token: string): void;
  updateUser(user: User): void;
  recoverPassword(email: string): void;
}

export interface SignUp {
  name: string;
  birthday: Date;
  email: string;
  password: string;
}
export interface User {
  _id: string;
  name: string;
  birthday: Date;
  email: string;
  role: string;
  _address: string;
}

interface AuthState {
  user: User;
  token: string;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('Auth@token');
    const user = localStorage.getItem('Auth@user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/auth/signIn', {
      email,
      password,
    });

    const { user, access_token } = response.data;

    localStorage.setItem('Auth@token', access_token);
    localStorage.setItem('Auth@user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${access_token}`;

    setData({ token: access_token, user });
  }, []);

  const signInWithGoogle = useCallback(async userProfile => {
    const userData = {
      name: userProfile.name,
      email: userProfile.email,
      providerId: userProfile.googleId,
    };

    const response = await api.post('/auth/google', userData);

    const { user, access_token } = response.data;

    localStorage.setItem('Auth@token', access_token);
    localStorage.setItem('Auth@user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${access_token}`;

    setData({ token: access_token, user });
  }, []);

  const signUp = useCallback(async (userData: SignUp) => {
    const response = await api.post('/auth/signUp', userData);

    const { user, access_token } = response.data;

    localStorage.setItem('Auth@token', access_token);
    localStorage.setItem('Auth@user', JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${access_token}`;

    setData({ token: access_token, user });
  }, []);

  const recoverPassword = useCallback(async (email: string) => {
    await api.post('/auth/recover-password', {
      email,
    });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('Auth@token');
    localStorage.removeItem('Auth@user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback((user: User) => {
    setData(state => ({
      ...state,
      user,
    }));

    localStorage.setItem('Auth@user', JSON.stringify(user));
  }, []);

  const updateToken = useCallback((token: string) => {
    setData(state => ({
      ...state,
      token,
    }));

    localStorage.setItem('Auth@token', token);

    api.defaults.headers.authorization = `Bearer ${token}`;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
        updateToken,
        updateUser,
        recoverPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };

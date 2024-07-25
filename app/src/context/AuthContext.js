import React, {createContext, useState, useEffect, useMemo} from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import {IP} from '@env';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
  });

  useEffect(() => {
    const loadTokens = async () => {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (accessToken && refreshToken) {
        setAuth({accessToken, refreshToken});
      }
    };
    loadTokens();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const refresh = JSON.parse(auth.refreshToken);
      const response = await axios.post(`${IP}/oauth/refresh`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refresh}`,
        },
      });

      const newAccessToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken;
      if (auth.refreshToken !== newRefreshToken) {
        setAuth(prevAuth => ({
          ...prevAuth,
          refreshToken: newRefreshToken,
        }));
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
      }
      await SecureStore.setItemAsync('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw error;
    }
  };

  const checkTokenExpiration = async () => {
    const token = await SecureStore.getItemAsync('accessToken');
    console.log('auth', auth.accessToken);
    console.log('secure', await SecureStore.getItemAsync('accessToken'));
    console.log('refresh', await SecureStore.getItemAsync('refreshToken'));
    if (token) {
      const tokenExp = JSON.parse(atob(token.split('.')[1])).exp;
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > tokenExp) {
        return refreshAccessToken();
      }
      return token;
    }
    return null;
  };

  const value = useMemo(() => ({auth, setAuth, checkTokenExpiration}), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

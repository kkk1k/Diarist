import React, {createContext, useState, useMemo, useContext} from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
  });

  const refreshAccessToken = async () => {
    try {
      const refresh = JSON.parse(auth.refreshToken);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/oauth/refresh`,
        null, // 두 번째 인수로 null을 전달하여 데이터 없음 명시
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${refresh}`,
          },
        },
      );

      const newAccessToken = response.data.data.accessToken;
      const newRefreshToken = response.data.data.refreshToken;
      if (auth.refreshToken !== newRefreshToken) {
        setAuth(prevAuth => ({
          ...prevAuth,
          refreshToken: newRefreshToken,
        }));
      }

      setAuth(prevAuth => ({
        ...prevAuth,
        accessToken: newAccessToken,
      }));

      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      throw error;
    }
  };

  const checkTokenExpiration = async () => {
    const token = auth.accessToken;
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

export const useAuth = () => useContext(AuthContext);

import React, {createContext, useState, useEffect, useMemo} from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({children}) {
  const [auth, setAuth] = useState({
    accessToken: null,
    refreshToken: null,
  });

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/oauth/refresh`, {
        refreshToken: auth.refreshToken,
      });

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

export const useAuth = () => React.useContext(AuthContext);

export default AuthContext;

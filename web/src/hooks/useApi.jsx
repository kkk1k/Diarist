import {useContext, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../context/AuthContext';

function useApi() {
  const {checkTokenExpiration} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function AxiosApi(method, url, requestBody = null) {
    setIsLoading(true);
    setError(null);
    const token = JSON.parse(await checkTokenExpiration());

    console.log('통신 토큰', token);
    try {
      const config = {
        method,
        url: `${import.meta.env.VITE_API_URL}${url}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        ...(requestBody && {data: requestBody}),
      };

      const response = await axios(config);
      return response.data;
    } catch (e) {
      setError(e);
      console.error('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  return {isLoading, error, AxiosApi};
}

export default useApi;

import {useState} from 'react';
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
    // const token =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIzMCIsIkF1dGhlbnRpY2F0aW9uUm9sZSI6IlVTRVIiLCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNzIzMzU2OTU4LCJleHAiOjE3MjMzNjA1NTh9.QRzF21Ekbv-acygryBPlhj41vqz3iAqe_4x7kHAyMaeOGtq7CpFMAu66D3KiGvTnH8BfwHh8pUjHn6Gg3yQrzw';
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
      console.log('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  return {isLoading, error, AxiosApi};
}

export default useApi;

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
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIzMCIsIkF1dGhlbnRpY2F0aW9uUm9sZSI6IlVTRVIiLCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNzIzNzE2MzYzLCJleHAiOjE3MjM3MTk5NjN9.mW-n1ToumyljjrsmfxNay_1ptdys0tssekZSnuaE0rrouZxNPKIiyvVwGJY4DCdCsGEzUoBbTx1yf64Um8PAMw';
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

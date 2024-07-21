import {useContext, useState} from 'react';
import axios from 'axios';
import {IP} from '@env';
import AuthContext from '../context/AuthContext';

function useApi() {
  const {checkTokenExpiration} = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function AxiosApi(method, url, requestBody = null) {
    setIsLoading(true);
    setError(null);
    try {
      const token = await checkTokenExpiration();
      console.log('Token:', token);
      const config = {
        method,
        url: `${IP}${url}`,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        ...(requestBody && {data: requestBody}),
      };

      const response = await axios(config);
      setData(response.data);
    } catch (e) {
      setError(e);
      console.error('Error fetching data:', e);
    } finally {
      setIsLoading(false);
    }
  }

  return {data, isLoading, error, AxiosApi};
}

export default useApi;

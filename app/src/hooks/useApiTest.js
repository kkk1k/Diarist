import {useState, useCallback} from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://hellorvdworld.com';
const TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIyOCIsIkF1dGhlbnRpY2F0aW9uUm9sZSI6IlVTRVIiLCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNzIxMzczNjk1LCJleHAiOjE3MjEzNzcyOTV9.fMdJ-vCblE3gclQJNE9-QM3gBVoaRciOR18Zj7rlNrARBQZFyWWBJ7MykirdzHycII5U8BgstJwHs3249qXJng';

const useApiCall = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (method, endpoint, body = null) => {
    setLoading(true);
    setError(null);

    try {
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          Accept: '*/*',
        },
      };

      if (body && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
        config.data = body;
      }

      const response = await axios(config);

      setData(response.data);
      console.log(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      console.error(`Error calling API: ${endpoint}`, err);
    } finally {
      setLoading(false);
      console.log('API call completed');
    }
  }, []);

  return {callApi, data, loading, error};
};

export default useApiCall;

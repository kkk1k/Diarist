import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import * as SecureStore from 'expo-secure-store';
import {Text} from 'react-native';
import {IP} from '@env';
import useApi from '../hooks/useApi'; // Adjust the import path as necessary

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

function KakaoLoginRedirect({navigation, route}) {
  const {code} = route.params;
  const {data, isLoading, error, AxiosApi} = useApi();

  useEffect(() => {
    const fetchData = async () => {
      if (code) {
        try {
          await AxiosApi('POST', '/oauth2/kakao/login', {code});

          if (data) {
            const accessJWTToken = JSON.stringify(data.data.accessToken);
            const refreshJWTToken = JSON.stringify(data.data.refreshToken);
            await SecureStore.setItemAsync('accessToken', accessJWTToken);
            await SecureStore.setItemAsync('refreshToken', refreshJWTToken);

            navigation.navigate('Test');
          }
        } catch (e) {
          console.error('Error during API call:', e.message, e.response);
        }
      }
    };

    fetchData();
  }, [code]);

  useEffect(() => {
    if (data) {
      (async () => {
        const accessJWTToken = JSON.stringify(data.data.accessToken);
        const refreshJWTToken = JSON.stringify(data.data.refreshToken);
        await SecureStore.setItemAsync('accessToken', accessJWTToken);
        await SecureStore.setItemAsync('refreshToken', refreshJWTToken);

        navigation.navigate('Test');
      })();
    }
  }, [data, navigation]);

  if (isLoading) {
    return (
      <StyledSafeAreaView>
        <Text>Loading...</Text>
      </StyledSafeAreaView>
    );
  }

  if (error) {
    return (
      <StyledSafeAreaView>
        <Text>Error: {error.message}</Text>
      </StyledSafeAreaView>
    );
  }

  return <StyledSafeAreaView />;
}

export default KakaoLoginRedirect;

import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import * as SecureStore from 'expo-secure-store';
import {Text, Dimensions} from 'react-native';
import {IP} from '@env';
import axios from 'axios';
import useApi from '../hooks/useApi'; // Adjust the import path as necessary

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

function KakaoLoginRedirect({navigation, route}) {
  const {code} = route.params;
  const {data, isLoading, error, AxiosApi} = useApi();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (code) {
  //       try {
  //         await AxiosApi('POST', '/oauth2/kakao/login', {code});

  //         if (data) {
  //           const accessJWTToken = JSON.stringify(data.data.accessToken);
  //           const refreshJWTToken = JSON.stringify(data.data.refreshToken);
  //           await SecureStore.setItemAsync('accessToken', accessJWTToken);
  //           await SecureStore.setItemAsync('refreshToken', refreshJWTToken);

  //           navigation.navigate('Test');
  //         }
  //       } catch (e) {
  //         console.error('Error during API call:', e.message, e.response);
  //       }
  //     }
  //   };

  //   fetchData();
  // }, [code, data, AxiosApi, navigation]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: 'POST',
          url: 'https://hellorvdworld.com/oauth2/kakao/login',
          // headers: {
          //   headers: {
          //     'Content-Type': 'application/json',
          //     Authorization: `Bearer ${token}`,
          //   },
          // },
          body: {
            code,
          },
        };
        await axios(config);
      } catch (e) {
        console.log(e);
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

        navigation.navigate('Calendar');
      })();
    }
  }, [data, navigation]);

  if (isLoading) {
    return (
      <StyledSafeAreaView>
        {/* You can add a loading spinner or message here */}
        <Text>Loading...</Text>
      </StyledSafeAreaView>
    );
  }

  if (error) {
    return (
      <StyledSafeAreaView>
        {/* You can add an error message here */}
        <Text>Error: {error.message}</Text>
      </StyledSafeAreaView>
    );
  }

  return <StyledSafeAreaView />;
}

export default KakaoLoginRedirect;

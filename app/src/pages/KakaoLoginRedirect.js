import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import * as SecureStore from 'expo-secure-store';
import {IP} from '@env';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

function KakaoLoginRedirect({navigation, route}) {
  const {code} = route.params;

  useEffect(() => {
    const fetchData = async () => {
      if (code) {
        try {
          const response = await axios({
            method: 'POST',
            url: `${IP}/oauth2/kakao/login`,
            headers: {
              'Content-Type': 'application/json',
              accept: '*/*',
            },
            data: {
              code,
            },
          });
          const {data} = response;
          if (data) {
            const accessJWTToken = JSON.stringify(data.data.accessToken);
            const refreshJWTToken = JSON.stringify(data.data.refreshToken);
            await SecureStore.setItemAsync('accessToken', accessJWTToken);
            await SecureStore.setItemAsync('refreshToken', refreshJWTToken);
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'Calendar'}],
              }),
            );
          }
        } catch (e) {
          console.error('Error during API call:', e.message, e.response?.data);
        }
      }
    };

    fetchData();
  }, [code, navigation]);

  return <StyledSafeAreaView />;
}
export default KakaoLoginRedirect;

import axios from 'axios';
import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {IP} from '@env';
import * as SecureStore from 'expo-secure-store';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const TextLoading = styled.Text`
  text-align: center;
  color: #0f0f0f;
  font-size: ${props => 100 * props.theme.widthRatio}px;
  font-family: 'Pretendard-Regular';
  font-weight: 500;
  line-height: normal;
`;

function KakaoLoginRedirect({navigation, route}) {
  const {code} = route.params;
  console.log(code);
  const fetchData = async () => {
    if (code) {
      try {
        const response = await axios.post(`${IP}/oauth2/kakao/login`, {code});
        console.log(response.data.data);
        console.log('잘가져오는지 확인:', code);
        // 암호화된 스토리지에 데이터 저장
        await SecureStore.setItemAsync('authTokens', JSON.stringify(response.data.data));

        navigation.navigate('Test');
      } catch (error) {
        console.error('Error during API call:', error.message, error.response);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [code, navigation]);

  return <StyledSafeAreaView />;
}

export default KakaoLoginRedirect;

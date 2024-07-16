import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import Splash from '../assets/splash.png';
import Google from '../assets/googleicon.png';
import Kakao from '../assets/kakaoicon.png';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const StyledText = styled.Text`
  color: #000;
  text-align: center;
  font-size: ${props => 42 * props.theme.widthRatio}px;
  font-family: 'Pretendard-Regular';
  font-weight: 500;
  line-height: normal;
  letter-spacing: ${props => -0.63 * props.theme.widthRatio}px;
`;

const LogoIcon = styled.Image`
  width: ${props => 600 * props.theme.widthRatio}px;
  height: ${props => 500 * props.theme.widthRatio}px;
`;

const KakaoIcon = styled.Image`
  width: ${props => 30 * props.theme.widthRatio}px;
  height: ${props => 27 * props.theme.widthRatio}px;
  aspect-ratio: 1.1;
  position: absolute;
  left: 10px;
`;

const GoogleIcon = styled.Image`
  width: ${props => 30 * props.theme.widthRatio}px;
  height: ${props => 30 * props.theme.widthRatio}px;
  position: absolute;
  left: 10px;
`;

const GoogleButton = styled(TouchableOpacity)`
  position: relative;
  width: ${props => 580 * props.theme.widthRatio}px;
  height: ${props => 80 * props.theme.widthRatio}px;
  border-radius: 15px;
  border: 1px solid #333;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex-direction: row;
`;

const KakaoButton = styled(TouchableOpacity)`
  width: ${props => 580 * props.theme.widthRatio}px;
  height: ${props => 80 * props.theme.widthRatio}px;
  flex-shrink: 0;
  border-radius: 15px;
  background-color: #eedb54;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ButtonText = styled(Text)`
  color: #0f0f0f;
  font-size: ${props => 24 * props.theme.widthRatio}px;
  font-family: 'Pretendard-Regular';
  font-weight: 500;
  line-height: normal;
`;

function Login({navigation}) {
  const token = {
    accessToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIyMiIsIkF1dGhlbnRpY2F0aW9uUm9sZSI6IlVTRVIiLCJ0eXBlIjoiQUNDRVNTIiwiaWF0IjoxNzIxMTI3Nzg4LCJleHAiOjE3MjExMzEzODh9.SE3QrCpHgJsrAMSd9JW6J9s_B1gtmr9SfbMDNUJ-AE_EHqBDAF7vgFCWwhhTmaJtW115iA9KiXXrGXAWoy2RsA',
    refreshToken:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiIyMiIsIkF1dGhlbnRpY2F0aW9uUm9sZSI6IlVTRVIiLCJ0eXBlIjoiUkVGUkVTSCIsImlhdCI6MTcyMTEyNzc4OCwiZXhwIjoxNzI2MzExNzg4fQ.dkIjGlya6fXeV_0nGnXRhI8LNsYwN8FUiwJY-wIxhn9Ts_hkoadaZALIqU3k9gRjHmWTQm4wZNAjp57XN6Wd-Q',
  };
  const setMethod = async () => {
    try {
      console.log('Attempting to set item...');
      const tokenString = JSON.stringify(token);
      await SecureStore.setItemAsync('token', tokenString);
      const storedTokenString = await SecureStore.getItemAsync('token');
      if (storedTokenString) {
        const storedToken = JSON.parse(storedTokenString);
        console.log('accessToken:', storedToken.accessToken);
        console.log('refreshToken:', storedToken.refreshToken);
      }
      console.log('Item set successfully');
    } catch (error) {
      console.error('Error setting item:', error);
    }
  };
  useEffect(() => {
    setMethod();
  }, []);

  return (
    <Container>
      <StyledText>나의 하루를</StyledText>
      <StyledText>피카소가 그려준다면?</StyledText>
      <LogoIcon source={Splash} />
      <KakaoButton onPress={() => navigation.navigate('KakaoWebView')}>
        <KakaoIcon source={Kakao} />
        <ButtonText>Kakao 로그인</ButtonText>
      </KakaoButton>
      <GoogleButton onPress={() => navigation.navigate('GoogleWebView')}>
        <GoogleIcon source={Google} />
        <ButtonText>Google 로그인</ButtonText>
      </GoogleButton>
    </Container>
  );
}

export default Login;

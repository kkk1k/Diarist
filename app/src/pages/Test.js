import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import * as SecureStore from 'expo-secure-store';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
`;

const TextSuccess = styled.Text`
  color: #0f0f0f;
  font-size: ${props => 36 * props.theme.widthRatio}px;
  font-family: 'Pretendard-Regular';
  font-weight: 500;
  line-height: normal;
`;

export default function Test() {
  console.log(Date.now());

  const getData = async () => {
    try {
      const accessToken = JSON.parse(await SecureStore.getItem('accessToken'));
      const refreshToken = JSON.parse(await SecureStore.getItem('refreshToken'));

      console.log(token);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Container>
      <TextSuccess>로그인 성공</TextSuccess>
    </Container>
  );
}

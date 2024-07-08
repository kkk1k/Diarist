import axios from 'axios';
import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {IP} from '@env';

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

  useEffect(() => {
    const fetchData = async () => {
      if (code) {
        try {
          const response = await axios.post(`${IP}/oauth2/kakao/login`, {code});
          console.log(response.data.data);
          console.log('잘가져오는지 확인:', code);
          navigation.navigate('Test');
        } catch (error) {
          console.error('Error during API call:', error);
        }
      }
    };

    fetchData();
  }, [code, navigation]);

  return <StyledSafeAreaView />;
}

export default KakaoLoginRedirect;

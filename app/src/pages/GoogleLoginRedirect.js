import axios from 'axios';
import React, {useEffect} from 'react';
import styled from 'styled-components/native';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

function GoogleLoginRedirect({navigation, route}) {
  const {code} = route.params;
  console.log(code);

  const fetchData = async () => {
    if (code) {
      try {
        const response = await axios.post(`${IP}/oauth2/google/login`, {code});
        console.log(response.data.data);
        console.log('잘가져오는지 확인:', code);
        // 암호화된 스토리지에 데이터 저장
        // await encryptStorage.setItem('authTokens', data);
      } catch (error) {
        console.error('Error during API call:', error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, [code, navigation]);

  return <StyledSafeAreaView />;
}

export default GoogleLoginRedirect;

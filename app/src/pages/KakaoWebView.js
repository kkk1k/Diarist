import React from 'react';
import styled from 'styled-components/native';
import WebView from 'react-native-webview';
import {KAKAO_API, IP} from '@env';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

function KakaoWebView({navigation}) {
  const handleShouldStartLoadWithRequest = event => {
    if (event.url.startsWith(`${IP}/oauth2/kakao/login?code=`)) {
      const code = event.url.split('code=')[1]?.split('&')[0];
      console.log('asd', code);
      if (code) {
        navigation.navigate(
          'KakaoLoginRedirect',
          {code},
          {
            animation: 'none',
          },
        );
        return false; // 페이지 로딩을 중단
      }
    }
    return true; // 다른 URL은 정상적으로 로드
  };

  return (
    <StyledSafeAreaView>
      <StyledWebView
        source={{
          uri: KAKAO_API,
          method: 'GET',
          headers: {
            'Accept-Language': 'ko-KR,ko',
          },
        }}
        originWhitelist={['*']}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </StyledSafeAreaView>
  );
}

export default KakaoWebView;

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

      if (code) {
        navigation.navigate(
          'KakaoLoginRedirect',
          {code},
          {
            animation: 'none',
          },
        );
        return false;
      }
    }
    return true;
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
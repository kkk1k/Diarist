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
        return false; // 페이지 로딩을 중단
      }
    }
    return true; // 다른 URL은 정상적으로 로드
  };

  return (
    <StyledSafeAreaView>
      <StyledWebView
<<<<<<< HEAD
        source={{uri: KAKAO_API}}
        originWhitelist={['*']}
        onNavigationStateChange={navState => {
<<<<<<< HEAD
          if (navState.url.includes('/oauth2/kakao/login')) {
=======
          if (navState.url.includes(`${IP}/oauth2/kakao/login`)) {
>>>>>>> bf47c0b (chore : PROJ-28 : env파일 변경에 맞게 코드 변경)
            // 여기서 필요한 처리를 수행합니다.
            const code = navState.url.split('code=')[1];
            console.log('Authorization code:', code);
            // 이 코드를 서버로 보내거나 다른 처리를 수행합니다.
          }
=======
        source={{
          uri: KAKAO_API,
          method: 'GET',
          headers: {
            'Accept-Language': 'ko-KR,ko',
          },
>>>>>>> 1488252 (feat : PROJ-142 : 인증코드 통해 토큰 발급후 페이지 이동)
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

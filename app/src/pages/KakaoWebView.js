import React from 'react';
import styled from 'styled-components/native';
import WebView from 'react-native-webview';
<<<<<<< HEAD
import {KAKAO_API, IP} from '@env';
=======
import {KAKAO_API} from '@env';
>>>>>>> 5d711a7 (feat : PROJ-142 : 카카오 로그인 버튼 클릭시 로그인 페이지로 리다이렉트)

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;
<<<<<<< HEAD

<<<<<<< HEAD
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
=======
=======
>>>>>>> 61292a9 (feat : PROJ-28 : 웹뷰 리다이렉트 허용)
function KakaoWebView() {
  console.log(KAKAO_API);
  return (
    <StyledSafeAreaView>
      <StyledWebView
        source={{uri: KAKAO_API}}
<<<<<<< HEAD
>>>>>>> 5d711a7 (feat : PROJ-142 : 카카오 로그인 버튼 클릭시 로그인 페이지로 리다이렉트)
=======
        originWhitelist={['*']}
        onNavigationStateChange={navState => {
          if (navState.url.includes('http://192.168.35.11:8080/oauth2/kakao/login')) {
            // 여기서 필요한 처리를 수행합니다.
            const code = navState.url.split('code=')[1];
            console.log('Authorization code:', code);
            // 이 코드를 서버로 보내거나 다른 처리를 수행합니다.
          }
        }}
>>>>>>> 61292a9 (feat : PROJ-28 : 웹뷰 리다이렉트 허용)
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </StyledSafeAreaView>
  );
}

export default KakaoWebView;

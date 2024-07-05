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
function KakaoWebView() {
  console.log(KAKAO_API);
  return (
    <StyledSafeAreaView>
      <StyledWebView
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
        }}
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </StyledSafeAreaView>
  );
}

export default KakaoWebView;

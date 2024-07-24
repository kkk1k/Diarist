import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import WebView from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import {LOCAL_IP} from '@env';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

function WriteDiaryWebView({navigation}) {
  const webviewRef = useRef(null);

  useEffect(() => {
    const injectTokens = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        const refreshToken = await SecureStore.getItemAsync('refreshToken');

        if (accessToken && refreshToken) {
          const script = `
            window.postMessage(JSON.stringify({
              type: 'tokens',
              accessToken: ${accessToken},
              refreshToken: ${refreshToken}
            }), '*');
            true;
          `;
          if (webviewRef.current) {
            webviewRef.current.injectJavaScript(script);
          }
        } else {
          console.log('Tokens not found in SecureStore');
        }
      } catch (error) {
        console.error('Failed to retrieve tokens from SecureStore:', error);
      }
    };

    // 웹뷰가 로드된 후 토큰을 주입하기 위해 약간의 지연을 줍니다.
    setTimeout(injectTokens, 500);
  }, []);

  const onMessage = e => {
    const message = e.nativeEvent.data;
    console.log('Received message from WebView:', message);
    if (message === 'closeWebView') {
      navigation.goBack();
    } else if (message === 'check') {
      navigation.navigate('Calendar');
    }
  };

  const injectedJavaScript = `
    (function() {
      var originalLog = console.log;
      console.log = function() {
        originalLog.apply(console, arguments);
        window.ReactNativeWebView.postMessage('CONSOLE: ' + Array.from(arguments).join(' '));
      };
    })();
    true;
  `;
  return (
    <StyledSafeAreaView>
      <StyledWebView
        ref={webviewRef}
        source={{uri: `http://${LOCAL_IP}:5173/emotion`}}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled
      />
    </StyledSafeAreaView>
  );
}

export default WriteDiaryWebView;

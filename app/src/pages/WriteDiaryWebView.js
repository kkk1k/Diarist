import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import WebView from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import {CommonActions} from '@react-navigation/native';
import {LOCAL_IP} from '@env';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

function WriteDiaryWebView({navigation, route}) {
  const {selectedDate} = route.params || {};
  console.log(selectedDate);
  const webviewRef = useRef(null);

  const injectTokens = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');

      if (accessToken && refreshToken) {
        const script = `
          window.postMessage(JSON.stringify({
            type: 'tokens',
            accessToken: '${accessToken}',
            refreshToken: '${refreshToken}',
            selectedDate: '${selectedDate}',
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

  useEffect(() => {
    injectTokens();
  }, [selectedDate]);

  const onMessage = e => {
    const message = e.nativeEvent.data;
    console.log(message);
    if (message === 'closeWebView') {
      navigation.goBack();
    } else if (message === 'check') {
      navigation.navigate('Calendar', {reload: true});
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
        onLoad={injectTokens}
        injectedJavaScript={injectedJavaScript}
        javaScriptEnabled
        onError={syntheticEvent => {
          const {nativeEvent} = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />
    </StyledSafeAreaView>
  );
}

export default WriteDiaryWebView;

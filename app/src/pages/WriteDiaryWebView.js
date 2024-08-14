import {LOCAL_IP} from '@env';
import * as SecureStore from 'expo-secure-store';
import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import styled from 'styled-components/native';
import {useFocusEffect} from '@react-navigation/native';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

function WriteDiaryWebView({navigation, route}) {
  const {selectedDate} = route.params || {};
  const webviewRef = useRef(null);
  console.log(selectedDate);
  const [webViewKey, setWebViewKey] = useState(0);

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

  useFocusEffect(
    React.useCallback(() => {
      setWebViewKey(prevKey => prevKey + 1);
    }, []),
  );

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

  const onLoadEnd = () => {
    const resetScript = `
      if (typeof resetDiaryContent === 'function') {
        resetDiaryContent();
      }
      true;
    `;
    webviewRef.current.injectJavaScript(resetScript);
    injectTokens();
  };

  return (
    <StyledSafeAreaView>
      <StyledWebView
        key={webViewKey}
        ref={webviewRef}
        source={{uri: `http://${LOCAL_IP}:5173/emotion`}}
        onMessage={onMessage}
        onLoadEnd={onLoadEnd}
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

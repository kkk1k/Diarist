import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import WebView from 'react-native-webview';
import * as SecureStore from 'expo-secure-store';
import {LOCAL_IP} from '@env';
import * as Linking from 'expo-linking'; // 이 줄을 수정합니다.
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

function DetailDiaryWebView({navigation, route}) {
  const webviewRef = useRef(null);
  const {id} = route.params;

  const injectTokens = async () => {
    const accessToken = await SecureStore.getItemAsync('accessToken');
    const refreshToken = await SecureStore.getItemAsync('refreshToken');

    if (accessToken && refreshToken) {
      const script = `
        window.postMessage(JSON.stringify({
          type: 'tokens',
          accessToken: '${accessToken}',
          refreshToken: '${refreshToken}'
        }), '*');
        console.log('Tokens injected');
        true;
      `;
      webviewRef.current?.injectJavaScript(script);
    } else {
      console.log('Tokens not found in SecureStore');
    }
  };

  const onMessage = async e => {
    const message = e.nativeEvent.data;
    console.log('Received message from WebView:', message);

    if (message.startsWith('CONSOLE:')) {
      console.log('WebView console:', message.slice(8));
    } else if (message === 'closeWebView') {
      navigation.pop();
    } else if (message === 'check') {
      navigation.navigate('Calendar', {reload: true});
    } else {
      try {
        const data = JSON.parse(message);

        if (data.type === 'capturedImage') {
          const base64Image = data.data.replace('data:image/png;base64,', '');
          const fileUri = `${FileSystem.documentDirectory}shared_image.jpg`;

          await FileSystem.writeAsStringAsync(fileUri, base64Image, {
            encoding: FileSystem.EncodingType.Base64,
          });

          try {
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(fileUri, {
                mimeType: 'image/png',
                dialogTitle: '공유하기',
                UTI: 'public.png',
              });
            } else {
              console.log("Sharing isn't available on your platform");
            }
          } catch (error) {
            console.log('Error sharing image:', error);
          }
        }
      } catch (error) {
        console.error('Failed to parse message:', message, error);
      }
    }
  };
  const injectedJavaScript = `
    (function() {
      var originalLog = console.log;
      console.log = function() {
        originalLog.apply(console, arguments);
        window.ReactNativeWebView.postMessage('CONSOLE: ' + Array.from(arguments).join(' '));
      };
      window.addEventListener('message', function(event) {
        console.log('Received message in WebView:', event.data);
      });
    })();
    true;
  `;

  const handleShouldStartLoadWithRequest = event => {
    if (event.url.includes('kakaolink')) {
      Linking.openURL(event.url);
      return false;
    }
    return true;
  };

  return (
    <StyledSafeAreaView>
      <StyledWebView
        ref={webviewRef}
        source={{
          uri: `http://${LOCAL_IP}:5173/detail/${id}`,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }}
        onLoad={injectTokens}
        onMessage={onMessage}
        injectedJavaScript={injectedJavaScript}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
        originWhitelist={['http://*', 'https://*', 'intent://*', 'kakaolink://*']}
        javaScriptEnabled
      />
    </StyledSafeAreaView>
  );
}
export default DetailDiaryWebView;

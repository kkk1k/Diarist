import React from 'react';
import styled from 'styled-components/native';
import WebView from 'react-native-webview';
import {LOCAL_IP} from '@env';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

const StyledWebView = styled(WebView)`
  flex: 1;
`;

function WriteDiaryWebView({navigation}) {
  const onMessage = e => {
    if (e.nativeEvent.data === 'closeWebView') {
      navigation.goBack();
    }
    if (e.nativeEvent.data === 'check') {
      navigation.navigate('Calendar');
    }
  };
  return (
    <StyledSafeAreaView>
      <StyledWebView source={{uri: `http://${LOCAL_IP}:5173/emotion`}} onMessage={onMessage} />
    </StyledSafeAreaView>
  );
}

export default WriteDiaryWebView;

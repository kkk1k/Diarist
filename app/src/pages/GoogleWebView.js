import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {GOOGLE_API, IP} from '@env';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;

WebBrowser.maybeCompleteAuthSession();

function GoogleWebView({navigation}) {
  const getQueryParam = (url, param) => {
    const searchParams = new URLSearchParams(url.split('?')[1]);
    return searchParams.get(param);
  };

  const handleRedirect = url => {
    if (url.startsWith(`${IP}/oauth2/google/login`)) {
      const code = getQueryParam(url, 'code');
      console.log(code);
      if (code) {
        navigation.navigate(
          'GoogleLoginRedirect',
          {code},
          {
            animation: 'none',
          },
        );
      }
    }
  };
  const openGoogleAuth = async () => {
    await WebBrowser.coolDownAsync();
    try {
      const result = await WebBrowser.openAuthSessionAsync(GOOGLE_API, `${IP}/oauth2/google/login`);
      console.log(result);
      if (result.type === 'success') {
        handleRedirect(result.url);
      }
      if (result.type === 'cancel') {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    openGoogleAuth();
  }, []);

  return <StyledSafeAreaView />;
}

export default GoogleWebView;

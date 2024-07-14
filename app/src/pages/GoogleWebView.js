import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {WEB_ID, APP_ID, IP, SECRET} from '@env';
import axios from 'axios';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;
WebBrowser.maybeCompleteAuthSession();

function GoogleWebView({navigation}) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_ID,
    androidClientId: APP_ID,
    responseType: 'code',
    usePKCE: false,
    clientSecret: SECRET,
  });

  const sendAuthCodeToServer = async code => {
    try {
      const googleResponse = await axios.post(
        `${IP}/oauth2/google/login`,
        {code},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('Server response:', googleResponse.data);
      navigation.navigate('Test');
    } catch (error) {
      console.error(
        'Error sending auth code to server:',
        error.response ? error.response.data : error.message,
      );
    }
  };

  useEffect(() => {
    if (response?.type === 'success') {
      const {code} = response.params;
      console.log(response);
      console.log(response.url);
      console.log('Authorization Code:', code);
      sendAuthCodeToServer(code);
    }
  }, [response]);

  useEffect(() => {
    if (request) {
      promptAsync();
    }
  }, [request, promptAsync]);

  return <StyledSafeAreaView />;
}

export default GoogleWebView;

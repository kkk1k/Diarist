import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {WEB_ID, ANDROID_ID, IOS_ID, IP, SECRET} from '@env';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
  background-color: #ffffff;
`;
WebBrowser.maybeCompleteAuthSession();

function GoogleWebView({navigation}) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: WEB_ID,
    androidClientId: ANDROID_ID,
    iosClientId: IOS_ID,
    usePKCE: false,
    clientSecret: SECRET,
    accessType: 'offline',
    responseType: 'code',
    prompt: 'consent',
    scopes: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
    extraParams: {
      access_type: 'offline',
      include_granted_scopes: 'true',
    },
  });
  const sendAuthCodeToServer = async (
    accessToken,
    expiresIn,
    refreshToken,
    scope,
    idToken,
    tokenType,
  ) => {
    const expiresInString = expiresIn.toString();
    try {
      const serverResponse = await axios.post(
        `${IP}/oauth2/google/login`,
        {
          access_token: accessToken,
          expires_in: expiresInString,
          refresh_token: refreshToken,
          scope,
          id_token: idToken,
          token_type: tokenType,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const token = JSON.stringify(serverResponse.data.data);
      await SecureStore.setItemAsync('token', token);
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
      const {accessToken} = response.authentication;
      const {expiresIn} = response.authentication;
      const {refreshToken} = response.authentication;
      const {scope} = response.authentication;
      const {tokenType} = response.authentication;
      const {idToken} = response.authentication;
      console.log(response);

      sendAuthCodeToServer(accessToken, expiresIn, refreshToken, scope, idToken, tokenType);
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

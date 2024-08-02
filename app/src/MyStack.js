import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './pages/Login';
import KakaoWebView from './pages/KakaoWebView';
import KakaoLoginRedirect from './pages/KakaoLoginRedirect';
import GoogleWebView from './pages/GoogleWebView';
import GoogleRedirect from './pages/GoogleRedirect';
import DetailDiaryWebView from './pages/DetailDiaryWebView';
import MyTab from './MyTab';
import AlbumWebView from './pages/AlbumWebView';
import ArtistWebView from './pages/ArtistWebView';

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='KakaoWebView' component={KakaoWebView} />
      <Stack.Screen
        name='KakaoLoginRedirect'
        component={KakaoLoginRedirect}
        options={{animation: 'none'}}
      />
      <Stack.Screen name='GoogleWebView' component={GoogleWebView} options={{animation: 'none'}} />
      <Stack.Screen name='GoogleRedirect' component={GoogleRedirect} />
      <Stack.Screen name='DetailDiaryWebView' component={DetailDiaryWebView} />
      <Stack.Screen name='AlbumWebView' component={AlbumWebView} />
      <Stack.Screen name='ArtistWebView' component={ArtistWebView} />
      <Stack.Screen name='MainTabs' component={MyTab} />
    </Stack.Navigator>
  );
}

export default MyStack;

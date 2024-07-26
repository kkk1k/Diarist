import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './pages/Login';
import KakaoWebView from './pages/KakaoWebView';
import KakaoLoginRedirect from './pages/KakaoLoginRedirect';
import GoogleWebView from './pages/GoogleWebView';
import Calendars from './pages/Calendar';
import GoogleRedirect from './pages/GoogleRedirect';
import WriteDiaryWebView from './pages/WriteDiaryWebView';
import DetailDiaryWebView from './pages/DetailDiaryWebView';

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
      <Stack.Screen name='Calendar' component={Calendars} />
      <Stack.Screen name='GoogleRedirect' component={GoogleRedirect} />
      <Stack.Screen name='WriteDiaryWebView' component={WriteDiaryWebView} />
      <Stack.Screen name='DetailDiaryWebView' component={DetailDiaryWebView} />
    </Stack.Navigator>
  );
}

export default MyStack;

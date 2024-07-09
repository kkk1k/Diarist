import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './pages/Login';
import KakaoWebView from './pages/KakaoWebView';
import Test from './pages/Test';
import KakaoLoginRedirect from './pages/KakaoLoginRedirect';
import GoogleWebView from './pages/GoogleWebView';
import GoogleLoginRedirect from './pages/GoogleLoginRedirect';

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
      <Stack.Screen name='Test' component={Test} options={{animation: 'none'}} />
      <Stack.Screen
        name='KakaoLoginRedirect'
        component={KakaoLoginRedirect}
        options={{animation: 'none'}}
      />
      <Stack.Screen name='GoogleWebView' component={GoogleWebView} />
      <Stack.Screen name='GoogleLoginRedirect' component={GoogleLoginRedirect} />
    </Stack.Navigator>
  );
}

export default MyStack;

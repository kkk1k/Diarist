import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './pages/Login';
<<<<<<< HEAD
=======
import KakaoWebView from './pages/KakaoWebView';
import Test from './pages/Test';
import KakaoLoginRedirect from './pages/KakaoLoginRedirect';
>>>>>>> 1488252 (feat : PROJ-142 : 인증코드 통해 토큰 발급후 페이지 이동)

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Login' component={Login} />
<<<<<<< HEAD
=======
      <Stack.Screen name='KakaoWebView' component={KakaoWebView} />
      <Stack.Screen name='Test' component={Test} options={{animation: 'none'}} />
      <Stack.Screen
        name='KakaoLoginRedirect'
        component={KakaoLoginRedirect}
        options={{animation: 'none'}}
      />
>>>>>>> 1488252 (feat : PROJ-142 : 인증코드 통해 토큰 발급후 페이지 이동)
    </Stack.Navigator>
  );
}

export default MyStack;

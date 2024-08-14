import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Alert() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    // 컴포넌트가 마운트될 때 알림 예약
    schedulePushNotification();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>알림이 17시에 예약되었습니다.</Text>
    </View>
  );
}

async function schedulePushNotification() {
  // 기존의 모든 예약된 알림을 취소
  await Notifications.cancelAllScheduledNotificationsAsync();

  // 새로운 알림 예약
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "17시 알림입니다!",
      body: '이것은 17시에 전송되는 알림입니다.',
      data: { data: 'goes here' },
    },
    trigger: {
      hour: 17,
      minute: 0,
      repeats: true
    },
  });

  console.log('17시 알림이 예약되었습니다.');
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants.expoConfig.extra.eas.projectId })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import WriteDiaryWebView from './pages/WriteDiaryWebView';
import Calendars from './pages/Calendar';
import AlbumWebView from './pages/AlbumWebView';
import ArtistWebView from './pages/ArtistWebView';

// 오늘 날짜 구하기 (yyyy-mm-dd)

const Tab = createBottomTabNavigator();

function MyTab() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayDate = `${year}-${month}-${day}`;
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name='Calendar'
        component={Calendars}
        options={{
          tabBarLabel: '캘린더',
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={
                focused
                  ? require('./assets/calendarIcon.png')
                  : require('./assets/calendarIcon.png')
              }
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name='artist'
        component={ArtistWebView}
        options={{
          tabBarLabel: '화가보기',
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={
                focused ? require('./assets/artistIcon.png') : require('./assets/artistIcon.png')
              }
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name='WriteDiaryWebView'
        options={{
          tabBarLabel: '일기쓰기',
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={
                focused ? require('./assets/writeIcon.png') : require('./assets/writeIcon.png')
              }
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      >
        {({navigation}) => (
          <WriteDiaryWebView navigation={navigation} route={{params: {selectedDate: todayDate}}} />
        )}
      </Tab.Screen>
      <Tab.Screen
        name='Album'
        component={AlbumWebView}
        options={{
          tabBarLabel: '앨범',
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={
                focused ? require('./assets/albumIcon.png') : require('./assets/albumIcon.png')
              }
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Mypage'
        component={Calendars}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({focused, color, size}) => (
            <Image
              source={
                focused ? require('./assets/myPageIcon.png') : require('./assets/myPageIcon.png')
              }
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default MyTab;

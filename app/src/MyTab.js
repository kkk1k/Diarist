import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import WriteDiaryWebView from './pages/WriteDiaryWebView';
import Calendars from './pages/Calendar';
import AlbumWebView from './pages/AlbumWebView';
import ArtistWebView from './pages/ArtistWebView';

const Tab = createBottomTabNavigator();

function MyTab() {
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
        component={WriteDiaryWebView}
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
      />
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

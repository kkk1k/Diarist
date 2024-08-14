import React, {useState, useCallback, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import WriteDiaryWebView from './pages/WriteDiaryWebView';
import Calendars from './pages/Calendar';
import AlbumWebView from './pages/AlbumWebView';
import ArtistWebView from './pages/ArtistWebView';
import Alert from './pages/Alert';

const Tab = createBottomTabNavigator();

function MyTab() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const handleDateSelect = useCallback(date => {
    setSelectedDate(date);
  }, []);

  const resetToToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    console.log('Selected date changed:', selectedDate);
  }, [selectedDate]);

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
        options={{
          tabBarLabel: '캘린더',
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('./assets/calendarIcon.png')}
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      >
        {props => <Calendars {...props} onSelectDate={handleDateSelect} />}
      </Tab.Screen>
      <Tab.Screen
        name='artist'
        component={ArtistWebView}
        options={{
          tabBarLabel: '화가보기',
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('./assets/artistIcon.png')}
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name='WriteDiaryWebView'
        options={{
          tabBarLabel: '일기쓰기',
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('./assets/writeIcon.png')}
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      >
        {({navigation}) => {
          useFocusEffect(
            useCallback(() => {
              resetToToday();
            }, [resetToToday])
          );

          return (
            <WriteDiaryWebView
              navigation={navigation}
              route={{
                params: {
                  selectedDate: selectedDate,
                },
              }}
            />
          );
        }}
      </Tab.Screen>
      <Tab.Screen
        name='Album'
        component={AlbumWebView}
        options={{
          tabBarLabel: '앨범',
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('./assets/albumIcon.png')}
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
      <Tab.Screen
        name='Mypage'
        component={Alert}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({color, size}) => (
            <Image
              source={require('./assets/myPageIcon.png')}
              style={{width: size, height: size, tintColor: color}}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTab;
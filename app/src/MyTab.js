import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import WriteDiaryWebView from './pages/WriteDiaryWebView';
import Calendars from './pages/Calendar';

const Tab = createBottomTabNavigator();

function MyTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Calendar' component={Calendars} />
      <Tab.Screen name='WriteDiaryWebView' component={WriteDiaryWebView} />
    </Tab.Navigator>
  );
}
export default MyTab;

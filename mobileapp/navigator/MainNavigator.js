import React from 'react';
import { createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation';
import Main from '../screens/main/Main';
import AboutScreen from '../screens/AboutScreen';
import ReportScreen from '../screens/ReportScreen';

const MainNavigator = createStackNavigator( 
  {
    Home: Main,
    Reports : ReportScreen,
    About: AboutScreen,
  }
);

export default createAppContainer(MainNavigator);
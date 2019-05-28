import React from 'react';
import { createAppContainer, createStackNavigator, createDrawerNavigator } from 'react-navigation';
import Main from '../screens/main/Main';
import AboutScreen from '../screens/AboutScreen';
import ReportScreen from '../screens/ReportScreen';
import ProfileScreen from '../screens/ProfileScreen'

const MainNavigator = createDrawerNavigator( 
  {
    Home: Main,
    //Relatórios : ReportScreen,
    Perfil: ProfileScreen,
    Sobre: AboutScreen,
  }
);

export default createAppContainer(MainNavigator);
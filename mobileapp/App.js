import React, { Component } from 'react';

import { KeyboardAvoidingView, StyleSheet, ImageBackground } from 'react-native';

import Login from './screens/login/Login';
import SignUp from './screens/register/SignUp';
import Main from './navigator/MainNavigator';
import { w } from './api/Dimensions';

export default class CrachaInteligente extends Component {
  state = {
    currentScreen: 'login', // can be: 'login' or 'register'. TODO: improve this!
  };

  changeScreen = screenName => () => {
    this.setState({ currentScreen: screenName });
  };

  userSuccessfullyLoggedIn = (user) => {
    this.props.login(user);
  };

  render() {
    let screenToShow;

    switch (this.state.currentScreen) {
      case 'login':
        screenToShow = <Login change={this.changeScreen} success={this.userSuccessfullyLoggedIn} />;
        break;
      case 'main':
        screenToShow = <Main change={this.changeScreen} />;
        break;
      case 'register':
        screenToShow = <SignUp change={this.changeScreen} />;
        break;
      default:
        screenToShow = <Main change={this.changeScreen} />;

    }

    return (
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={-w(40)}
        style={styles.container}
      >
        <ImageBackground
          source={this.props.background}
          style={styles.background}
          resizeMode="stretch"
        >
          {screenToShow}
        </ImageBackground>
      </KeyboardAvoidingView>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fffffe',
  },
  background: {
    width: '100%',
    height: '100%',
  }
});

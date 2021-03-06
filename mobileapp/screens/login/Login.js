import React, { Component } from 'react'

import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import InputField from '../../components/InputField';
import {w, h, totalSize} from '../../api/Dimensions';
import GetStarted from './GetStarted';
import MyFirebase from '../../api/MyFirebase';
import { LinearGradient } from 'expo';

const companyLogo = require('../../assets/logo.png');
const email = require('../../assets/email.png');
const password = require('../../assets/password.png');

export default class Login extends Component {
  
  state = { 
    isEmailCorrect: false,
    isPasswordCorrect: false,
    isLogin: false,
  };

  getStarted = () => {
    const email = this.email.getInputValue(); 
    const password = this.password.getInputValue();

    this.setState({
      isEmailCorrect: email === '',
      isPasswordCorrect: password === ''
    }, () => {
      if(email !== '' && password !== ''){
        this.loginToFirebase(email, password);
      }else{
        ToastAndroid.showWithGravityAndOffset(
          'Preencha todos os campos',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    });
  };

  changeInputFocus = name => () => {
    if (name === 'Email'){
      this.setState({ isEmailCorrect: this.email.getInputValue() === ''});
      this.password.input.focus();
    }else{
      this.setState({ isPasswordCorrect: this.password.getInputValue() === ''});
    }
  };

  loginToFirebase = (email, password) => {
    this.setState({ isLogin: true });
    MyFirebase.userLogin(email, password)
      .then(user => {
        this.setState({ isLogin: false });

        // indo para a main screen
        this.props.change('main', user)();

      }).catch( err => {
        
        console.log("Não foi possivel fazer login: ", err);

        ToastAndroid.showWithGravityAndOffset(
          'Não foi possível fazer o login',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      });
  };
  
  render() { 
    return ( 
      <View style={styles.container}>
        
        <LinearGradient
          colors={['#192f6a', '#3b5998', '#4c669f']}
          style={{ width: "100%", alignItems: "center", marginBottom: h(3)}}>
          <Image style={styles.icon} resizeMode="contain" source={companyLogo}/>
        </LinearGradient>
        
        <InputField
          placeholder="Email"
          keyboardType="email-address"
          style={styles.email}
          error={this.state.isEmailCorrect}
          focus={this.changeInputFocus}
          ref={ref => this.email = ref}
          icon={email}
        />
        <InputField
          placeholder="Password"
          returnKeyType="done"
          style={styles.email}
          secureTextEntry={true}
          blurOnSubmit={true}
          error={this.state.isPasswordCorrect}
          ref={ref => this.password = ref}
          focus={this.changeInputFocus}
          icon={password}
        />
        <GetStarted
          //click={this.props.change('main')}
          click={this.getStarted}
                  
          isLogin={this.state.isLogin}
        />
        
        <TouchableOpacity style={styles.touchable} activeOpacity={0.6}>
          <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <Text style={styles.createAccountText}>Não tem uma conta ainda? </Text>

          <TouchableOpacity onPress={this.props.change('register')} style={styles.touchable} activeOpacity={0.6}>
            <Text style={styles.createAccount}>Crie uma conta.</Text>
          </TouchableOpacity>
        </View>
          
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    width: w(70),
    height: h(30),
    marginTop: h(10),
    marginBottom: h(7),
  },
  textContainer: {
    width: w(100),
    flexDirection: 'row',
    marginTop: h(5),
  },
  email: {
    marginVertical: h(1.4),
    backgroundColor: '#e3e3e3',
  },
  touchable: {
    flex: 1,
  }, 
  createAccount: {
    color:'#847e7d',
    textAlign: 'center',
    fontSize: totalSize(2),
    fontWeight: '600',
    marginBottom: 15,
  },
  createAccountText: {
    color:'#847e7d',
    textAlign: 'center',
    fontSize: totalSize(2),
    marginLeft: w(3), 
  },
  forgotPassword: {
    color:'#847e7d',
    textAlign: 'center',
    fontSize: totalSize(2),
    fontWeight: '600',
    margin: 10, 
  },
});
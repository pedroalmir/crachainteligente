import React, { Component } from 'react'

import PropTypes from 'prop-types';
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { w, h, totalSize } from '../../api/Dimensions';
import InputField from '../../components/InputField';
import Continue from './Continue';
import MyFirebase from "../../api/MyFirebase";
import { LinearGradient } from 'expo';
import { ScrollView } from 'react-native-gesture-handler';

const email = require('../../assets/email.png');
const password = require('../../assets/password.png');
const repeat = require('../../assets/repeat.png');
const person = require('../../assets/person.png');
const companyLogo = require('../../assets/logo.png');

export default class SignUp extends Component {

  state = {
    isNameCorrect: false,
    isEmailCorrect: false,
    isPasswordCorrect: false,
    isRepeatCorrect: false,
    isCreatingAccount: false,
  };

  createUserAccount = () => {
    const name = this.name.getInputValue();
    const email = this.email.getInputValue();
    const password = this.password.getInputValue();
    const repeat = this.repeat.getInputValue();

    this.setState({
      isNameCorrect: name === '',
      isEmailCorrect: email === '',
      isPasswordCorrect: password === '',
      isRepeatCorrect: repeat === '' || repeat !== password,
    }, () => {
      if (name !== '' && email !== '' && password !== '' && (repeat !== '' && repeat === password)) {
        // tudo ok, pode criar
        MyFirebase.createFirebaseAccount(name, email, password)

        //this.createFireBaseAccount(name, email, password);
        // na main, ele deve redirecionar para o Perfil, onde as informações serão atualizadas
      } else {

        ToastAndroid.showWithGravityAndOffset('Preencha todos os campos', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      }
    })
  };

  createFireBaseAccount = (name, email, password) => {
    this.setState({ isCreatingAccount: true });
    MyFirebase.createFirebaseAccount(name, email, password)
      .then(result => {
        //if(result) this.props.change('login')();

        if (result) {
          this.setState({ isCreatingAccount: false });
          this.props.change('login')();
          //Alert.alert('Info', 'Cadastro realizado com sucesso!');
          ToastAndroid.showWithGravityAndOffset('Cadastro realizado com sucesso!', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        } else {
          ToastAndroid.showWithGravityAndOffset('Não foi possível realizar o cadastro', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
      }).catch(err => {
        console.log(err);
      });
  };

  changeInputFocus = name => () => {
    switch (name) {
      case 'Name':
        this.setState({ isNameCorrect: this.name.getInputValue() === '' });
        this.email.input.focus();
        break;
      case 'Email':
        this.setState({ isEmailCorrect: this.email.getInputValue() === '' });
        this.password.input.focus();
        break;
      case 'Password':
        this.setState({
          isPasswordCorrect: this.password.getInputValue() === '',
          isRepeatCorrect: (this.repeat.getInputValue() !== ''
            && this.repeat.getInputValue() !== this.password.getInputValue())
        });
        this.repeat.input.focus();
        break;
      default:
        this.setState({
          isRepeatCorrect: (this.repeat.getInputValue() === ''
            || this.repeat.getInputValue() !== this.password.getInputValue())
        });
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container} style={{ padding: 0, flex: 1, width: w(100), height: h(100) }}>
        <LinearGradient
          colors={['#192f6a', '#3b5998', '#4c669f']}
          style={{ width: "100%", alignItems: "center", marginBottom: h(3) }}>
          <Image style={styles.icon} resizeMode="contain" source={companyLogo} />
          <Text style={styles.create}>Cadastrar Nova Conta</Text>
        </LinearGradient>

        <InputField
          placeholder="Name"
          autoCapitalize="words"
          error={this.state.isNameCorrect}
          style={styles.input}
          focus={this.changeInputFocus}
          ref={ref => this.name = ref}
          icon={person}
        />
        <InputField
          placeholder="Email"
          keyboardType="email-address"
          error={this.state.isEmailCorrect}
          style={styles.input}
          focus={this.changeInputFocus}
          ref={ref => this.email = ref}
          icon={email}
        />
        <InputField
          placeholder="Password"
          error={this.state.isPasswordCorrect}
          style={styles.input}
          focus={this.changeInputFocus}
          ref={ref => this.password = ref}
          secureTextEntry={true}
          icon={password}
        />
        <InputField
          placeholder="Repeat Password"
          error={this.state.isRepeatCorrect}
          style={styles.input}
          secureTextEntry={true}
          returnKeyType="done"
          blurOnSubmit={true}
          focus={this.changeInputFocus}
          ref={ref => this.repeat = ref}
          icon={repeat}
        />
        <Continue isCreating={this.state.isCreatingAccount} click={this.createUserAccount} />
        <TouchableOpacity onPress={this.props.change('login')} style={styles.touchable}>
          <Text style={styles.signIn}>{'<'} Fazer Login</Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

SignUp.propTypes = {
  change: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: w(70),
    height: h(30),
    marginTop: h(10),
  },
  create: {
    color: '#ffffee',
    fontSize: totalSize(2.4),
    marginBottom: h(5),
    fontWeight: '700',
  },
  signIn: {
    color: '#5f5f5f',
    fontSize: totalSize(2),
    fontWeight: '700',
    marginBottom: h(7)
  },
  touchable: {
    alignSelf: 'flex-start',
    marginLeft: w(8),
    marginTop: h(4),
  },
  input: {
    marginVertical: h(1.4),
    backgroundColor: '#e3e3e3',
    width: w(80),
  }
});
import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {w, h, totalSize} from '../../api/Dimensions';

export default class GetStarted extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.click}
        style={styles.button}
        activeOpacity={0.6}
      >
        {this.props.isLogin
          ? <ActivityIndicator size="large" style={styles.spinner} color='black' />
          : <Text style={styles.text}>Fazer Login</Text>}
      </TouchableOpacity>
    );
  }
}

GetStarted.propTypes = {
  click: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  button: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    backgroundColor: 'white',
    borderColor: '#e3e3e3',
    borderWidth: 1,
    borderRadius: w(10),
    marginTop: h(5),
  },
  text: {
    color: '#847e7d',
    fontWeight: '700',
    paddingVertical: h(1),
    fontSize: totalSize(1.8),
  },
  spinner: {
    height: h(5),
  },
});
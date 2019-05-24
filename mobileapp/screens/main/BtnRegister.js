import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {w, h, totalSize} from '../../api/Dimensions';

export default class BtnRegister extends Component {
    
  render() {
    return (
      <TouchableOpacity
        onPress={this.props.click}
        style={styles.button}
        activeOpacity={0.6}
      >
        <Text style={styles.text}>{this.props.textButton}</Text>
      </TouchableOpacity>
    );
  }
}

BtnRegister.propTypes = {
  click: PropTypes.func.isRequired,
  textButton: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  button: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    backgroundColor: '#888',
    borderRadius: w(10),
    marginTop: h(8),
  },
  text: {
    color: 'white',
    fontWeight: '700',
    paddingVertical: h(1),
    fontSize: totalSize(2.1),
  },
  spinner: {
    height: h(5),
  },
});
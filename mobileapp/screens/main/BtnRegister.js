import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import {w, h, totalSize} from '../../api/Dimensions';

color = '#50c478';

export default class BtnRegister extends Component {
  render() {
    color = this.props.isRegister? '#50c478': "#df3b27"
    return (
      <TouchableOpacity
        onPress={this.props.click}
        style={styles.button}
        activeOpacity={0.6}
      >
        {this.props.isRegister
          ? <Text style={styles.text}>REGISTRAR ENTRADA</Text>
          : <Text style={styles.text}>REGISTRAR SAÍDA</Text>}
      </TouchableOpacity>
    );
  }
}

BtnRegister.propTypes = {
  click: PropTypes.func.isRequired,
  isRegister: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  button: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    backgroundColor: color,
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
import React, { Component } from 'react'

import { StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, Platform, Image, Text, View, Button } from 'react-native'

import { w, h, totalSize } from '../../api/Dimensions';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer'
import { Registro } from './Registro';

/**
 * currentUser : {
 *  nome: string,
 *  cargo: string, 
 *  profilePic: [PNG | JPG],
 *  cargaHorariaDiaria: float,
 *  registrosDia: array,
 *  registrosAll: array, 
 * }
 * 
 * registro : {
 *  data,
 *  hora
 * }
 */
export default class Main extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isRegister: true,
      inNouts: [],
      textButton: "Fazer login",
      nHoras: 7,
      nMinutos: 30,
      timerStart: false,
      stopwatchStart: false,
      totalDuration: 90000,
      timerReset: false,
      stopwatchReset: false,
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
  }

  toggleTimer() {
    this.setState({ timerStart: !this.state.timerStart, timerReset: false });
  }

  resetTimer() {
    this.setState({ timerStart: false, timerReset: true });
  }

  toggleStopwatch() {
    this.setState({ stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false });
  }

  resetStopwatch() {
    this.setState({ stopwatchStart: false, stopwatchReset: true });
  }

  getFormattedTime(time) {
    this.currentTime = time;
  };

  /**
   * 
   logout(){
     global.firebase.auth().signOut().then(function() {
       // Sign-out successful.
       () => this.props.navigation.navigate('Loading')
      }, function(error) {
        console.log(error);
      });
    }
     */

  setTextButton = () => {
    this.state.isRegister
      ? this.setState({ isRegister: false, textButton: "Fazer logout" })
      : this.setState({ isRegister: true, textButton: "Fazer login" });

    // fazer login / logout tbm
  }

  componentDidMount() {
    //const {currentUser} = global.firebase.auth()

  }

  click() {
    return this.state.isRegister ? new Registro("in ") : new Registro("out ");
  }

  render() {
    const { currentUser } = this.state;
    //console.log(global.firebase.auth())

    return (
      <View style={styles.container}>

        <View style={styles.mainContainer}>
          {/** quando o firebase estiver configurado, alterar 
            <Image style={styles.icon} resizeMode="contain" source={this.state.currentUser.profilePic}/>
          */}
          <Image style={styles.icon} resizeMode="contain" source={require("../../assets/logo.png")} />

          <Text style={styles.titulo1White}> Victor Silva</Text>
          <Text style={styles.titulo2White}> Analista de Sistemas</Text>

          <View style={[styles.container, { flexDirection: "row" }]}>
            <View style={{ flexDirection: "column" , alignItems: "center"}}>
                <Stopwatch laps msecs={false} start={this.state.timerStart}
                  reset={this.state.timerReset}
                  options={options}
                  getTime={this.getFormattedTime} />
              
              <Text style={styles.titulo2White}> Horas Trabalhadas </Text>
            </View>


            <View style={{ flexDirection: "column" , alignItems: "center"}}>
                <Timer totalDuration={this.state.totalDuration} msecs={false} start={this.state.timerStart}
                  reset={this.state.timerReset}
                  options={options}
                  handleFinish={handleTimerComplete}
                  getTime={this.getFormattedTime} />
              
              <Text style={styles.titulo2White}> Tempo Restante </Text>
            </View>
          </View>

        </View>

        {/** TIMER */}
        <View style={{ margin: 10 }}>
          <View>
            
            <View style={{ flexDirection: 'row' }}>
              <TouchableHighlight onPress={this.toggleTimer}>
                <Text style={{ fontSize: 20, paddingHorizontal: 10, marginHorizontal: 10 }}>{!this.state.timerStart ? "Start" : "Stop"}</Text>
              </TouchableHighlight>

              <TouchableHighlight onPress={this.resetTimer}>
                <Text style={{ fontSize: 20 }}>Reset</Text>
              </TouchableHighlight>
            </View>

          </View>
        </View>

        {/** Botao de fazer check-in */}
        <TouchableOpacity
          onPress={this.setTextButton}
          style={styles.buttonView}
          activeOpacity={0.6}
        >
          <Text style={styles.textButton}>{this.state.textButton}</Text>
        </TouchableOpacity>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 22,
  },
  mainContainer: {
    backgroundColor: "#232323",
    alignItems: "center",
    width: w(100),
    height: h(55),
    padding: 20,
    marginTop: 0,
  },
  icon: {
    width: w(25),
    height: h(25),
    resizeMode: "contain",
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "white",
    borderRadius: w(25) / 2,
    margin: 0,
    padding: 10,
  },
  titulo1White: {
    color: "#fffffe",
    fontWeight: '600',
  },
  titulo2White: {
    color: "#fffffe",
  },
  numeroDestaqueWhite: {
    color: "#fffffe",
    fontSize: h(10),

  },
  buttonView: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: w(2),
    backgroundColor: '#888',
    borderRadius: w(10),
    padding: h(3),
  },
  textButton: {
    color: 'white',
    fontWeight: '700',
    paddingVertical: h(1),
    fontSize: totalSize(2.1),
  },
})


const handleTimerComplete = () => alert("custom completion function");

const options = {
  container: {
    backgroundColor: '#252525',
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: 40,
    color: '#FFF',
    marginLeft: 7,
  }
};
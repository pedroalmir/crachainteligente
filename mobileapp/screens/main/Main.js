import React, { Component } from 'react'

import { StyleSheet, SectionList, ScrollView, TouchableOpacity, TouchableHighlight, Platform, Image, Text, View } from 'react-native'

import { w, h, totalSize } from '../../api/Dimensions';
import { Registro } from './Registro';
import { Ionicons } from '@expo/vector-icons';
import Styles from '../../assets/styles/mainStyle';
import { LinearGradient } from 'expo';

import firebase from '../../api/MyFirebase'


/**
 * 
 * PARA FAZER O TIMER RODAR EM BACKGROUND: https://github.com/ocetnik/react-native-background-timer
 * Isso deve ser feito apenas por último, pois é necessário que o app seja ejetado no expo, o que é irreversível.
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
      name: "...", 
      user: {
        name: "Terry Crews",
        email: "terry.crews@great.ufc.br",
        pic: require("../../assets/person.jpg"),
        role: "Analista de Sistemas",
        chDaily: 8,
        chMonthly: 44,
        lastAction: "output",
        registers: [],
      },
      horas: 8,
      minutos: 0,
      segundos: 0,
      horasUp: 0,
      minutosUp: 0,
      segundosUp: 0,
      textButton: "Fazer login",
    };

  }

  syncUser = async () => {
    firebase.readInfo().then(value => {
      console.log("syncUser:", value);
      this.setState({ user: value, name: value.name });
    }).catch(error => {
      console.log(error);
    })

  }

  /**
   * Supondo que o segundo é <= 1
   */

  reformatTimer = () => {
    var minutos = this.state.minutos;
    var minutosUp = this.state.minutosUp;
    const segundos = 59;
    const segundosUp = 0;
    var minutos = minutos - 1;
    var horas = this.state.horas;
    var horasUp = this.state.horasUp;
    if (horas !== this.state.user.chDaily)
      var minutosUp = minutosUp + 1;


    // sera que acabou uma hora?
    if (minutos < 0) {
      horas = horas - 1;
      minutos = 59;
    }

    if (minutosUp > 59) {
      horasUp = horasUp + 1;
      minutosUp = 0;
    }

    // será que acabou o expediente? 
    if (this.state.horas < 0) {
      clearInterval(this.countdown);
    }

    this.setState({ horas: horas, minutos: minutos, segundos: segundos, horasUp: horasUp, minutosUp: minutosUp, segundosUp: segundosUp })
  }

  /*
   
   logout(){
     global.firebase.auth().signOut().then(function() {
       // Sign-out successful.
       () => this.props.navigation.navigate('Loading')
      }, function(error) {
        console.log(error);
      });
    }
     */


  componentDidMount() {

    //pegando o usuario atual no firebase
    //this.syncUser();

  }


  /**
   * Callback for When the login / logout button is pressed
   */
  setTextButton = () => {

    // se estiver entrando

    if (this.state.isRegister) {
      // setando o intervalo
      this.countdown = setInterval(this.timer, 1000);
      var today = new Date();
      var u = this.state.user;

      // adicionando entrada
      u.lastAction = "input";
      u.registers.push({
        data: ["Entrada: " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()] // colocar tambem o dia/mes/ano
      })
      this.setState({ user: u, isRegister: false, textButton: "Fazer logout" })

      // salvando last action no firebase
      //firebase.updateInfo(u);
      // salvando register no firebase
      //firebase.updateRegister(u.registers[u.registers.length - 1]);
    } else {
      // parando o intervalo...
      lastAction = "output"
      clearInterval(this.countdown)

      var today = new Date();
      var u = this.state.user;

      u.registers.push({
        data: ["Saída: " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()]
      })

      this.setState({ user: u, isRegister: true, textButton: "Fazer login" })

      // salvando last action no firebase
      //firebase.updateInfo(u)
      // salvando register no firebase
     // firebase.updateRegister(u.registers[u.registers.length - 1])
    }

    // fazer login / logout tbm
  }

  /**
   * Callback checking every second if the zero second was reached. If true, reformat the time
   */
  timer = () => {
    var s = this.state.segundos;
    if (s <= 0) {
      this.reformatTimer();
    } else {
      this.setState({ segundos: this.state.segundos - 1, segundosUp: this.state.segundosUp + 1, });
    }
  }

  render() {
    //const { currentUser } = this.state;
    //console.log(global.firebase.auth())

    return (
      <View style={Styles.container.container}>

        <LinearGradient
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.mainContainer}>
          {/** Menu Icon */}
          <Ionicons
            onPress={() => { this.props.navigation.openDrawer(); }}
            style={{
              justifyContent: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0)',
              alignItems: 'flex-start',
              alignSelf: "flex-start",
              marginHorizontal: 10
            }}
            name="ios-menu" size={Styles.fWidth(32)} color="#fefefe"
          />

          <Image
            style={{
              width: Styles.fWidth(140), height: Styles.fHeight(140), borderRadius: Styles.fWidth(140 / 2), borderColor: 'white', borderWidth: 1, margin: 10
            }}
            source={this.state.user.pic ? this.state.user.pic : require("../../assets/person.png")}
          />

          <Text style={styles.titulo1White}> {this.state.user.name ? this.state.user.name : "..."}</Text>
          <Text style={styles.titulo2White}> {this.state.user.role ? this.state.user.role : "..."}</Text>
          <Text style={styles.titulo2White}> {this.state.name}</Text>


          <View style={[{ flexDirection: "row", flex: 1, alignItems: "center", marginTop: 0 }]}>
            <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
              <Text style={styles.numeroDestaqueWhite}>
                {this.state.horasUp <= 9 ? '0' + this.state.horasUp : this.state.horasUp}:{this.state.minutosUp <= 9 ? '0' + this.state.minutosUp : this.state.minutosUp}:{this.state.segundosUp <= 9 ? '0' + this.state.segundosUp : this.state.segundosUp}
              </Text>

              <Text style={styles.titulo2White}> Horas Trabalhadas </Text>
            </View>


            <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
              <Text style={styles.numeroDestaqueWhite}>
                {this.state.horas <= 9 ? '0' + this.state.horas : this.state.horas}:{this.state.minutos <= 9 ? '0' + this.state.minutos : this.state.minutos}:{this.state.segundos <= 9 ? '0' + this.state.segundos : this.state.segundos}
              </Text>
              <Text style={styles.titulo2White}> Tempo Restante </Text>
            </View>
          </View>

        </LinearGradient>

        <View style={{ padding: 10 }}>
          <View>
            <Text style={{ marginHorizontal: 20, alignSelf: 'flex-start', fontSize: Styles.fWidth(18), color: Styles.color.cinza, padding: 8 }}>
              registers do dia
            </Text>
          </View>

          


          {/** SECTION List Com os registers do funcionario */}




          <ScrollView style={{ height: h(20) }}>

            <SectionList
              contentContainerStyle={{
                alignItems: "flex-start"
              }}
              style=
              {{
                marginTop: 0,
                paddingHorizontal: 15,
                marginBottom: 15,
              }}
              renderItem={
                ({ item, index, section }) =>
                  (
                    <View style={{ width: w(80), padding: 5, borderBottomColor: Styles.color.cinzaClaro, borderBottomWidth: 1 }}>
                      <Text
                        style={{ fontSize: Styles.fWidth(18), color: Styles.color.cinza, marginHorizontal: 20 }} key={index}>
                        {item}
                      </Text>
                    </View>
                  )
              }
              renderSectionHeader={
                ({ section: { title } }) => (
                  <Text
                    style={{ color: Styles.color.cinzaEscuro, fontWeight: '800' }}>{title}
                  </Text>
                )
              }
              sections={this.state.user.registers ? this.state.user.registers : []}
              keyExtractor={(item, index) => item + index}
            />
          </ScrollView>

          {/** Botao de fazer check-in */}
          <TouchableOpacity
            onPress={this.setTextButton}
            style={styles.buttonView}
            activeOpacity={0.6}
          >
            <Text style={styles.textButton}>{this.state.textButton}</Text>
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
    marginTop: 22,
  },
  mainContainer: {
    backgroundColor: "#232323",
    alignItems: "center",
    width: w(100),
    height: h(55),
    marginTop: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
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
    fontSize: Styles.fWidth(35),


  },
  buttonView: {
    width: '85%', 
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5f5f5f',
    borderRadius: w(10),
    padding: h(1.5),
    marginVertical: h(3),
  },
  textButton: {
    color: 'white',
    fontWeight: '700',
    paddingVertical: h(1),
    fontSize: totalSize(2.1),
  },
})


const options = {
  container: {
    padding: 5,
    borderRadius: 5,
  },
  text: {
    fontSize: Styles.fWidth(40),
    color: '#FFF',
    marginLeft: 7,
  }
};
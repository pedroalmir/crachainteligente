import React, { Component } from 'react'

import { StyleSheet, SectionList, ScrollView, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Image, Text, View } from 'react-native'

import { w, h, totalSize } from '../../api/Dimensions';

import { Ionicons } from '@expo/vector-icons';
import Styles from '../../assets/styles/mainStyle';
import { LinearGradient } from 'expo';
import firebase from '../../api/MyFirebase';

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
      name: "Terry Crews",
      email: "terry.crews@great.ufc.br",
      pic: require("../../assets/person.jpg"),
      role: "Analista de Sistemas",
      phone: "8588776655",
      chDaily: 8,
      chMonthly: 44,
      lastAction: "output",
      user: {
      },
      registers: [],
      horas: 8,
      minutos: 0,
      segundos: 0,
      horasUp: 0,
      minutosUp: 0,
      segundosUp: 0,
      textButton: "...",
      isRegister: true,

      isLoadingRegisters: true,
      isLoadingUser: true,
    };

  }

  line = "\n______________________________\n";

  componentDidMount() {

    console.log(this.line)
    this.syncUser();
    this.syncRegisters();

  }

  syncTimer() {

    console.log(this.line, "sync Timer")
    var regs = this.state.registers;

    //primeiro acesso?
    if (regs.length <= 0) {
      this.setState({
        segundosUp: 0,
        minutosUp: 0,
        horasUp: 0,
        horas: this.user.chDaily,
        minutos: 0,
        segundos: 0,
        isRegister: true,
        textButton: "Fazer Login",
        isLoadingRegisters: false,
      })
      return;
    }
    const last = regs[regs.length - 1];
    const first = regs[0];

    const f = first.split(':');
    const l = last.split(':');

    var hUp = l[0] - f[0];

    //minutos decorridos

    var minUp = l[1] - f[1]
    if (minUp < 0) {
      minUp = 60 + minUp;
      hUp = hUp - 1;
    }

    //segundos decorridos
    var segUp = l[2] - f[2];
    if (segUp < 0) {
      segUp = 60 + minUp;
      minUp = minUp - 1;
    }

    console.log('timer up:', hUp, minUp, segUp)

    // agora, o countdown. Supondo que sempre será um numero inteiro de horas...
    // 01:34:25
    // 08:00:00

    var h = this.state.user.chDaily - hUp - 1;
    var m = 60 - minUp;
    var s = 60 - segUp;

    console.log('timer down:', h, m, s);

    console.log("last action:", this.state.lastAction)

    for(i=0;i<regs.length;i++){
      if(i%2==0){
        regs[i] = "Entrada: " + regs[i];
      }else{
        regs[i] = "Saída: " + regs[i];
      }
    }

    this.setState({
      registers: regs,
      segundosUp: segUp,
      minutosUp: minUp,
      horasUp: hUp,
      horas: h,
      minutos: m,
      segundos: s,
      isRegister: this.state.lastAction === "output",
      textButton: this.state.lastAction === "output" ? "Fazer Login" : "Fazer Logout",
      isLoadingRegisters: false,
    })

    // verificar se é necessário rodar o cronometro imediatamente
    this.state.lastAction === "input" ? clearInterval(this.countdown) : this.countdown = setInterval(this.timer, 1000);

  }

  listenForRegisters() {
    firebase.getRef().on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push(child.val());
      });

      this.setState({
        registers: this.state.registers.cloneWithRows(items)
      });

    });
  }

  /**
   * Quando a main inicia ela deve carregar a info do usuario
   */
  syncUser = async () => {
    firebase.readInfo().then(value => {
      console.log(this.line, "sync User:", value);
      this.setState({ user: value, isLoadingUser: false })
    }).catch(error => {
      ToastAndroid.showWithGravityAndOffset('Não foi possível acessar o banco de dados. Por favor, reinicie a aplicação', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      console.log(error);
    })

  }
  /**
   * Quando a main inicia ela deve carregar a info do usuario e seta os timers (not optimal)
   * Formato do registro: dd/mm/yyyy hh:mm:ss
   */
  syncRegisters = async () => {
    var fullData = new Date();

    console.log(fullData)
    // dd/mm/yy que sera inserida como chave
    today = firebase.getFormatedDate();

    firebase.readRegisters(today).then(value => {

      // formatando a data de hoje como regex
      today = firebase.getFormatedDate().replace(/\//g, "-");
      console.log("regex today", today)

      regs = [];
      Object.values(value).forEach(child => {
        // para cada registro, pegar que tiver a data de hoje e cortar o dia
        child = child.replace(/\//g, '-');

        // se o registro for de hoje, adicione aos registros do app
        if (child.match(new RegExp(today, 'g'))) {
          regs.push(child.split(" ")[1]);
        }
      });

      

      console.log("registros de hoje:", regs, this.line)

      this.setState({
        registers: regs,
      });

      // sincronizando o ultimo registro com os timers
      this.syncTimer();
    }).catch(error => {
      ToastAndroid.showWithGravityAndOffset('Não foi possível acessar o banco de dados. Por favor, reinicie a aplicação', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      console.log(error);
    })

  }


  /**
   * Callback for When the login / logout button is pressed
   */
  setTextButton = () => {

    // se estiver entrando

    if (this.state.isRegister) {
      // parando o intervalo...
      clearInterval(this.countdown)

      // action: hh/mm/ss que será o value do today
      var fullData = new Date();

      // action: hh/mm/ss que será o value do today
      const hora = firebase.getFormatedTime();
      console.log("hora before:", hora)

      const reg = this.state.registers;
      console.log("registers before:", reg)
      reg.push("Entrada: " + hora)

      this.setState({
        registers: reg,
        lastAction: "input",
        isRegister: false,
        textButton: "Fazer Login"
      });

      firebase.updateLastAction("input")
      // ok with this
      firebase.updateRegister(today + hora)

    } else {
      this.countdown = setInterval(this.timer, 1000);

      // action: hh/mm/ss que será o value do today
      const hora = firebase.getFormatedTime()

      const reg = this.state.registers;
      reg.push("Saída: " + hora)

      this.setState({
        registers: reg,
        lastAction: "output",
        isRegister: true,
        textButton: "Fazer Logout"
      });

      firebase.updateLastAction("output")
      // ok with this
      firebase.updateRegister(today + hora)
    }

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
    if (horas !== this.state.chDaily)
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
    let adiciona_registers = this.state.registers.map((reg, index) => {
      return (
        <View key={reg.chave} pass_in_reg={reg}>

          <View style={{
            alignItems: 'flex-start',
            borderTopWidth: 1, borderTopColor: Styles.color.cinzaClaro, marginLeft: 10
          }}>
            <Text style={[Styles.text.subtitle, { color: Styles.color.cinza, marginLeft: 0, padding: 10, fontSize: 19 }]}>
              {reg}
            </Text>

          </View>
        </View>
      )
    });

    return (
      <View style={{ flex: 1 }}>
        {
          this.state.isLoadingRegisters || this.state.isLoadingUser
            ?
            <View style={{ alignItems: "center", justifyContent: 'center', flex: 1 }}>
              <ActivityIndicator size="large" style={[styles.spinner, { alignSelf: "center" }]} color='black' />
            </View>

            : <View style={Styles.container.container}>

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

                <Text style={styles.titulo1White}> {this.state.user.name}</Text>
                <Text style={styles.titulo2White}> {this.state.user.role}</Text>

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
                  <Text style={{ marginHorizontal: 5, alignSelf: 'flex-start', fontSize: Styles.fWidth(18), color: Styles.color.cinzaEscuro, padding: 8 }}>
                    Registros do Dia:
            </Text>
                </View>




                {/** SECTION List Com os registers do funcionario */}




                <ScrollView style={{ height: h(20) }}>
                  {adiciona_registers}
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
        }
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
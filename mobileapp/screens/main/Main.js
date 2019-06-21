import React, { Component } from 'react'

import { StyleSheet, SectionList, ScrollView, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Image, Text, View } from 'react-native'

import { w, h, totalSize } from '../../api/Dimensions';

import { Ionicons } from '@expo/vector-icons';
import Styles from '../../assets/styles/mainStyle';
import { LinearGradient } from 'expo';
import firebase from '../../api/MyFirebase';

export default class Main extends Component {

  /**
   * 
   * PARA FAZER O TIMER RODAR EM BACKGROUND: https://github.com/ocetnik/react-native-background-timer
   * Isso deve ser feito apenas por último, pois é necessário que o app seja ejetado no expo, o que é irreversível.
   */
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
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

      lastAction: "output",

      isLoadingRegisters: true,
      isLoadingUser: true,

      pressedButton: false,
    };

  }

  line = "\n______________________________\n";

  componentDidMount() {

    console.log(this.line, "Starting Main...")
    this.syncUser();
    this.listenForRegisters();
  }

  /**
   * When main starts, the user must be updated
   */
  syncUser = async () => {
    firebase.readInfo().then(value => {
      console.log(this.line, "syncronizing User...", value.lastAction);
      this.setState({
        user: value,
        isLoadingUser: false,
        lastAction: value.lastAction
      });
    }).catch(error => {
      ToastAndroid.showWithGravityAndOffset('Não foi possível acessar o banco de dados. Por favor, reinicie a aplicação', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
      console.log(error);
    })

  }







  /**
   * buggy
   */
  listenForRegisters() {
    firebase.getRef().on('value', (snap) => {

      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push(child.val());
      });

      console.log(this.line, "  new item:", items[items.length - 1], this.line)

      var regs;
      var la = this.state.lastAction
      // must return one
      console.log("is loading registers?", this.state.isLoadingRegisters)



      if (!this.state.isLoadingRegisters && !this.state.pressedButton) { // e !botaoPressed
        // Entrada dsoifjs odsfsdoi
        la = this.state.lastAction === "output" ? "input" : "output"
        //firebase.updateLastAction(la) // aqui, o cartao atualiza o la sozinho
      }


      console.log(this.line, "registers after format:", la, this.line)

      this.setState({
        lastAction: la,
      });

      regs = this.formarRegisters(items);


      this.setState({
        lastAction: la,
        isRegister: !this.state.isRegister,
        registers: regs,
      });

      la === "input" ? this.countdown = setInterval(this.timer, 1000) : clearInterval(this.countdown)

      this.syncTimer(regs)


    });
  }



  formarRegisters(regs) {

    console.log(this.line, "inside format registers:")

    today = firebase.getFormatedDate().replace(/\//g, "-");

    var regsOut = []
    regs.forEach(child => {
      // para cada registro, pegar que tiver a data de hoje e cortar o dia
      child = child.replace(/\//g, '-');

      // se o registro for de hoje, adicione aos registros do app
      if (child.match(new RegExp(today, 'g'))) {
        regsOut.push(child.split(" ")[1]);
      }
    });

    var isEntering = regs.length % 2 != 0;
    console.log("la:", this.state.lastAction)

    // setting the registers
    for (i = 0; i < regsOut.length; i++) {
      if (i % 2 == 0) {
        regsOut[i] = "Entrada: " + regsOut[i];
      } else {
        regsOut[i] = "Saída: " + regsOut[i];
      }
    }

    console.log("droping format registers:", this.line)
    return regsOut;
  }

  separateRegister(regs) {
    re = [];
    regs.forEach(child => {
      re.push(child.split(" ")[1]);
    });
    return re;
  }


  separateTime(reg) {
    return reg.split(":");
  }

  /**
   * recebe um array de registros no formato h:m:s e retorna um json do estilo
   * - {
   * -  h,
   * -  m,
   * -  s,
   * - hup,
   * - mup,
   * -  sup
   * - }
   * @param {*} regs 
   */
  newFormatTime(regs) {

    // supondo que regs ja esta no formato h:m:s e tem tamanho par
    // indice par -> entrada
    // indice impar -> saida

    if (regs.length % 2 != 0) {
      regs.push(firebase.getFormatedTime());
    }

    aj = [];

    //calculando cada intervalo logado (bruto)
    for (i = 0; i < regs.length; i = i + 2) {
      f = this.separateTime(regs[i]);
      l = this.separateTime(regs[i + 1]);

      aj.push({
        h: l[0] - f[0], 
        m: l[1] - f[1], // pode ser negativo
        s: l[2] - f[2], // pode ser negatvo
      })
    }

    // corrigindo os tempos brutos negativos
    for (i = 0; i < aj.length; i++) {
      if (aj[i].s < 0) {
        aj[i].s = 60 + aj[i].s;
        aj[i].m = aj[i].m - 1;
      }

      if (aj[i].m < 0) {
        aj[i].m = 60 + aj[i].m;
        aj[i].h = aj[i].h - 1;
      }
    }

    //somando os tempos acumulados
    times = {
      sup: 0,
      mup: 0,
      hup: 0,
    };
    for (i = 0; i < aj.length; i++) {
      times.sup = times.sup + aj[i].s;
      times.mup = times.mup + aj[i].m;
      times.hup = times.hup + aj[i].h;
    }

    // corrigindo os tempos adicionais
    times.mup = times.mup + Math.trunc(Math.floor(times.sup / 60));
    times.sup = times.sup % 60;

    times.hup = times.hup + Math.trunc(Math.floor(times.mup / 60));
    times.mup = times.mup % 60;

    times.h = this.state.user.chDaily - times.hup - 1;
    times.m = 59 - times.mup;
    times.s = 59 - times.sup;

    console.log(times);

    return times;
  }


  formatTime(regs) {
    if (this.state.lastAction === "output" && !this.state.isLoadingRegisters) { // o tempo decorrido nao contou
      return {
        segUp: this.state.segundosUp,
        minUp: this.state.minutosUp,
        hUp: this.state.horasUp,
        h: this.state.horas,
        m: this.state.minutos,
        s: this.state.segundos
      };
    }

    regss = []
    for (i = 0; i < regs.length; i++) {
      regss[i] = regs[i].split(" ")[1]
    }
    //console.log(this.line, "formating time with regss:")

    var last;
    var first;

    if (regss.length % 2 != 0) {
      // now
      last = firebase.getFormatedTime();
      first = regss[regss.length - 1];
    } else {
      last = regss[regss.length - 1];
      first = regss[regss.length - 2];
    }

    const f = first.split(':');
    const l = last.split(':');

    // equal above...

    var sup = this.state.segundosUp + (f[0] - l[0]) // pode dar > 60
    var mup = this.state.minutosUp + (f[1] - l[1]) // pode dar > 60
    var hup = this.state.horasUp + (f[2] - l[2]) // pode dar > 60

    if (sup >= 60) {
      mup = mup + Math.trunc(Math.floor(sup / 60)); // 70 / 60 = 1 
      sup = sup % 60; // 70 % 60 = 10
    }
    if (mup >= 60) {
      hup = hup + Math.trunc(Math.floor(mup / 60)); // 70 / 60 = 1 
      mup = mup % 60; // 70 % 60 = 10
    }

    // now, timer

    var h = (this.state.user.chDaily - hUp - 1) >= 0 ? this.state.user.chDaily - hUp - 1 : 0;
    var m = 59 - minUp;
    var s = 59 - segUp;

    return {
      segUp: sup,
      minUp: mup,
      hUp: hup,
      h: h,
      m: m,
      s: s
    };

  }




  fformatTime(regs) {

    if (this.state.lastAction === "output" && !this.state.isLoadingRegisters) { // o tempo decorrido nao contou
      return {
        segUp: this.state.segundosUp,
        minUp: this.state.minutosUp,
        hUp: this.state.horasUp,
        h: this.state.horas,
        m: this.state.minutos,
        s: this.state.segundos
      };
    }

    // Entrada: kdjfs dfsoiudo -> fdjshkj dsfkjsf
    regss = []
    for (i = 0; i < regs.length; i++) {
      regss[i] = regs[i].split(" ")[1]
    }
    console.log(this.line, "formating time with regss:")
    var last;
    var first;
    if (regss.length % 2 != 0) {
      // now
      last = firebase.getFormatedTime();
      first = regss[regss.length - 1];
    } else {
      last = regss[regss.length - 1];
      first = regss[regss.length - 2];
    }


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
      segUp = 60 + segUp;
      minUp = minUp - 1;
    }

    var h = this.state.user.chDaily - hUp - 1;
    var m = 59 - minUp;
    var s = 59 - segUp;

    return {
      segUp: segUp,
      minUp: minUp,
      hUp: hUp,
      h: h,
      m: m,
      s: s
    };
  }

  syncTimer(regs) {

    console.log(this.line, "syncronizing Timer...")
    //var regs = this.state.registers;

    //primeiro acesso?
    if (regs.length <= 0) {
      this.setState({
        segundosUp: 0,
        minutosUp: 0,
        horasUp: 0,
        horas: this.state.user.chDaily,
        minutos: 0,
        segundos: 0,
        isRegister: true,
        textButton: "Check-in",
        isLoadingRegisters: false,
      })
      return;
    }

    // removes the date
    septime = this.separateRegister(regs);

    // getting the formated time
    var time = this.newFormatTime(septime); // this passes by reference! 

    this.setState({
      segundosUp: time.sup,
      minutosUp: time.mup,
      horasUp: time.hup,
      horas: time.h,
      minutos: time.m,
      segundos: time.s,
      //isRegister: this.state.lastAction === "output",
      textButton: this.state.lastAction === "output" ? "Check-in" : "Check-out",
      isLoadingRegisters: false,
    })

    // starting or stoping the timer by last action

  }






  /**
   * Callback for When the login / logout button is pressed
   */
  setTextButton = () => {
    //clearInterval(this.countdown)

    this.setState({
      pressedButton: true,
    })

    // se estiver entrando
    const today = firebase.getFormatedDate()
    const hora = firebase.getFormatedTime();

    //output -> its gettin in
    console.log(this.line, "setting text button - la:", this.state.lastAction)
    if (this.state.lastAction === "output") {

      // action: hh/mm/ss que será o value do today

      const reg = this.state.registers;
      reg.push("Entrada: " + hora)

      this.setState({
        registers: reg,
        lastAction: "input",
        textButton: "Check-in"
      });

      firebase.updateLastAction("input")


    } else {
      // stoping counter...

      // action: hh/mm/ss que será o value do today

      const reg = this.state.registers;
      reg.push("Saída: " + hora)

      this.setState({
        registers: reg,
        lastAction: "output",
        textButton: "Check-out"
      });

      firebase.updateLastAction("output")
    }

    firebase.updateRegister(today + hora).then(res => {
      if (res) {
        this.setState({
          pressedButton: false,
        })
      }
    })

  }

  /**
   * Esta função é chamada somente quando os segundos chegarama zero
   */

  reformatTimer = () => {
    const segundos = 59;
    const segundosUp = 1;

    var minutos = this.state.minutos;
    var minutosUp = this.state.minutosUp;

    var horas = this.state.horas;
    var horasUp = this.state.horasUp;

    if (horas === this.state.user.chDaily) {
      horas = horas - 1;
      minutos = 60;
      minutosUp = minutosUp - 1;
    }

    if (minutos <= 0) {

      minutos = 59;
      minutosUp = 0;

      horasUp = horasUp + 1;


      // acabou o expediente.
      if (horasUp < this.state.user.chDaily) {

        horas = horas - 1;

      } else {
        const today = firebase.getFormatedDate();
        const hora = firebase.getFormatedTime();

        clearInterval(this.countdown);

        // ok with this
        firebase.updateLastAction("output")
        firebase.updateRegister(today + hora)
      }

    } else {
      minutos = minutos - 1;
      minutosUp = minutosUp + 1;
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
                  name="ios-menu" size={(32)} color="#fefefe"
                />

                <Image
                  style={{
                    width: (140), height: 140, borderRadius: (140 / 2), borderColor: 'white', borderWidth: 1, margin: 10
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
                  <Text style={{ marginHorizontal: 5, alignSelf: 'flex-start', fontSize: (18), color: Styles.color.cinzaEscuro, padding: 8 }}>
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
    fontSize: (35),


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
    fontSize: (40),
    color: '#FFF',
    marginLeft: 7,
  }
};
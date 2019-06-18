import React, { Component } from 'react'

import { StyleSheet, SectionList, ScrollView, TouchableOpacity, ActivityIndicator, ToastAndroid, Platform, Image, Text, View, Dimensions} from 'react-native'

import { w, h, totalSize } from '../api/Dimensions';

import { Ionicons } from '@expo/vector-icons';
import Styles from '../assets/styles/mainStyle';
import { LinearGradient } from 'expo';
import firebase from '../api/MyFirebase';
import DatePicker from 'react-native-datepicker';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit';
import moment, { months } from 'moment';



/**
 * 
 * PARA FAZER O TIMER RODAR EM BACKGROUND: https://github.com/ocetnik/react-native-background-timer
 * Isso deve ser feito apenas por último, pois é necessário que o app seja ejetado no expo, o que é irreversível.
 */
export default class ReportScreen extends Component {

  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      name: "Terry Crews",
      email: "terry.crews@great.ufc.br",
      pic: require("../assets/person.jpg"),
      role: "Analista de Sistemas",
      phone: "8588776655",
      chDaily: 8,
      chMonthly: 44,
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
      diaRef:0,
      mesRef:0,

      chtrabalhadas: "...",

      isLoadingRegisters: true,
      isLoadingUser: true,

      isLoadingRegisters: true,
      isLoadingUser: true,
      
   
    
    };
    this.meses= ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    this.mesesAbrev= ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    this.dias=["Domingo, Segunda Feira", "Terça Feira", "Quarta Feira", "Quinta Feira", "Sexta Feira", "Sábado"];
    this.diasAbrev=["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    this.eventDays=["Manhã", "Tarde", "Almoço", "Horas Extras"];
    this.values = [];
    this.xAxis = [];

    this.today =  firebase.getFormatedDate();
    this.now = new Date();
    this.showRedraw = true;
    

  }

  line = "\n______________________________\n";
   


  componentDidMount() {

    this.syncUser();
    this.syncRegisters();

  }

  returnRegisters = async (data, tipo) => {
    console.log("entrou no comando returnRegisters")
    // dd/mm/yy que sera inserida como chave
    
    console.log("Conteúdo do argumento do método returnRegisters", data)
      switch(tipo){
        case 'week': return (                
          firebase.readRegisters(data).then(value => {
            //se nao tiver registros, criar quando apertar login...
            if (!value) {
              this.setState({
                registers: [],
              });
              // sincronizando o ultimo registro com os timers
              this.syncTimerss();
              return;
            }
            // existem registros
            // formatando a data de hoje como regex
            today = data.replace(/\//g, "-");
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
            this.syncTimerss();
            this.values.push(parseFloat(this.state.horasUp+'.'+this.state.minutosUp));
            console.log("Array de C/H atual: ", this.values);
            
          }).catch(error => {
            ToastAndroid.showWithGravityAndOffset('Não foi possível acessar o banco de dados. Por favor, reinicie a aplicação', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            console.log(error);
          }));

          case 'month': return (     
                               
                this.returnHorasMeses(data)
          );

                  
    
      }

      

  }

  returnHorasMeses = (data)=>{
    console.log("entrou no mês");
    mesRef = data.split('/');
    let totalMin = 0;
    let crCel = 0;

    
    console.log("mesRef:", parseInt(mesRef[1]));  
    if(parseInt(mesRef[1]) === parseInt((new Date ().getMonth()) +1)){      
      mesRef[0] = parseInt((new Date().getDate()));
    }

    for(let i = 1; i<=parseInt(mesRef[0]); i++){      
     let diaExp = String(i)+'/'+String(mesRef[1])+'/'+ String(mesRef[2]); 
    

    firebase.readRegisters(diaExp).then(value => {
      //se nao tiver registros, criar quando apertar login...
      if (!value) {
        this.setState({
          registers: [],
        });
        // sincronizando o ultimo registro com os timers
        this.syncTimerss();
        return;
      }
      // existem registros
      // formatando a data de hoje como regex
      today = diaExp.replace(/\//g, "-");
      //console.log("regex today", today)

      regs = [];
      Object.values(value).forEach(child => {
        // para cada registro, pegar que tiver a data de hoje e cortar o dia
        child = child.replace(/\//g, '-');

        // se o registro for de hoje, adicione aos registros do app
        if (child.match(new RegExp(today, 'g'))) {
          regs.push(child.split(" ")[1]);
        }
      });

      //console.log("registros de hoje:", regs, this.line)

      this.setState({
        registers: regs,
      });

      // sincronizando o ultimo registro com os timers
      this.syncTimerss();      
      totalMin = totalMin + (parseInt(this.state.horasUp)*60) + parseInt(this.state.minutosUp);
      console.log("entrou no dia: ", diaExp);
      console.log("total Minutos: ", totalMin);
      let totalHoras = this.timeConvert(parseInt(totalMin));
      console.log("total horas:  ", totalHoras);

      if(crCel === 0){
        this.values.push(parseFloat(totalHoras));
        crCel = 1;
        console.log("inseriu o primeiro registro", this.values);
      }else{
        let de = diaExp.split('/');
        let m = parseInt(m[1]);
        let u = m-1;
        console.log("valor do m: ", m);
        console.log("valor do u: ", u);
        this.values[u] = parseFloat(totalHoras);
        console.log("atualizando o mês", u);
        console.log("valor dos meses", this.values);
      }
      
    }).catch(error => {      
      console.log(error);
    });
  }//for
  }//returnHorasMeses

  timeConvert = (n)=> {
    let num = n;
    let chours = 0;
    if(num != 0)
    chours = (num / 60);
    let rhours = Math.floor(chours);
    let minutes = (chours - rhours) * 60;
    let rminutes = Math.round(minutes);
    return rhours + "." + rminutes;
  }
    
   


  syncTimerss() {   
    
    //primeiro acesso?
    if (regs.length <= 0) {
      this.setState({
        segundosUp: 0,
        minutosUp: 0,
        horasUp: 0,
        horas: this.state.user.chDaily,
        minutos: 0,
        segundos: 0,     
      })
      return;
    }
    
    // last thing was input and then he abandoned. GET NOW
    if(regs.length%2!=0){

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
      segUp = 60 + segUp;
      minUp = minUp - 1;
    }

    //console.log('timer up:', hUp, minUp, segUp)

    // agora, o countdown. Supondo que sempre será um numero inteiro de horas...
    // 01:34:25
    // 08:00:00

    var h = this.state.user.chDaily - hUp - 1;
    var m = 59 - minUp;
    var s = 59 - segUp;

   //console.log('timer down:', h, m, s); 

    for (i = 0; i < regs.length; i++) {
      if (i % 2 == 0) {
        regs[i] = "Entrada: " + regs[i];
      } else {
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
      segundos: s    
    })
  }


  returnDays = () => {       
    this.xAxis =[];
    this.values =[];
    day = 4; 
      console.log(this.xAxis)     
      this.values =[]
      for(let i = 0; i< day; i++){
           this.xAxis.push(this.eventDays[i])
           this.values.push(parseInt(Math.random()*100))
  
      }
      console.log(this.values)
  }


  returnWeek = () => {       
    this.xAxis =[];
    this.values =[];
    day = this.now.getDay();

      for(let i = 0; i<=day; i++){
           this.xAxis.push(this.diasAbrev[i])
           fromDate = moment(this.now).subtract((day-i),'days').endOf('day').format('DD/M/YYYY');
           this.returnRegisters(fromDate, "week");           
      }
      console.log(this.values)
  } 

  returnMonth = () => {
    this.xAxis =[];
    this.values =[];
    month= this.now.getMonth();

    for(let i = 0; i<=month; i++){
         this.xAxis.push(this.mesesAbrev[i])
         fromDate = moment(this.now).subtract((month-i),'months').endOf('months').format('DD/M/YYYY');
         this.returnRegisters(fromDate, "month");
         
    }
    console.log(this.values)
  }

  returnData = () => {
    this.values =[]
    for(let i = 0; i< 7; i++){
         this.values.push(parseInt(Math.random()*100))

    }
    console.log(this.values)
    return this.values  
  }

  syncTimer() {   
    
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
        textButton: "Fazer Login",
        isLoadingRegisters: false,
      })
      return;
    }
    
    // last thing was input and then he abandoned. GET NOW
    if(regs.length%2!=0){

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
      segUp = 60 + segUp;
      minUp = minUp - 1;
    }

    console.log('timer up:', hUp, minUp, segUp)

    // agora, o countdown. Supondo que sempre será um numero inteiro de horas...
    // 01:34:25
    // 08:00:00

    var h = this.state.user.chDaily - hUp - 1;
    var m = 59 - minUp;
    var s = 59 - segUp;

    console.log('timer down:', h, m, s);

    console.log("last action:", this.state.lastAction)

    for (i = 0; i < regs.length; i++) {
      if (i % 2 == 0) {
        regs[i] = "Entrada: " + regs[i];
      } else {
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
    this.state.lastAction === "output" ? clearInterval(this.countdown) : this.countdown = setInterval(this.timer, 1000);

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
      this.setState({ user: value, isLoadingUser: false, lastAction: value.lastAction })
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

    console.log(this.fullData)
    // dd/mm/yy que sera inserida como chave
    today = firebase.getFormatedDate();
    console.log("Conteúdo do Today", today)

    firebase.readRegisters(today).then(value => {

      //se nao tiver registros, criar quando apertar login...
      if (!value) {
        this.setState({
          registers: [],
        });

        // sincronizando o ultimo registro com os timers
        this.syncTimer();
        return;
      }

      // existem registros
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
    const today = firebase.getFormatedDate()

    if (this.state.isRegister) {

      this.countdown = setInterval(this.timer, 1000);
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
      // parando o intervalo...
      clearInterval(this.countdown)


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
   * Esta função é chamada somente quando os segundos chegarama zero
   */

  reformatTimer = () => {
    const segundos = 59;
    const segundosUp = 1;

    var minutos = this.state.minutos;
    var minutosUp = this.state.minutosUp;

    var horas = this.state.horas;
    var horasUp = this.state.horasUp;

    if(horas === this.state.user.chDaily){
      horas = horas - 1;
      minutos = 60;
      minutosUp = minutosUp - 1;
    }

    if (minutos <= 0) {

      minutos = 59;
      minutosUp = 0;

      horasUp =  horasUp + 1;


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
                  name="ios-menu" size={Styles.fWidth(32)} color="#fefefe"
                />
                <Text style={styles.titulo1White}> {"Relatórios"}</Text>
                              
                
                <View style={[{ flexDirection: "row", flex: 1, alignItems: "center", marginTop: 0 }]}>
                    <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
                    <TouchableOpacity
                         onPress={this.returnDays}
                         style={styles.buttonView}
                         activeOpacity={0.6}
                    >
                        <Text style={styles.textButton}>{"Diário"}</Text>
                    </TouchableOpacity>                    
                    </View>
                    <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
                    <TouchableOpacity
                         onPress={this.returnWeek}
                         style={styles.buttonView}
                         activeOpacity={0.6}
                    >
                        <Text style={styles.textButton}>{"Semanal"}</Text>
                    </TouchableOpacity>                    
                    </View>
                    <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
                    <TouchableOpacity
                         onPress={this.returnMonth}
                         style={styles.buttonView}
                         activeOpacity={0.6}
                    >
                        <Text style={styles.textButton}>{"Mensal"}</Text>
                    </TouchableOpacity>                    
                    </View>
                 </View>
                 
                


                <View>
                 
                    <BarChart
                    
                    
                    fromZero = {true}
                    data={{
                        labels: this.xAxis,
                        datasets: [{
                            data: this.values
                        }]
                    }}
                    redraw
                    
                    width={Dimensions.get('window').width} // from react-native
                    height={220}
                    yAxisLabel={'C/H'}
                    chartConfig={{
                        backgroundColor: '#FFFFFF', 
                        backgroundGradientFrom: '#FFFFFF',
                        backgroundGradientTo: '#FFFFFF',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        textAlign: 'center',
                        style: {
                            borderRadius: 8
                        }
                    }}
                    
                    style={{
                        marginVertical: 8,
                        borderRadius: 8
                    }}
                    /> 
                        
                </View> 





                <View style={[{ flexDirection: "row", flex: 1, alignItems: "center", marginTop: 0 }]}>
                  
                 <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
                    <Text style={styles.numeroDestaqueWhite}>
                      {this.state.horasUp <= 6 ? '0' + this.state.horasUp : this.state.horasUp}:{this.state.minutosUp <= 9 ? '0' + this.state.minutosUp : this.state.minutosUp}
                    </Text>

                    <Text style={styles.titulo2White}> Horas Trabalhadas </Text>
                  </View>
                  <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
                    <Text style={styles.numeroDestaqueWhite}>
                      {this.state.horas <= 6 ? '0' + this.state.horas : this.state.horas}:{this.state.minutos <= 9 ? '0' + this.state.minutos : this.state.minutos}
                    </Text>
                    <Text style={styles.titulo2White}> Tempo Restante </Text>
                  </View>

                  <View style={{ flexDirection: "column", alignItems: "center", paddingHorizontal: 10 }}>
                    <Text style={styles.numeroDestaqueWhite}>
                      {this.state.horas <= 6 ? '0' + this.state.horas : this.state.horas}:{this.state.minutos <= 9 ? '0' + this.state.minutos : this.state.minutos}
                    </Text>
                    <Text style={styles.titulo2White}> Saldo de Horas </Text>
                  </View>
                </View>

              </LinearGradient>

              <View style={{ padding: 10 }}>
                
                
                <TouchableOpacity
                  onPress={this.setTextButton}
                  style={styles.buttonView2}
                  activeOpacity={0.6}
                >
                  <Text style={styles.textButton}>{"GERAR RELATÓRIO DETALHADO"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.setTextButton}
                  style={styles.buttonView2}
                  activeOpacity={0.6}
                >
                  <Text style={styles.textButton}>{"COMPARTILHAR"}</Text>
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
    height: h(75),
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
    fontSize: Styles.fWidth(23),


  },
  buttonView: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E9AFE',
    borderRadius: w(10),
    padding: h(1.5),
    marginVertical: h(3),
    marginHorizontal: h(2),
  },

  buttonView2: {
    width: '85%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E9AFE',
    borderRadius: w(10),
    padding: h(1.5),
    marginVertical: h(1),
  },

  textButton: {
    color: 'white',
    fontWeight: '700',
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
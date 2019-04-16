import React from 'react'

import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'

import {w, h, totalSize} from '../../api/Dimensions';
import {BtnRegister} from './BtnRegister';

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
export default class Main extends React.Component {
  state = { 
    currentUser: null,
    isRegister: true, 
    inNouts: [],
  }

  logout(){
    global.firebase.auth().signOut().then(function() {
      // Sign-out successful.
      () => this.props.navigation.navigate('Loading')
    }, function(error) {
        console.log(error);
    });
  }

  componentDidMount(){
    const {currentUser} = global.firebase.auth()
    this.setState({
      currentUser
    })
  }

  click(){
    this.state.isRegister? new Registro("in "): new Registro("out ");
  }

  render() {
    const { currentUser } = this.state
    //console.log(global.firebase.auth())

    return (
      <View style={styles.container}>
        <View style={{backgroundColor:"#559c98", width: "100%", alignItems: "center", marginBottom: h(3)}}>
          {/** quando o firebase estiver configurado, alterar 
            <Image style={styles.icon} resizeMode="contain" source={this.state.currentUser.profilePic}/>
          */} 
          <Image style={styles.icon} resizeMode="contain" source={require("../../assets/logo.png")}/>
        </View>

        <Text style={styles.titulo1White}> 
          {this.state.currentUser.nome} 
        </Text>
        
        <Text style={styles.titulo2White}> 
          {this.state.currentUser.cargo} 
        </Text>

        <View style={[styles.container, {flexDirection: "row"}]}>
          <View style={{flexDirection: "column"}}>
            <Text style={styles.numeroDestaqueWhite}> 03:57 </Text>
            <Text style={styles.titulo2White}> Horas Trabalhadas </Text>
          </View>

          <View style={{flexDirection: "column"}}>
            <Text style={styles.numeroDestaqueWhite}> 06:03 </Text>
            <Text style={styles.titulo2White}> Tempo Restante </Text>
          </View>
        </View>


      </View>
    )
  }
}

class Registro {
  
  hora = null;
  tipo = null;

  constructor(tipo){
    this.hora = Date.now();
    this.tipo = tipo;
  }

  getHora(){
    return this.hora;
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {

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
})
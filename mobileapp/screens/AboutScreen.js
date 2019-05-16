import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  SectionList,
  View,
  Dimensions, TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Styles from '../assets/styles/mainStyle';

export default class AboutScreen extends React.Component {
  static navigationOptions = {
    drawerLabel: 'Sobre',
    header: {}
  };

  aspX = Styles.Constants.aspX;
  aspY = Styles.Constants.aspY;

  render() {
    return (
      <View style={Styles.container.container}>

          {/** Menu Icon */}
          <Ionicons
            onPress={() => { this.props.navigation.openDrawer(); }}
            style={{
              justifyContent: 'flex-start',
              backgroundColor: 'rgba(255,255,255,0)',
              alignItems: 'flex-start',
              alignSelf: "flex-start",
              marginHorizontal: 10,
            }}
            name="ios-menu" size={32} color="#232323"
          />
        <ScrollView contentContainerStyle={{ alignItems: "flex-start" }} style={{ width: Styles.widthScreen, height: Styles.heightScreen * 0.9 }}>
          <View>

            <SectionList
              contentContainerStyle={{
                alignItems: "flex-start"
              }}
              style=
              {{
                marginTop: 0 * this.aspY, 
                marginBottom: 0 * this.aspY, 
                margin: 0, marginLeft: 0, 
                padding: 0,
              }}
              renderItem={
                ({ item, index, section }) =>
                  (
                    <Text
                      style={[
                        styles.paragraphText,
                        {

                        }
                      ]} key={index}>{item}
                    </Text>
                  )
              }
              renderSectionHeader={
                ({ section: { title } }) => (
                  <Text
                    style={[
                      styles.titles,
                    ]}>{title}
                  </Text>
                )
              }
              sections={[
                {
                  title: "O que é?", data: [
                    "A aplicação GREat ID visa o desenvolvimento de um sistema de controle de frequência de funcionários por meio de um crachá inteligente.",
                    "Esse crachá irá dispor de um sensor RFID que ao ser detectado no ato de ingresso ao local de trabalho irá registrar a informação de presença do usuário.",
                    "O sistema, a partir desse registro, irá gerenciar as horas trabalhadas até o final do expediente."
                  ]
                },
                {
                  title: "Grupo de Pesquisa e Apoio", data: [
                    "\u2022 GREat - Grupo de Redes de Computadores, Engenharia de Software e Sistemas",
                    "\u2022 UFC - Universidade Federal do Ceará",
                    "\u2022 MDCC - Mestrado e Doutorado em Ciência da Computação",
                    "\u2022 Departamento de Computação"
                  ]
                },
                {
                  title: "Desenvolvido por:", data: [
                    "\u2022 Pedro Almir Martins de Oliveira",
                    "\u2022 Rubens Anderson de Sousa Silva",
                    "\u2022 Joseane de Oliveira Vale Paiva",
                    "\u2022 Michael Ferreira de Sousa",

                  ]
                },
                {
                  title: "Contato:", data: [
                    "\u2022 rubenssilva@great.ufc.br",

                  ]
                },

              ]}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 22,
  },
  padraoContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  padraoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
    padding: 15,
  },
  paragraphText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24 * this.aspY,
    textAlign: 'left',
    paddingBottom: 5 * this.aspY,
    paddingTop: 15 * this.aspY,
    marginTop: 15 * this.aspY,
    margin: 10,
    paddingBottom: 15 * this.aspY,
    paddingHorizontal: 10
  },
  titles: {
    fontSize: 22,
    padding: 15,
    color: 'rgba(10,10,10, 1)',
    textAlign: 'left',
    borderColor: '#e3e3e3',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    width: Styles.widthScreen,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 0,
  },
  
});

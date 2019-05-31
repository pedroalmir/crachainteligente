import React, { Component } from 'react'

import { StyleSheet, SectionList, ScrollView, TouchableOpacity, TouchableHighlight, Platform, Image, Text, View } from 'react-native'

import { w, h, totalSize } from '../api/Dimensions';
import { Ionicons } from '@expo/vector-icons';
import Styles from '../assets/styles/mainStyle';
import { LinearGradient } from 'expo';

import firebase from '../api/MyFirebase'

/**
 * Precisa de uma função que recebe os registros e gera os meses em que ele trabalhou 
 *  ela tambem gera para cada mes um json com a carga horaria trabalhada por dia para cada dia
 */

export default class ProfileScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isRegister: true,
            user: {
                info:{
                  name: "Terry Crews",
                  email: "terry.crews@great.ufc.br",
                  pic: require("../../assets/person.jpg"),
                  role: "Analista de Sistemas",
                  chDaily: 8,
                  chMonthly: 44,
                  lastAction: "output"
                },
                registers: [],
              },
        };
    }

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

    componentDidMount() {
        //const {currentUser} = global.firebase.auth()
        const user = firebase.getUser()
        newUser = {
            id: 1,
            info: {
                email: user.email,
                pic: require("../assets/person.jpg"),
                cargo: "Analista de Sistemas",
                nome: user.displayName,
                chDiaria: 8,
                chMensal: 44,
            },
            registers: ["10/05/2019 17:20:15"],
        }

        this.setState({user:newUser})
    }

    render() {
        const { currentUser } = this.state;
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
                        name="ios-menu" size={32} color="#fefefe"
                    />

                    <Image style={{
                        width: Styles.fWidth(140),
                        height: Styles.fHeight(140),
                        borderRadius: Styles.fWidth(140 / 2),
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 10
                    }}
                        source={this.state.user.info.pic}
                    />

                    <Text style={styles.titulo1White}> {this.state.user.info.nome}</Text>
                    <Text style={styles.titulo2White}> {this.state.user.info.cargo}</Text>

                </LinearGradient>

                <View style={{ padding: 10 }}>

                    {/** SECTION List Com os registros do funcionario */}

                    <ScrollView style={{
                        height: h(55), marginTop: 0,
                        paddingHorizontal: 15,
                        marginBottom: 15,
                    }}>

                        <View style={{
                            fontSize: 18,
                            color: Styles.color.cinzaClaro,
                            padding: 5,
                            width: Styles.Constants.baseWidth,
                        }}>
                            <Text>
                                Email
                            </Text>
                        </View>
                        {/** Input */}

                        <View style={{ width: w(80), padding: 5, borderBottomColor: Styles.color.cinzaClaro, borderBottomWidth: 1 }}>
                            <Text
                                style={{ fontSize: 18, color: Styles.color.cinza, marginHorizontal: 20 }}>
                                {this.state.user.info.email}
                            </Text>
                        </View>

                        <View style={{
                            fontSize: 18,
                            color: Styles.color.cinzaClaro,
                            padding: 5,
                            width: Styles.Constants.baseWidth,
                        }}>
                            <Text>
                                Carga Horária Diária
                            </Text>
                        </View>
                        <View style={{ width: w(80), padding: 5, borderBottomColor: Styles.color.cinzaClaro, borderBottomWidth: 1 }}>
                            <Text
                                style={{ fontSize: 18, color: Styles.color.cinza, marginHorizontal: 20 }}>
                                {this.state.user.info.chDiaria} Horas
                            </Text>
                        </View>

                        <View style={{
                            fontSize: 18,
                            color: Styles.color.cinzaClaro,
                            padding: 5,
                            width: Styles.Constants.baseWidth,
                        }}>
                            <Text>
                                Carga Horária Mensal
                            </Text>
                        </View>
                        <View style={{ width: w(80), padding: 5, borderBottomColor: Styles.color.cinzaClaro, borderBottomWidth: 1 }}>
                            <Text
                                style={{ fontSize: 18, color: Styles.color.cinza, marginHorizontal: 20 }}>
                                {this.state.user.info.chMensal} Horas
                            </Text>
                        </View>


                    </ScrollView>

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
        fontSize: 35,


    },
    buttonView: {
        width: '85%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#888',
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


const handleTimerComplete = () => alert("custom completion function");

const options = {
    container: {
        padding: 5,
        borderRadius: 5,
    },
    text: {
        fontSize: 40,
        color: '#FFF',
        marginLeft: 7,
    }
};
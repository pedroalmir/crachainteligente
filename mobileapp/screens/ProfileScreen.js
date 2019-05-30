import React, { Component } from 'react'

import { StyleSheet, SectionList, ScrollView, TouchableOpacity, TouchableHighlight, Platform, Image, Text, View } from 'react-native'

import { w, h, totalSize } from '../api/Dimensions';
import { Ionicons } from '@expo/vector-icons';
import Styles from '../assets/styles/mainStyle';
import { LinearGradient } from 'expo';

export default class ProfileScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            isRegister: true,
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
                        width: 140,
                        height: 140,
                        borderRadius: 140 / 2,
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 10
                    }}
                        source={require("../assets/person.jpg")}
                    />

                    <Text style={styles.titulo1White}> Terry Crews</Text>
                    <Text style={styles.titulo2White}> Analista de Sistemas</Text>

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
                                terry.crews@great.ufc.br
                            </Text>
                        </View>


                    </ScrollView>


                    {/** Botao de fazer check-in 
          <TouchableOpacity
            onPress={this.setTextButton}
            style={styles.buttonView}
            activeOpacity={0.6}
          >
            <Text style={styles.textButton}>{this.state.textButton}</Text>
          </TouchableOpacity>
        */}
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
import React, { Component } from 'react'

import { StyleSheet, ToastAndroid, TextInput, SectionList, ScrollView, TouchableOpacity, TouchableHighlight, Platform, Image, Text, View } from 'react-native'

import { w, h, totalSize } from '../api/Dimensions';
import { Ionicons } from '@expo/vector-icons';
import Styles from '../assets/styles/mainStyle';
import { LinearGradient } from 'expo';

import firebase from '../api/MyFirebase'
import InputField from '../components/InputField';

/**
 * Precisa de uma função que recebe os registros e gera os meses em que ele trabalhou 
 *  ela tambem gera para cada mes um json com a carga horaria trabalhada por dia para cada dia
 */

export default class ProfileScreen extends Component {
    static navigationOptions = {
        header: null,
    };

    line = "______________________________";

    constructor(props) {
        super(props);
        this.state = {
            hasChanged: false,
            currentUser: null,
            isRegister: true,

            name: "Terry Crews",
            phone: "8588776655",
            email: "terry.crews@great.ufc.br",
            pic: require("../assets/person.png"),
            role: "Analista de Sistemas",
            chDaily: 8,
            chMonthly: 44,
            lastAction: "output",

            editEmail: false,
            editName: false,
            editChDaily: false,
            editChMonthly: false,
            editRole: false,

            isEmailCorrect: true,
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
        console.log(this.line)
        this.syncUser();
    }

    syncUser = async () => {
        firebase.readInfo().then(value => {
            console.log("Loading User in Profile:", value);
            this.setState({
                name: value.name,
                phone: value.phone,
                email: value.email,
                pic: value.pic? value.pic: require("../assets/person.png"),
                role: value.role,
                chDaily: value.chDaily,
                chMonthly: value.chMonthly,
                isLoadingUser: false
            })
        }).catch(error => {
            ToastAndroid.showWithGravityAndOffset('Não foi possível acessar o banco de dados. Por favor, reinicie a aplicação', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            console.log(error);
        })

    }

    changeInputFocus = name => () => {
        switch (name) {
            case 'Name':
                this.setState({ isNameCorrect: this.name.getInputValue() === '' });
                break;
            case 'chDaily':
                this.setState({ ischDailyCorrect: this.email.getInputValue() === '' });
                break;
            case 'chMonthly':
                this.setState({ ischMonthlyCorrect: this.email.getInputValue() === '' });
                break;
            case 'Phone':
                this.setState({ isPhoneCorrect: this.email.getInputValue() === '' });
                break;
            case 'Role':
                this.setState({
                    isRoleCorrect: this.role.getInputValue() === '',
                });
                break;
        }
    };

    /**
     * Callback for submit button. Must have a confirmation before
     */
    submitButton = () => {
        if (this.state.hasChanged) {

            firebase.updateInfo({
                name: this.state.name,
                email: this.state.email,
                role: this.state.role,
                phone: this.state.phone,
                chDaily: this.state.chDaily,
                chMonthly: this.state.chMonthly,
                pic: this.state.pic,
            }).then(result => {
                ToastAndroid.showWithGravityAndOffset('Informações Atualizadas!', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            }).catch(error => {
                console.log("erro ao submeter", error);
            });

        }
    }

    render() {
        //const { currentUser } = this.state;
        //console.log(global.firebase.auth())

        return (
            <View style={{ flex: 1 }}>
                {
                    this.state.isLoadingRegisters || this.state.isLoadingUser
                        ?
                        <View style={{ alignItems: "center", justifyContent: 'center', flex: 1 }}>
                            <ActivityIndicator size="large" style={[styles.spinner, { alignSelf: "center" }]} color='black' />
                        </View>

                        :
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
                                    source={this.state.pic ? this.state.pic : require('../assets/person.png')}
                                />

                                <Text style={styles.titulo1White}> {this.state.name}</Text>
                                <Text style={styles.titulo2White}> {this.state.role}</Text>

                            </LinearGradient>

                            <View style={{ padding: 10 }}>

                                {/** SECTION List Com os registros do funcionario */}

                                <ScrollView style={{
                                    height: h(55), marginTop: 0,
                                    paddingHorizontal: 15,
                                    marginBottom: 15,
                                }}>


                                    {/**  linha EMAIL  */}

                                    <View style={styles.tituloSection}>
                                        <Text> Email </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => { }}
                                        editable={false}
                                        value={this.state.email}
                                    />



                                    {/**  linha PHONE  */}

                                    <View style={styles.tituloSection}>
                                        <Text> Telefone </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => { this.setState({ phone: text, hasChanged: true }) }}
                                        value={this.state.phone}
                                    />



                                    {/**  linha ROLE  */}
                                    <View style={styles.tituloSection}>
                                        <Text> Cargo </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => { this.setState({ role: text, hasChanged: true }) }}
                                        value={this.state.role}
                                    />




                                    {/**  linha CHD  */}

                                    <View style={styles.tituloSection}>
                                        <Text> Carga Horária Diária </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => { this.setState({ chDaily: text, hasChanged: true }) }}
                                        value={this.state.chDaily}
                                    />



                                    {/**  linha CHM  */}

                                    <View style={styles.tituloSection}>
                                        <Text> Carga Horária Mensal </Text>
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={(text) => { this.setState({ chMonthly: text, hasChanged: true }) }}
                                        value={this.state.chMonthly}
                                    />



                                    {/** BOTAO DE SUBMETER TUDO */}
                                    <TouchableOpacity
                                        onPress={this.submitButton}
                                        style={styles.buttonView}
                                        activeOpacity={0.6}
                                    >
                                        <Text>
                                            Atualizar Cadastro
                                        </Text>
                                    </TouchableOpacity>


                                </ScrollView>

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
    tituloSection: {
        fontSize: 18,
        color: Styles.color.cinzaClaro,
        padding: 5,
        width: Styles.Constants.baseWidth,
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
        backgroundColor: '#fff',
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
    input: {
        marginVertical: h(1.4),
        backgroundColor: '#e3e3e3',
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
import React, { Component } from 'react'

import { StyleSheet, ToastAndroid, SectionList, ScrollView, TouchableOpacity, TouchableHighlight, Platform, Image, Text, View } from 'react-native'

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

    constructor(props) {
        super(props);
        this.state = {
            hasChanged: false,
            currentUser: null, 
            isRegister: true,

            name: "Terry Crews",
            email: "terry.crews@great.ufc.br",
            pic: require("../assets/person.jpg"),
            role: "Analista de Sistemas",
            chDaily: 8,
            chMonthly: 44,
            lastAction: "output", 

            editEmail: false,
            editName: false,
            editChDaily: false,
            editChMonthly: false,
            editRole: false,
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
        const user = firebase.readInfo();

        this.setState({
            email: user.email,
            pic: require("../assets/person.jpg"), // ainda nao sei como mudar a foto do cara
            role: user.info.role ? user.info.role : "Não definido",
            name: user.name,
            chDaily: user.chDaily ? user.chDaily : 8,
            chMonthly: user.chMonthly ? user.chMonthly : 44,
        })
    }

    /**
     * Callback for submit button. Must have a confirmation before
     */
    submitButton = () => {
        if(this.state.hasChanged){

            firebase.updateInfo({
                name:this.state.name,
                role:this.state.role,
                chDaily:this.state.chDaily,
                pic:this.state.pic,
                chMonthly:this.state.chMonthly,
            });
            ToastAndroid.showWithGravityAndOffset('Informações Atualizadas!', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            this.props.navigation.navigate('Home');
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
                        source={this.state.pic}
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

                        {/**  VIEW DO EMAIL  */}
                        <View style={{ flexDirection: "row", width: w(80), padding: 5, borderBottomColor: Styles.color.cinzaClaro, borderBottomWidth: 1 }}>
                            <TextInput
                                style={{
                                    marginVertical: h(1.4),
                                    backgroundColor: '#e3e3e3',
                                    fontSize: 18, color: Styles.color.cinza, marginHorizontal: 20,
                                }}
                                editable={this.state.editEmail}
                                placeholderTextColor={'black'}
                                onChangeText={text => this.setState({ email: text })}
                                onBlur={this.setState({editEmail: false})}
                                value={this.state.email}
                            />
                            <TouchableOpacity
                                onPress={this.setState({hasChanged:true, editEmail: true})}
                                style={this.Styles.button.RoundButtonBlue}
                                activeOpacity={0.6}
                            >
                                Edit
                            </TouchableOpacity>
                        </View>
                        
                        
                        {/**  linha ROLE  */}
                        <View style={styles.tituloSection}>
                            <Text> Cargo </Text>
                        </View>

                        {/**  VIEW DO ROLE  */}
                        <View style={{ flexDirection: "row", width: w(80), padding: 5, borderBottomColor: Styles.color.cinzaClaro, borderBottomWidth: 1 }}>
                            <TextInput
                                style={{
                                    marginVertical: h(1.4),
                                    backgroundColor: '#e3e3e3',
                                    fontSize: 18, color: Styles.color.cinza, marginHorizontal: 20,
                                }}
                                editable={this.state.editRole}
                                placeholderTextColor={'black'}
                                onChangeText={text => this.setState({ role: text })}
                                onBlur={this.setState({editRole: false})}
                                value={this.state.role}
                            />
                            <TouchableOpacity
                                onPress={this.setState({hasChanged:true, editRole: true})}
                                style={this.Styles.button.RoundButtonBlue}
                                activeOpacity={0.6}
                            >
                                Edit
                            </TouchableOpacity>
                        </View>
                        
                        
                        
                        {/**  linha CHD  */}

                        <View style={styles.tituloSection}>
                            <Text> Carga Horária Diária </Text>
                        </View>

                        {/**  VIEW DO CHD  */}
                        <View style={{ flexDirection: "row", width: w(80), padding: 5, borderBottomColor: Styles.color.cinzaClaro, borderBottomWidth: 1 }}>
                            <TextInput
                                style={{
                                    marginVertical: h(1.4),
                                    backgroundColor: '#e3e3e3',
                                    fontSize: 18, color: Styles.color.cinza, marginHorizontal: 20,
                                }}
                                editable={this.state.editChDaily}
                                placeholderTextColor={'black'}
                                onChangeText={text => this.setState({ chDaily: text })}
                                onBlur={this.setState({editChDaily: false})}
                                value={this.state.chDaily}
                            />
                            <TouchableOpacity
                                onPress={this.setState({hasChanged:true, editChDaily: true})}
                                style={this.Styles.button.RoundButtonBlue}
                                activeOpacity={0.6}
                            >
                                Edit
                            </TouchableOpacity>
                        </View>
                        
                        
                        
                        {/**  linha CHM  */}

                        <View style={styles.tituloSection}>
                            <Text> Carga Horária Mensal </Text>
                        </View>

                        {/**  VIEW DO CHM  */}
                        <View style={{ flexDirection: "row", width: w(80), padding: 5, borderBottomColor: Styles.color.cinzaClaro, borderBottomWidth: 1 }}>
                            <TextInput
                                style={{
                                    marginVertical: h(1.4),
                                    backgroundColor: '#e3e3e3',
                                    fontSize: 18, color: Styles.color.cinza, marginHorizontal: 20,
                                }}
                                editable={this.state.editChMonthly}
                                placeholderTextColor={'black'}
                                onChangeText={text => this.setState({ chMonthly: text })}
                                onBlur={this.setState({editChMonthly: false})}
                                value={this.state.chMonthly}
                            />
                            <TouchableOpacity
                                onPress={this.setState({hasChanged:true, editChMonthly: true})}
                                style={this.Styles.button.RoundButtonBlue}
                                activeOpacity={0.6}
                            >
                                Edit
                            </TouchableOpacity>
                        </View>


                        {/** BOTAO DE SUBMETER TUDO */}
                        <TouchableOpacity
                            onPress={this.submitButton}
                            style={buttonView}
                            activeOpacity={0.6}
                        >
                            Atualizar Cadastro
                        </TouchableOpacity>


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
    tituloSection:{
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
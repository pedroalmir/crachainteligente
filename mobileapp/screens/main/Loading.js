import React, { Component } from 'react';
import { StyleSheet, ToastAndroid, ActivityIndicator, View } from 'react-native';
import PropTypes from 'prop-types';
import { w, h, totalSize } from "../../api/Dimensions";
import Main from './Main';
import firebase from "../../api/MyFirebase"



export default class Loading extends Component {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            user: null
        }
    }

    componentDidMount() {
        console.log("....loading....")
        this.syncUser();
    }

    syncUser = async () => {
        firebase.readInfo().then(value => {
            console.log("Loading :", value);
            this.setState({user: value, isLoading: false})
        }).catch(error => {
            ToastAndroid.showWithGravityAndOffset('Não foi possível acessar o banco de dados. Por favor, reinicie a aplicação', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            console.log(error);
        })

    }

    render() {
        return (
            <View style={{ alignContent: "center", justifyContent: 'center' }}>
                {this.state.isLoading
                    ? <ActivityIndicator size="large" style={[styles.spinner, { alignSelf: "center" }]} color='black' />
                    : <Main user={this.state.user} />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        width: w(85),
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        paddingVertical: w(2),
        borderRadius: w(10),
        borderColor: '#E0E0E0',
        borderWidth: 1,
        marginTop: h(4),
    },
    spinner: {
        height: h(5),
    },
    text: {
        color: '#5f5f5f',
        fontWeight: '600',
        paddingVertical: h(1),
        fontSize: totalSize(2.2),
    }
});
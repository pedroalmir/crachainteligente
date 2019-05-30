import React from 'react';
import {
    StyleSheet,
    Text,
    SectionList,
    View,
    Dimensions,
    TouchableOpacity,
    KeyboardAvoidingView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Bar from './charts/Bars';

import RadioForm, {
    RadioButton,
    RadioButtonInput,
    RadioButtonLabel
} from 'react-native-simple-radio-button';

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit'

import Styles from '../assets/styles/mainStyle';
import { w, h, totalSize } from '../api/Dimensions';

export default class ReportScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    radio_props = [
        { label: 'param1', value: 0 },
        { label: 'param2', value: 1 }
    ];

    render() {
        return (
            <KeyboardAvoidingView>
                {/** Menu Icon */}
                <Ionicons
                    onPress={() => { this.props.navigation.openDrawer(); }}
                    style={{
                        justifyContent: 'flex-start',
                        backgroundColor: 'rgba(255,255,255,0)',
                        alignItems: 'flex-start',
                        alignSelf: "flex-start",
                        marginHorizontal: 10,
                        marginTop: Styles.Constants.statusbarMargin,
                    }}
                    name="ios-menu" size={32} color="#232323"
                />

                <Bar data={[]} /> 

                <Text> Gerar Relatório:</Text>
                {/** RadioButtons */}
                <RadioForm
                    formHorizontal={true}
                    animation={true}
                >
                    {/* 
                    To create radio buttons, loop through your array of options 
                    {radio_props.map((obj, i) => {
                        <RadioButton labelHorizontal={true} key={i} >
                            <RadioButtonInput
                                obj={obj}
                                index={i}
                                isSelected={this.state.value3Index === i}
                                onPress={onPress}
                                borderWidth={1}
                                buttonInnerColor={'#e74c3c'}
                                buttonOuterColor={this.state.value3Index === i ? '#2196f3' : '#000'}
                                buttonSize={40}
                                buttonOuterSize={80}
                                buttonStyle={{}}
                                buttonWrapStyle={{ marginLeft: 10 }}
                                />
                            <RadioButtonLabel
                                obj={obj}
                                index={i}
                                labelHorizontal={true}
                                onPress={onPress}
                                labelStyle={{ fontSize: 20, color: '#2ecc71' }}
                                labelWrapStyle={{}}
                                />
                        </RadioButton>
                    })}
                            */}

                </RadioForm>
                {/** Charts 
                <BarChart
                    data={{
                        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
                        datasets: [{
                            data: [
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100,
                                Math.random() * 100
                            ]
                        }]
                    }}
                    width={Dimensions.get('window').width} // from react-native
                    height={220}
                    yAxisLabel={'$'}
                    chartConfig={{
                        backgroundColor: Styles.color.cinza,
                        backgroundGradientFrom: Styles.color.main,
                        backgroundGradientTo: Styles.color.secondary,
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 16
                    }}
                />
*/}
                {/** Resumo de Horas */}

            </KeyboardAvoidingView>
        );
    }
}
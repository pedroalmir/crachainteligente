import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { w, h, totalSize } from '../../api/Dimensions';

import * as shape from 'd3-shape'

import { BarChart, Grid } from 'react-native-svg-charts'

export default class Bars extends Component {

    render() {

        const data = [
            {
                month: new Date(2015, 0, 1),
                apples: 3840,
                bananas: 1920,
                cherries: 960,
                dates: 400,
            },
            {
                month: new Date(2015, 1, 1),
                apples: 1600,
                bananas: 1440,
                cherries: 960,
                dates: 400,
            },
            {
                month: new Date(2015, 2, 1),
                apples: 640,
                bananas: 960,
                cherries: 3640,
                dates: 400,
            },
            {
                month: new Date(2015, 3, 1),
                apples: 3320,
                bananas: 480,
                cherries: 640,
                dates: 400,
            },
        ]

        const colors = ['#8800cc', '#aa00ff', '#cc66ff', '#eeccff']
        const keys = ['apples', 'bananas', 'cherries', 'dates']
        const svgs = [
            { onPress: () => console.log('apples') },
            { onPress: () => console.log('bananas') },
            { onPress: () => console.log('cherries') },
            { onPress: () => console.log('dates') },
        ]
        const fill = 'rgb(134, 65, 244)'
        const data2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
        const data3 = [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
        const keys2 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
        const keys3 = ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']

        const CUT_OFF = 50
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Text
                    key={index}
                    x={value > CUT_OFF ? x(0) + 10 : x(value) + 10}
                    y={y(index) + (bandwidth / 2)}
                    fontSize={14}
                    fill={value > CUT_OFF ? 'white' : 'black'}
                    alignmentBaseline={'middle'}
                >
                    {value}
                </Text>
            ))
        )
        return (
            <View style={{flexDirection: 'row'}}>

                <BarChart
                    style={{ height: 500, width:200, padding: 10 }}
                    data={data2}
                    keys={keys2}
                    horizontal={true}
                    svg={{ fill }}
                    contentInset={{ top: 30, bottom: 30 }}
                >
                    <Grid direction={Grid.Direction.HORIZONTAL} />
                    <Labels />
                </BarChart>
                <BarChart
                    style={{ height: 500, width:200, padding: 10 }}
                    data={data3}
                    keys={keys3}
                    horizontal={true}
                    svg={{ fill }}
                    contentInset={{ top: 30, bottom: 30 }}
                >
                    <Grid direction={Grid.Direction.HORIZONTAL} />
                    <Labels />
                </BarChart>
            </View>
        )
    }
}

Bars.propTypes = {
    data: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
    button: {
        width: '85%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: w(2),
        backgroundColor: '#888',
        borderRadius: w(10),
        marginTop: h(8),
    },
    text: {
        color: 'white',
        fontWeight: '700',
        paddingVertical: h(1),
        fontSize: totalSize(2.1),
    },
    spinner: {
        height: h(5),
    },
});
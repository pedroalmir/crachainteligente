
import React, { Component } from 'react';
import {
    View
} from 'react-native';

export default class drawer extends Component {
    
    render() {
        return (
            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                <TouchableOpacity
                    onPress={() => { this.props.navigation.openDrawer(); }}
                >
                    <Image source={require('../assets/menu.png')}
                        style={Styles.image.iconToolbar}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}
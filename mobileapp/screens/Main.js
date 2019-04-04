import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'

export default class Main extends React.Component {
  state = { currentUser: null }

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
    this.setState({currentUser})
  }

    render() {
      const { currentUser } = this.state
      //console.log(global.firebase.auth())

      return (
        <View style={styles.container}>
          <Text>Hi {currentUser && currentUser.email}!</Text>
          <Button
          title="Logout"
          onPress={this.logout.bind(this)}
        />
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
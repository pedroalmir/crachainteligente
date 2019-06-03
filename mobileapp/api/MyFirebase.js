import firebase from "firebase";
import { ToastAndroid } from 'react-native'

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCKwsKKLVFvBNR2Vy29YyIJBcPYQVxVdVE",
  authDomain: "crachainteligence.firebaseapp.com",
  databaseURL: "https://crachainteligence.firebaseio.com/",
  storageBucket: "crachainteligence.appspot.com"
};

String.prototype.hashCode = function () {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

firebase.initializeApp(config);

class MyFirebase {

  email;

  /**
   * Updates the new Info to the database
   * @param {*} info 
   */
  updateInfo(info) {

    this.email = info.email;

    firebase.database().ref(this.email.hashCode() + '/info').update({

      email: info.email,
      name: info.name,
      lastAction: info.lastAction,
      chDaily: info.chDaily,
      chMonthly: info.chMonthly,
      pic: info.pic,
      phone: info.phone,
      role: info.role,

    });
  }


  /**
   * Returns the info from firebase
   * @param {*} email 
   */
  readInfo() {
    firebase.database().ref(this.email.hashCode() + '/info').once('value', function (snapshot) {
      console.log("readInfo:", snapshot)
      return snapshot;
    }).catch(err => {
      console.log("na readInfo: ",err)
    })
  }


  /**
   * Returns all the registers from firebase
   * @param {*} email 
   */
  readRegisters() {
    firebase.database().ref(this.email.hashCode() + '/registers').once('value', function (snapshot) {
      return snapshot;
    });
  }


  /**
   * Saves the new register to the database (not optimal)
   * @param {*} info 
   */
  updateRegister(reg) {

    // this must be huge... =(
    registers = this.readRegisters()
    registers.push(reg)

    firebase.database().ref(this.email.hashCode() + '/').update({

      registers: registers

    })
  }



  // PRE ME




  userLogin = (email, password) => {
    this.email = email;
    return new Promise(resolve => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              ToastAndroid.showWithGravityAndOffset('Invalid email address format.', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
              break;
            case 'auth/user-not-found':
              ToastAndroid.showWithGravityAndOffset('User not found', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
              break;
            case 'auth/wrong-password':
              ToastAndroid.showWithGravityAndOffset('Invalid email address or password', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
              break;
            default:
              ToastAndroid.showWithGravityAndOffset('Check your internet connection', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          }
          resolve(null);
        }).then(user => {
          if (user) {
            //nesse trecho temos acesso aos dados do usuario
            //user2see = user.user.providerData[0]
            //console.log(user2see)
            resolve(user);
          }
        });
    })
  };

  createFirebaseAccount = (name, email, password) => {
    this.email = email;

    return new Promise(resolve => {
      firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            ToastAndroid.showWithGravityAndOffset('This email address is already taken', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            break;
          case 'auth/invalid-email':
            ToastAndroid.showWithGravityAndOffset('Invalid e-mail address format', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            break;
          case 'auth/weak-password':
            ToastAndroid.showWithGravityAndOffset('Password is too weak', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
            break;
          default:
            ToastAndroid.showWithGravityAndOffset('Check your internet connection', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
        }
        console.log("deu errado!")
        resolve(false);
        return false;
      }).then(info => {       

        if (info) {
          firebase.auth().currentUser.updateProfile({
            displayName: name
          });

          firebase.database().ref().child(email.hashCode()).child('info').set({
            email: email,
            name: name
          });

          console.log("Update and save")
          resolve(true);
          return true;
        }
        resolve(false);
      });
    });
  };
  
  sendEmailWithPassword = (email) => {
    return new Promise(resolve => {
      firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
          ToastAndroid.showWithGravityAndOffset('Email with new password has been sent', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          resolve(true);
        }).catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              ToastAndroid.showWithGravityAndOffset('Invalid email address format', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
              break;
            case 'auth/user-not-found':
              ToastAndroid.showWithGravityAndOffset('User with this email does not exist', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
              break;
            default:
              ToastAndroid.showWithGravityAndOffset('Check your internet connection', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          }
          resolve(false);
        });
    })
  };

}

export default new MyFirebase();
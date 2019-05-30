import firebase from "firebase";
import {ToastAndroid} from 'react-native'

// Initialize Firebase
const config = {
  apiKey: "AIzaSyCKwsKKLVFvBNR2Vy29YyIJBcPYQVxVdVE",
  authDomain: "crachainteligence.firebaseapp.com",
  databaseURL: "https://crachainteligence.firebaseio.com/",
  storageBucket: "crachainteligence.appspot.com"
};

firebase.initializeApp(config);

class MyFirebase {

  userLogin = (email, password) => {
    return new Promise(resolve => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .catch(error => {
          switch (error.code) {
            case 'auth/invalid-email':
              ToastAndroid.showWithGravityAndOffset('Invalid email address format.', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
              break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              ToastAndroid.showWithGravityAndOffset('Invalid email address or password', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
              break;
            default:
              ToastAndroid.showWithGravityAndOffset('Check your internet connection', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          }
          resolve(null);
        }).then(user => {
        if (user) {
          //console.log(user)
          resolve(user);
        }
      });
    })
  };

  createFirebaseAccount = (name, email, password) => {
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
        resolve(false);
      }).then(info => {
        if (info) {
          firebase.auth().currentUser.updateProfile({
            displayName: name
          });
          resolve(true);
        }
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
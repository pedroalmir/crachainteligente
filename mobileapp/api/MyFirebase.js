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

  alwaysUpdateUser() {
    firebase.database().ref(this.email.hashCode() + '/registers').on('value', function (snapshot) {
      console.log(snapshot.val())
    });
  }

  getRef() {
    return firebase.database().ref(this.email.hashCode() + '/registers');
  }



  /**
   * Updates the new Info to the database
   * @param {*} info 
   */
  updateInfo(info) {

    return new Promise(resolve => {

      firebase.database().ref(info.email.hashCode() + '/info').update({

        name: info.name,
        chDaily: info.chDaily,
        chMonthly: info.chMonthly,
        pic: info.pic,
        phone: info.phone,
        role: info.role,

      }).then(result => {
        resolve(true);
        console.log("dados atualizados");
      }).catch(error => {
        resolve(false);
        console.log("Erro dentro da updateInfo:", error)
      });
    })
  }
  getFormatedTime = () => {
    var fullData = new Date();

    // action: hh/mm/ss que será o value do today
    const hora = fullData.getHours() + ":" + fullData.getMinutes() + ":" + fullData.getSeconds();

    return hora;
  }

  getFormatedDate = () => {
    var fullData = new Date();

    // dd/mm/yy que sera inserida como chave
    mes = fullData.getMonth() + 1;
    mes = mes < 10? "0" + mes: mes;
    
    dia = fullData.getDate();
    dia = dia < 10? "0" + dia: dia;
    
    const today = dia + '/' + mes + '/' + fullData.getUTCFullYear() + " ";

    return today;
  }

  /**
   * Quando um registro é atualizado, é necessário atualizar a ultima ação do usuário
   */
  updateLastAction = (last) => {

    return new Promise(resolve => {

      firebase.database().ref(this.email.hashCode() + '/info').update({

        lastAction: last

      }).then(result => {
        resolve(true);
      }).catch(error => {
        resolve(false);
        console.log("dentro da updateLastAction:", error)
      });
    })
  }


  /**
   * Returns the info from firebase
   * @param {*} email 
   */
  readInfo() {

    return new Promise(resolve => {

      firebase.database().ref(this.email.hashCode() + '/info').once('value', function (snapshot) {
        resolve(snapshot.val())
      }).catch(err => {
        resolve(null)
        console.log("Erro na readInfo: ", err)
      })
    });
  }


  /**
   * Returns all the registers from firebase
   * @param {*} email 
   */
  readRegisters(today) {
    return new Promise(resolve => {

      firebase.database().ref(this.email.hashCode() + '/registers').once('value', function (snapshot) {
        resolve(snapshot.val())
      }).catch(err => {
        resolve(null)
        console.log("Erro na readRegisters: ", err)
      })
    });
  }


  /**
   * Saves the new register to the database
   * @param {*} reg 
   */
  updateRegister(reg) {
    return new Promise(resolve => {

      firebase.database().ref(this.email.hashCode() + '/registers')
        .push(reg)
        .then(result => {
          ToastAndroid.showWithGravityAndOffset('Registro Inserido', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
          console.log("registro atualizado")
          resolve(true);
        })
        .catch(err => {
          console.log("deu erro ao inserir registro:", err)
          resolve(false);
        });
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
            resolve(user);
          }
        });
    })
  };

  createFirebaseAccount = (name, email, password) => {
    this.email = email;

    return new Promise(resolve => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(info => {

          firebase.database().ref(email.hashCode()).set({
            info: {
              email: email,
              name: name,
              phone: "",
              pic: "",
              role: "Desconhecido",
              chDaily: 8,
              chMonthly: 44,
              lastAction: "output"
            },
            registers: []
          })
            .then(res => {
              firebase.auth().currentUser.updateProfile({
                displayName: name
              })
                .then(res => {
                  ToastAndroid.showWithGravityAndOffset('Usuário cadastrado com sucesso', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                  console.log("Usuario cadastrado!")
                  resolve(true);
                })
                .catch(err => {
                  console.log("Erro ao atualizar o nome do usuario", err);
                });
            })
            .catch(err => {
              console.log("erro ao cadastrar a info e registers", err)
              resolve(false);
            });
        })
        .catch(error => {
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
        })
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
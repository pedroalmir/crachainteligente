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
    return firebase.database().ref();
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
        console.log("dentro da updateInfo:", error)
      });
    })
  }
  getFormatedTime = () => {
    var fullData = new Date();

    // action: hh/mm/ss que será o value do today
    hora = fullData.getHours() + ":" + fullData.getMinutes() + ":" + fullData.getSeconds();

    return hora;
  }

  getFormatedDate = () => {
    var fullData = new Date();

    // dd/mm/yy que sera inserida como chave
    today = fullData.getDate() + '/' + fullData.getUTCMonth() + '/' + fullData.getUTCFullYear() + " ";

    return today;
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
    console.log("na readRegisters, today:", today);
    return new Promise(resolve => {
      /**
      var ref = firebase.database().ref(this.email.hashCode).child('registers');
      ref.orderByKey().once("value", function (snapshot) {
        console.log(snapshot.key, snapshot.val());
        resolve(snapshot.val())
      });
      firebase.database().ref(this.email.hashCode + '/registers').orderByValue().limitToLast(1).on("value", function (snapshot) {
        snapshot.forEach(function (data) {
          console.log("Key " + data.key + ", value " + data.val());
          resolve(data.val());
        });
      });

      firebase.database().ref().orderByChild(this.email.hashCode + '/registers')
        .startAt(today)
        .once('value', snapshot => {
          resolve(snapshot.val())
        }).catch(err => {
          resolve(null)
          console.log("Erro na readRegisters: ", err)
        })

        * 
       */
      firebase.database().ref(this.email.hashCode() + '/registers').once('value', function (snapshot) {
        console.log(snapshot)
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

    firebase.database().ref(this.email.hashCode() + '/registers')
      .push(reg)
      .then(result => {
        console.log("registro atualizado")
      })
      .catch(err => {
        console.log("deu erro ao inserir registro:", err)
      });


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
      }).then(info => {

        if (info) {
          // adicionando o username
          firebase.auth().currentUser.updateProfile({
            displayName: name
          }).then(res => {

            // criando a info do usuario
            firebase.database().ref(email.hashCode() + '/info').set({
              email: email,
              name: name,
              phone: "",
              pic: "",
              role: "Desconhecido",
              chDaily: 8,
              chMonthly: 44,
              lastAction: "output",
            }).then(res => {

              // criando os registros dele
              firebase.database().ref(email.hashCode()).set({
                registers: []
              }).then(res => {

                //por ultimo... sucesso!
                ToastAndroid.showWithGravityAndOffset('Usuário cadastrado com sucesso', ToastAndroid.LONG, ToastAndroid.BOTTOM, 25, 50);
                console.log("Update and save")
                resolve(true);
              })
                .catch(err => {
                  console.log("erro ao cadastrar os registros", err)
                  resolve(false);
                });

            }).catch(err => {
              console.log("erro ao cadastrar a info", err)
              resolve(false);
            });
          });
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
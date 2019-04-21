

export default class Registro {
  
  hora = null;
  tipo = null;

  constructor(tipo){
    this.hora = Date.now();
    this.tipo = tipo;
  }

  getHora(){
    return this.hora;
  }
  
}

// person.js
'use strict';

const Votaciones = require("../classes/Votaciones");

module.exports = class Partida {

    constructor() {
        this.jugadores = [];
        this.ganadoresPartida = "null";
        //No se ha puesto tipo de partida, pero se usa de la siguiente forma 0: basica, 1 avanzada, 2: personalizada.
        this.tipoPartida = -1; 
        //eventoSecuenciaActual prentende ir sumando para cambiar en las posiciones del array.
        this.estadoActual = "";
        this.secuenciaDia = [];
        this.secuenciaNoche = [];
        this.secuenciaEventoEspecial = [];
        this.temaEventoEspecial = "";
        this.tituloEventoEspecial = "";
        //-1 para estado de configuracion donde cuando se de comenzar y se hallan asignado roles entonces se cambiara a
        //0 que es un tiempo donde pueden ver su tarjeta y le dan a seguir a 
        //1 Que es la primera noche , luego se pasa al dia que seria 
        //2 y se seguiria el ciclo 1-2 hasta que se lleguen a las condiciones de ganar donde se pasa al estado donde se
        //Finaliza la partida  
        this.eventoSecuenciaActual = -1;
        this.readyToConfig = false;
        //El campo tiempo se refiere a si es de dia o de noche
        this.tiempo = "Noche";
        this.votaciones = new Votaciones();
        this.codigo = this.generarCodigo();
    }

    generarCodigo() {
        var codigo = Math.floor(Math.random() * 9000000) + 1000000;
        return codigo;
    }



}
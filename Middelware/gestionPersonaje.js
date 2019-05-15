const gestPersonaje = {};

var Partida = require("../classes/Partida");
var Jugador = require("../classes/Jugador");

gestPersonaje.agregarJugador = function(nombre, codigoPartida, partidas){

    var jugador = new Jugador(nombre);
    if (partidas[codigoPartida] != undefined) {
        partidas[codigoPartida].jugadores.push(jugador);
    } else {
        console.log("LA PARTIDA NO EXISTE.");
    }
    console.log("Jugador "+nombre+" Añadido");

}

gestPersonaje.obtenerJugadores = function(codigoPartida, partidas){
    return partidas[codigoPartida].jugadores;
}


module.exports = gestPersonaje;
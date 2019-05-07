'use strict';
var Partida = require("./classes/Partida");
var Jugador = require("./classes/Jugador");
var partidas = require("./app");

module.exports.añadirPartida = function añadirPartida() {
    var partida = new Partida();
    var nuevoCodigo = partida.codigo;
    partidas[nuevoCodigo] = partida;
    return nuevoCodigo;
}

module.exports.agregarJugador = function agregarJugador(nombre, codigoPartida) {
    var jugador = new Jugador(nombre);
    if (partidas[codigoPartida] != undefined) {
        partidas[codigoPartida].jugadores.push(jugador);
    } else {

    }
}

module.exports.obtenerJugadores = function obtenerJugadores(codigoPartida){
    return partidas[codigoPartida].jugadores;
}

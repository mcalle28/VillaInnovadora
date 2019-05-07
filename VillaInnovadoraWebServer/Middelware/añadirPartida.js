const gestPartidas = {};

var Partida = require("../classes/Partida");

gestPartidas.añadirPartida = function(partidas){

    var partida = new Partida();
    var nuevoCodigo = partida.codigo;
    partidas[nuevoCodigo] = partida;
    return nuevoCodigo;

}

module.exports = gestPartidas;
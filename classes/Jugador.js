'use strict';

const Carta = require("../classes/CardFactory");

module.exports = class Jugador {
   constructor(nombre) {
       this.nombre = nombre;
       this.estado = "vivo";
       this.vida = 1;
       this.aliados = [];
       this.dataExtra = {};
       //Este campo se usara para las personas que ganen proteccion por algun evento.
       this.protected = false;
       this.beenPostulated = false; 
       this.hasPostulated = false;
       //Este campo sirve como idea del jugador en eventos y tambien como justificacion cuando postule a un creaticida.
       this.idea = "";
       //Se usara solo en el juicio cuando este ya vote ene l juicio esta variable vuelve a ser falsa
       this.postuloIdeaJuicio = false;
       this.votesAgainst = 0;
       this.hasVoted = false;
       this.powerUsed = false;
       this.canVote = false; 
       this.carta = new Carta();
       this.powerUsedDescription = [];
   }
}
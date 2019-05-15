'use strict'

const Jugador = require("../classes/Jugador");

module.exports = class Votaciones{
    constructor(){
        this.postulados = [];
        this.ganador = "";
        this.conVotos = 0;
        this.empate = false;
        this.jugadoresEmpatados = [];
    }

    postularJugador(_jugadorNombre, _partidas, _codigo, _nombrePostulador){
        _partidas[_codigo].jugadores.forEach(e => {
            if(e.nombre == _jugadorNombre){
                this.postulados.push(e);
            }
            if(e.nombre == _nombrePostulador){
                e.hasPostulated = true;
            }
        });
    }

    conocerPostulados(){
        return this.postulados;
    }

    addVoto(_jugadorAVotar, _jugadorVotante){
        var _validation = false;
        this.postulados.forEach(element => {
            if(element.nombre == _jugadorAVotar){
                element.votesAgainst = element.votesAgainst + 1;
                _validation = true;
            }
        });
        return _validation;
    }

    conocerGanador(){
        this.postulados.forEach(element => {
            if(element.votesAgainst > this.conVotos){
                this.ganador = element.nombre;
                console.log(this.ganador);
                this.conVotos = element.votesAgainst;
                //Se hace con el proposito de que en el ultimo jugador no quede empatado si hubo dos jugadores antes que tuvieron un score igual.
                this.empate = false;
                this.jugadoresEmpatados = [];
            }else if(element.votesAgainst == this.conVotos){
                this.jugadoresEmpatados.push(element);
                this.jugadoresEmpatados.push(this.ganador);
                this.empate = true;
                this.ganador = this.ganador;
            }
        });

    }

    getGanador(){
        return this.ganador;
    }

    setPostulados(_jugadoresPostulados, _partidas, _codigo){
        _partidas[_codigo].jugadores.forEach(element => {
            if(_jugadoresPostulados.contains(element.nombre)){
                this.postulados.push(element);
            }
        });
    }

    reiniciarObjeto(){
        this.postulados = [];
        this.ganador = "";
        this.conVotos = 0;
        this.empate = false;
        this.jugadoresEmpatados = [];

    }
}
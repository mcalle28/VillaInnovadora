// person.js
'use strict';

module.exports = class Evento {
    
    constructor(){
    }

    factoryEvent(tipo){
    switch(tipo){
        case "llamadoIndeciso":
        return function(_jugadorIndeciso){ 
        return "Jugador Indeciso porfavor elige entre Creaticidas o Emprendedores";
        };
        case "llamadoMentor":
        //Jugador elegido:String, jugadorMentor: Jugador, Jugadores: Jugador[]
        return function(_jugadorElegido, _jugadorMentor, _jugadores){
            return "Jugador mentor, elige a una persona de la cual quieras conocer la identidad.";
        };
        //Se tiene en cuenta que se le ha permitido a todos votar
        case "momentoDeDecision":
        return function(partidas, codigoPartida){
            var masVotado = 0;
            var equalHelp;
            var jugador;
            partidas[codigoPartida].jugadores.forEach(e => {
                if(e.votesAgainst >= masVotado){
                    jugador = e;
                    masVotado = jugador.votesAgainst;
                }
            });
            if(jugador == undefined){
                console.log("No se pudo encontrar la persona mas votada de la crisis");
            }else{
                console.log("El estado debria decidir si se salva esta persona");
            } 
        };
        case "votacionParaGanarProteccion":
        return function(partidas, codigoPartida, postulados){
            for (let i = 0; i < partidas[codigoPartida].jugadores.length; i++) {
                for (let j = 0; j < partidas[codigoPartida].jugadores.length; j++) {
                    
                    if((partidas[codigoPartida].jugadores[i] == postulados [j])){
                       //Aqui ya se hicieron todas las votaciones, se procede a conocer cuantos votos tiene cada postulado y al ganador se le pone el campo de proteccion en true
                    }
                    
                }
                
            }
        };

        case "votacionParaRepresentante":
        return function(partidas, codigoPartida, postulados){

        }
    }
}
}
const gestVotacion = {};

/**
 * Este archivo se hace con el proposito de ayudar al controlador de votaciones, con el proposito de gestionar algunos aspecos operacionales internos.
 */

gestVotacion.conocerGanador = function(jugadores){
    let conVotos = 0;
    let ganador = "";
    let empate = false;
    let jugadoresEmpatados = [];

    jugadores.forEach(element => {
        if(element.votesAgainst > conVotos){
            ganador = element;
            conVotos = element.votesAgainst;
            //Se hace con el proposito de que en el ultimo jugador no quede empatado si hubo dos jugadores antes que tuvieron un score igual.
            empate = false;
            jugadoresEmpatados = [];
        }else if(element.votesAgainst == conVotos){
            jugadoresEmpatados.push(element);
            jugadoresEmpatados.push(ganador);
            empate = true;
            ganador = ganador;
        }
    });

    let data = {
        ganador: ganador,
        empate: empate,
        jugadoresEmpatados: jugadoresEmpatados
    }
    return data;
}

module.exports = gestVotacion;
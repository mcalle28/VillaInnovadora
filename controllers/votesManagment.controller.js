const partidaInGame = require("../modelsDB/partidaInGame");
const gestVotaciones = require("../Scripts/gestionVotacion");
const gestPoderes = require("../Scripts/gestionPoderes");

/**
 * Busca en la partida el jugador a postular y el jugador postulador y les pone las variables de postulacion necesarias en true.
 * Input: codigo, jugadorAPostular, jugadorPostulador
 * Output: message:(exito o error), error(solo si falla, info sobre el error), matchModified(resultado de guardar en la base de datos) 
 */
exports.postularPersona = (req, res, next) => {
    let _codigo = req.body.codigo;
    //Se usa el email para los jugadores
    let _jugadorAPostular = req.body.jugadorAPostular;
    let _jugadorPostulador = req.body.jugadorPostulador;

partidaInGame.findOne({codigo: _codigo})
.then(match => {
    gestVotaciones.postularPersona(match.jugadores, _jugadorAPostular, _jugadorPostulador);
    partidaInGame.findOneAndUpdate({_id: match._id}, match)
    .then(result => {
        res.status(200).json({
            message: "Se logro actualizar la partida con la postulacion",
            matchModified: result
        });
    })
    .catch(err => {
        res.status(404).json({
            message: "Hubo un error al actualizar la partida", 
            error: err
        });
    });
})
.catch(err => {
    res.status(404).json({
        message: "Hubo un error al encontrar la partida",
        error: err
    });
});
}

/**
 * Busca los el jugadorAPostualr en la partida y pone las variables de postulacion necesarias en true
* Input: codigo, jugadorPostulador
* Output: message:(exito o error),matchModified(exito), error(solo si falla, info sobre el error), matchModified(resultado de guardar en la base de datos) 
*/
exports.postulacionPropia = (req, res, next) => {

let _codigo = req.body.codigo;
let _jugadorAPostular = req.body.jugadorAPostular;

partidaInGame.findOne({codigo: _codigo})
.then(match => {
    match.jugadores.forEach(e => {
        if(e.email == _jugadorAPostular){
            e.beenPostulated = true;
            e.hasPostulated = true;
        }
    });
    partidaInGame.findOneAndUpdate({_id: match._id}, match)
    .then(matchModified => {
        res.status(200).json({
            message:"Se logro actualizar al jugador dentro de la partida", 
            matchModified: matchModified
        });
    })
    .catch(err => {
        res.status(404).json({
            message: "Hubo un error al actualizar la partida", 
            error: err
        });
    });
})
.catch(err => {
    res.status(404).json({
        message: "Hubo un error al encontrar la partida", 
        error: err
    });
});

}

/**
 * Busca una partida y obtiene los jugadores que han sido postulados
 * Input: codigo
 * Output: message:(exito o error), error(solo si falla, info sobre el error), postulados(arreglo con los jugadores postulados) 
 */

 //FALTA MEJORAR ESTE PARA QUE NO USE VOTACIONES SINO SOLO JGUADORES
exports.obtenerPostulado = (req, res, next) => {
    let _codigo = req.body.codigo;
    partidaInGame.findOne({codigo: _codigo})
    .then(match => {
        let jugadoresPostulados = [];
        match.jugadores.forEach(e => {
            if(e.beenPostulated == true){
                jugadoresPostulados.push(e);
            }
        });
        res.status(200).json({
            message: "Se lograron encontrar los postulados", 
            jugadoresPostulados: jugadoresPostulados
        });
    })
    .catch(err => {
        res.status(404).json({
            message: "Hubo un problema al econtrar la partida", 
            error: err
        });
    });
}


/**
 * BUsca una partida
 * Input: jugadorAVotar, jugadorVotante
 * Output: message:(exito o error), error(solo si falla, info sobre el error)
 */
exports.addVotoPersona = (req, res, next) => {
    //Falta usar el arreglo de postulados y buscar sobre este, porque en este momento se busca en todos los jugadores
    let _codigo = req.body.codigo;
    let _jugadorAVotar = req.body.jugadorAVotar;
    let _jugadorVotante = req.body.jugadorVotante;

    partidaInGame.findOne({codigo: _codigo})
    .then(match => {
        match.jugadores.forEach(element => {
            if(element.email == _jugadorAVotar){
                element.votesAgainst = element.votesAgainst + 1;
            }else if(element.email == _jugadorVotante){
                element.hasVoted = true;
            }
        });
    partidaInGame.findOneAndUpdate({_id: match._id}, match)
    .then(result => {
        res.status(200).json({
            message: "Se logro actualizar la partida", 
            resultDb: result
        });
    })
    .catch(err => {
        res.status(404).json({
            message: "Hubo un problema al actualizar la partida", 
            error: err
        });
    });
    })
    .catch(err=> {
        res.status(404).json({
            message: "Hubo un problema al encontrar la partida", 
            error: err
        });
    });


}


/**
 * Busca la partida, mapea los jugadores (estan por id), y los busca en la db donde estos son enviados a un script que devuelve el ganador o un empate.
 * Input: codigo
 * Output: message:(exito o error), resultDb(exito), dataSend(exito), error(solo si falla, info sobre el error), dataSend = {ganador: jugador, empate: boolean, jugadoresEmpatados:array}
 */
exports.conocerGanador = (req, res, next ) => {
    //Falta añadir las diferentes acciones sobre los diferentes eventos como votacion de rep, entre otras.
    let _codigo = req.body.codigo;
      partidaInGame.findOne({ codigo: _codigo })
        .then(match => {
            
        let dataSend = gestVotaciones.conocerGanador(match.jugadores);
        if(match.estadoActual == "transicion"){
            match.jugadores.forEach(element => {
                if(element.email == dataSend.ganador.email){
                    element.vida = element.vida - 1;
                    element.votesAgainst = 0;
                    element.beenPostulated = false;
                    element.hasVoted = false;
                    element.hasPostulated = false; 
                    element.powerUsed = false;
                }
                if(element.vida == 0){
                    element.nombreCarta = "deadPlayer", 
                    element.email = "deadPlayer", 
                    element.nombreCarta2 = "deadPLayer"
                }
            });
            partidaInGame.findOneAndUpdate({_id: match._id}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar la partida disminuyendo una vida al ganador",
                    resultDb: result, 
                    dataSend: dataSend
                });
            })
            .catch(err => {
                res.status(404).json({
                    message:"Hubo un problema al actualizar la partida", 
                    error: err
                });
            });
        }else if(match.estadoActual == "seguirVotRep") {
            match.jugadores.forEach(element => {
                if(element.email == dataSend.ganador.email){
                    element.powerUsed = false;
                }
                element.votesAgainst = 0;
                element.beenPostulated = false;
                element.hasVoted = false;
                element.hasPostulated = false; 
            });
            let validationE = gestPoderes.poderEleccionRep(match.jugadores, dataSend.ganador);
            if(validationE){
                partidaInGame.findOneAndUpdate({_id: match._id}, match)
                .then(matchModified => {
                    res.status(200).json({
                        message: "Se logro actualizar la partida y se añadio el el rol de representante al jugador con email: " + dataSend.ganador.toString(),
                        matchModified: matchModified
                    }); 
                })
                .catch(err => {
                    res.status(404).json({
                        message: "Hubo un problema al actualizar la partida", 
                        error: err
                    });
                });
            }else{
                res.status(404).json({
                    message: "Hubo un problema al asignar el rol de representante a " + dataSend.ganador.toString()
                });
            }
        }else{
            res.status(404).json({
                message: "No se logro definir el estado actual o no han votado por nadie, no se tomara accion sobre el evento", 
                dataSend: dataSend
            });
        }    

        }).catch(err => {
          res.status(404).json({
            message: "Hubo un error al encontrar la partida", 
            error: err
          });
        });

}



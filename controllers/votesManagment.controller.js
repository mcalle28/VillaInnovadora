const partidaInGame = require("../modelsDB/partidaInGame");
const Jugador = require("../modelsDB/jugador");
const gestVotaciones = require("../Scripts/gestionVotacion");

/**
 * Busca una partida, luego busca a el jugador por email y pone beenPostulated = true, luego si el usuario se consiguio se añade a la seccion de postulados, votaciones
 * en la partida deseada, luego busca al jugador postulador y pone hasPostulated = true.
 * Input: codigo, jugadorAPostular, jugadorPostulador
 * Output: message:(exito o error), error(solo si falla, info sobre el error), res(resultado de guardar en la base de datos) 
 */
exports.postularPersona = (req, res, next) => {
    let _codigo = req.body.codigo;
    //Se usa el email para los jugadores
    let _jugadorAPostular = req.body.jugadorAPostular;
    let _jugadorPostulador = req.body.jugadorPostulador;

        partidaInGame.findOne({codigo: _codigo})
        .then(match => {
            Jugador.findOneAndUpdate({email: _jugadorAPostular}, {beenPostulated: true})
            .then(user => {
                if(user != undefined){
                match["votaciones"].postulados.push(user);
                partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
                .then(result => {
                    Jugador.findOneAndUpdate({email: _jugadorPostulador}, {hasPostulated: true})
                    .then(result => {
                        res.status(200).json({
                            message: "Se logro postular a la persona en la partida y actualizar el jugador", 
                            res: result
                        });
                    })
                    .catch(err => {
                        res.status(404).json({
                            message: "No se logro encontrar el jugador postulador", 
                            error: err
                        });
                    });
                })
                .catch(err => {
                    res.status(404).json({
                        message: "No se pudo encontrar la partida para actualizar", 
                        error: err
                    });
                })
            }else{
                res.status(404).json({
                    message: "No se pudo encontrar al jugador a postular"
                });
            }
            })
            .catch(err => {
                res.status(404).json({
                    message: "No se logro encontrar el jugador a postular", 
                    error: err
                });
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Problema para encontrar la partida", 
                error: err
            });
        });
}


/**
 * Busca una partida y obtiene la seccion de votaciones.postulados
 * Input: codigo
 * Output: message:(exito o error), error(solo si falla, info sobre el error), postulados(arreglo con los jugadores postulados) 
 */
exports.obtenerPostulado = (req, res, next) => {
    let _codigo = req.body.codigo;
    partidaInGame.findOne({codigo: _codigo})
    .then(match => {
        res.status(200).json({
            message: "Se logro encontrar los postulados", 
            postulados: match.votaciones.postulados
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
    //let _codigo = req.body.codigo;
    let _jugadorAVotar = req.body.jugadorAVotar;
    let _jugadorVotante = req.body.jugadorVotante;

    Jugador.findOneAndUpdate({email: _jugadorAVotar}, { $inc: { "votesAgainst" : 1 } })
    .then(player => {
        Jugador.findOneAndUpdate({email: _jugadorVotante}, {hasVoted: true})
        .then(player2 => {
            res.status(200).json({
                message: "Se logro actualizar el jugador postulador y el jugador a postular"
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Hubo un problema al encontrar el jugador votante", 
                error: err
            }); 
        });
        
    })
    .catch(err => {
        res.status(404).json({
            message: "Hubo un problema al encontrar el jugador a votar"
        });
    });


}


/**
 * Busca la partida, mapea los jugadores (estan por id), y los busca en la db donde estos son enviados a un script que devuelve el ganador o un empate.
 * Input: codigo
 * Output: message:(exito o error), error(solo si falla, info sobre el error), data = {ganador: jugador, empate: boolean, jugadoresEmpatados:array}
 */
exports.conocerGanador = (req, res, next ) => {
    //Falta añadir las diferentes acciones sobre los diferentes eventos como votacion de rep, entre otras.
    let _codigo = req.body.codigo;
      partidaInGame.findOne({ codigo: _codigo })
        .then(match => {
            Promise.all(match.jugadores.map(idJugador => {
                return Jugador.findOne({_id: idJugador}).exec();
            })).then(fetchedUsers => {
               let dataSend = gestVotaciones.conocerGanador(fetchedUsers);
               //Se toma el estado tansicion, pero se debera se mas especifico ya que no cubre todos los casos de los eventos.
                if(match.estadoActual == "transicion"){
                Jugador.findOneAndUpdate({email: dataSend.ganador.email}, { $inc: { "vida" : -1 } })
                .then(result => {
                    res.status(200).json({
                        message: "Se lograron actualizar todos los jugadores, y tuvo efecto quitando una vida al jugador ... Evento: " + match.estadoActual,
                        data: dataSend
                    });    
                })
                .catch(err => {
                    res.status(404).json({
                        message: "Hubo un problema al tomar accion sobre el ganador", 
                        error: err
                    });
                });
                }else{
                res.status(200).json({
                    message: "Se lograron actualizar todos los jugadores, pero no tuvo efecto el ganador ya que el evento no se indentifico",
                    error: ""
                });
            }
            }).catch(err => {
                res.status(404).json({
                    message: "Problema al encontrar uno de los jugdores", 
                    error: err
                });
            });

        }).catch(err => {
          res.status(404).json({
            message: "Hubo un error al encontrar la partida", 
            error: err
          });
        });

}



const partidaInGame = require("../modelsDB/partidaInGame");
const Jugador = require("../modelsDB/jugador");
const gestVotaciones = require("../Scripts/gestionVotacion");

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
                            message: "Se logro postular a la persona en la partida y actualizar el jugador"
                        });
                    })
                    .catch(error => {
                        res.status(404).json({
                            message: "No se logro encontrar el jugador postulador"
                        });
                    });
                })
                .catch(err => {
                    res.status(404).json({
                        message: "No se pudo encontrar la partida para actualizar"
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
                    message: "No se logro encontrar el jugador a postular"
                });
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Problema para encontrar la partida"
            });
        });
}

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

exports.addVotoPersona = (req, res, next) => {
    //Falta verificar que el jugador a votar este dentro de los postulados
    let _codigo = req.body.codigo;
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
                message: "Hubo un problema al encontrar el jugador votante"
            }); 
        });
        
    })
    .catch(err => {
        res.status(404).json({
            message: "Hubo un problema al encontrar el jugador a votar"
        });
    });


}

exports.conocerGanador = (req, res, next ) => {
    //Falta añadir las diferentes acciones sobre los diferentes eventos como votacion de rep, entre otras.
    let _codigo = req.body.codigo;
      partidaInGame.findOne({ codigo: _codigo })
        .then(match => {
            Promise.all(match.votaciones.postulados.map(idJugador => {
                return Jugador.findOne({_id: idJugador}).exec();
            })).then(fetchedUsers => {
               let dataSend = gestVotaciones.conocerGanador(fetchedUsers);
                if(match.estadoActual == "votacionCreaticidas"){
                Jugador.findOneAndUpdate({email: dataSend.ganador.email}, { $inc: { "vida" : -1 } })
                .then(result => {
                    res.status(200).json({
                        message: "Se lograron actualizar todos los jugadores, y tuvo efecto quitando una vida al jugador",
                        data: dataSend
                    });    
                })
                .catch(err => {
                    res.status(404).json({
                        message: "Hubo un problema al tomar accion sobre el ganador", 
                        data: dataSend
                    });
                });
                }else{
                res.status(200).json({
                    message: "Se lograron actualizar todos los jugadores, pero no tuvo efecto el ganador",
                    data: dataSend
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



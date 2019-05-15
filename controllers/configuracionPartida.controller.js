const partidaInGame  = require("../modelsDB/partidaInGame");
const Jugador = require("../modelsDB/jugador");
const gestPartidas = require("../Scripts/gestionPartidas");
const gestCartas = require("../Scripts/gestionCartas");

exports.crearPartida = (req, res, next ) => {

    let nuevoCodigo = gestPartidas.generarCodigo();
    partidaInGame.findOne({ codigo: nuevoCodigo }).then(match => {

        if(match){
        res.status(404).json({
            message: "La partida ya existe"
        });
    }else{
        const partidaSave = new partidaInGame({
            codigo: nuevoCodigo, 
            tipoPartida: -1, 
            estadoActual: "configurando...",
            eventoSecuenciaActual: -1, 
            votaciones: {
                postulados: [],
                ganador: "", 
                conVotos: 0, 
                empate: false, 
                jugadoresEmpatados: []
            }
        });
        partidaSave.save().then(result => {
            res.status(200).json({
                message: "Se va a crear la partida",
                nuevoCodigo: nuevoCodigo, 
                debug: result 
            });
        }).catch(err => {
            res.status(404).json({
                message:"Hubo un problema al almacenar la partida, trata de nuevo"
            });
        }); 
    }
    }).catch(err =>{
        res.status(404).json({
            message: "Hubo un error", 
            error: err
        });
    });
}

exports.configurarPartida = (req, res, next) => {
    let _codigo = req.body.codigo;
    let _tipoPartida = req.body.tipoPartida;
      partidaInGame.findOne({ codigo: _codigo })
        .then(match => {

        let matchSave = gestPartidas.configurarPartidas(match, _tipoPartida);
            console.log(matchSave);

        partidaInGame.findOneAndUpdate({codigo: _codigo}, matchSave).then(result => {
            res.status(200).json({
                message:"Se logro configurar la partida", 
                result: result
            });
        }).catch(err => {
            res.status(404).json({
                message: "Hubo un problema al guardar la partida", 
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

exports.unirJugador = (req, res, next) => {
    let _codigo = req.body.codigo;
    let _emailJugador = req.body.email;
    
      partidaInGame.findOne({ codigo: _codigo })
        .then(match => {
            Jugador.findOne({ email: _emailJugador})
            .then(user => {
                if(user != undefined){
                match.jugadores.push(user);
                partidaInGame.findOneAndUpdate({codigo: _codigo}, match).then(result => {
                    res.status(200).json({
                        message:"Se logro añadir jugador a la partida", 
                        result: result
                    });
                }).catch(err => {
                    res.status(404).json({
                        message: "Hubo un problema al guardar la partida", 
                        error: err
                    });
                });
            }else{
                res.status(404).json({
                    message: "No se logro encontrar el jugador para unirse a la partida"
                });
            }
            }).catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al encontrar al jugador", 
                    err: err
                });
            });

        }).catch(err => {
          res.status(404).json({
            message: "Hubo un error al encontrar la partida", 
            error: err
          });
        });
  }

//Devuelve todos los jugadores
exports.obtenerJugadores = (req, res, next) => {
let _codigo = req.body.codigo;
let _tipoPartida = req.body.tipoPartida;

partidaInGame.findOne({codigo: _codigo})
.then(match => {

    Promise.all(match.jugadores.map(idJugador => {
        return Jugador.findOne({_id: idJugador}).exec();
    })).then(fetchedUsers => {
            res.status(200).json({
                message: "Se encontraron los jugadores", 
                jugadores: fetchedUsers
            });
    }).catch(err => {
        res.status(404).json({
            message: "Problema al encontrar uno de los jugdores", 
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

exports.asignarRol = (req, res, next) => {
    let _codigo = req.body.codigo;
    let _tipoPartida = req.body.tipoPartida;
      partidaInGame.findOne({ codigo: _codigo })
        .then(match => {

            Promise.all(match.jugadores.map(idJugador => {
                return Jugador.findOne({_id: idJugador}).exec();
            })).then(fetchedUsers => {
                gestCartas.asignarRol(fetchedUsers, _tipoPartida);

                Promise.all(fetchedUsers.map(idJugador => {
                    return Jugador.findOneAndUpdate({email: idJugador.email},idJugador).exec();
                })).then(result => {
                        console.log(result);
                }).catch(err => {
                    res.status(404).json({
                        message: "Problema al encontrar uno de los jugdores", 
                        error: err
                    });
                });

                res.status(200).json({
                    message: "Se lograron actualizar todos los jugadores",
                    users: fetchedUsers
                });

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

exports.finalizarPartida = (req, res, next) => {
    //Aqui se debe de guardar la db como se desea en un schema diferente que no tenga los datos de las partidas, igualmente con los jugadores
}

exports.conseguirEventoActual = (req, res, next) => {
    partidaInGame.findOne({codigo: req.body.codigo})
    .then(match =>{
        res.status(200).json({
            message: "Se logro conseguir el evento", 
            evento: match.estadoActual
        })
    })
    .catch(err =>{
        res.send(err);
    })
}

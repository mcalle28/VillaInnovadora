const partidaInGame  = require("../modelsDB/partidaInGame");
const Jugador = require("../modelsDB/jugador");
const gestPartidas = require("../Scripts/gestionPartidas");
const gestCartas = require("../Scripts/gestionCartas");

/**
 * Este archivo se hace con el proposito de gestionar el manejo de los request hechos para configurar la partida, donde se gestiona el inicio y finalizacion 
 * de esta.
 */


/**
 * Crea una partida en la base de datos.
 * Input: ----, 
 * Output: message(mensaje de exito o error), nuevoCodigo(solo aparece en exito), debug(Informacion sobre el resultado al guardar en la db)
 */
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
                message:"Hubo un problema al almacenar la partida, trata de nuevo", 
                debug: err
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

/**
 * Configura las secuencias de noche, dia, tiempo, evento partida, 
 * Input: codigo, tipoPartida (0 basica, 1 avanzada, 2 propositos sustentacion o personalizada)
 * Output: message:(exito o error), result(solo si exito, info sobre el resultado al guardar en la db), error(solo si falla, info sobre el error)
 */
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

/**
 * Busca la partida, busca a el jugador (se debio crear previamente), lo une a la lista de jugadores de la partida con el ID que tiene en la db.
 * Input: codigo, email(email del jugador).
 * Output: message:(exito o error), result(solo si exito, info sobre el resultado al guardar en la db), error(solo si falla, info sobre el error)
 */
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
                    message: "No se logro encontrar el jugador para unirse a la partida", 
                    error: ""
                });
            }
            }).catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al encontrar al jugador", 
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

/**
 * Busca una partida y devuelve todos los jugadores que estan en la lista.
 * Input: codigo
 * Output: message:(exito o error), jugadores(solo si exito, array con jugadores), error(solo si falla, info sobre el error)
 */
exports.obtenerJugadores = (req, res, next) => {
let _codigo = req.body.codigo;

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

/**
 * Busca una partida, coge la lista de jugadores los mapea por id y modifica en la coleccion de estos el nombreCarta y descripcionCarta.
 * Input: codigo, tipoPartida(0: basica, 1:avanzada, 2:personalizada)
 * Output: message:(exito o error), users(solo si exito, array con jugadores actualizados con roles), error(solo si falla, info sobre el error)
 */
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

/**
 * Busca una partida y crea en la db una nueva coleccion que guarde la partida sin los datos usados para la sincronizacion de la ejecucion.
 * Input: (Falta implementar)
 * Output: (Falta implementar)
 */
exports.finalizarPartida = (req, res, next) => {
    //Aqui se debe de guardar la db como se desea en un schema diferente que no tenga los datos de las partidas, igualmente con los jugadores
}

/**
 * Busca una partida y retora el estadoActual de esta
 * Input: codigo
 * Output: message:(exito o error), evento(string con el evento actual), error(solo si falla, info sobre el error)
 */
exports.conseguirEventoActual = (req, res, next) => {
    partidaInGame.findOne({codigo: req.body.codigo})
    .then(match =>{
        res.status(200).json({
            message: "Se logro conseguir el evento", 
            evento: match.estadoActual
        })
    })
    .catch(err =>{
        res.status(200).json({
            message: "Error al encontrar la partida", 
            error: err
        })
    })
}

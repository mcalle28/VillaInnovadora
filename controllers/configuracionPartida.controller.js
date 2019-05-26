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
            temaEventoEspecial: "notSet",
            tituloEventoEspecial:"notSet",
            ganadoresPartida:"no hay ganadores todavia",
            eventoSecuenciaActual: -1
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
 * Busca la partida, busca a el jugador (se debio crear previamente), lo almacena en jugadores dentro de partida.
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
                let userPush = {
                    nombre: user.nombre, 
                    email: user.email,
                    vida: 1, 
                    protected: false, 
                    beenPostulated: false, 
                    hasPostulated: false, 
                    idea: "none",
                    postuloIdeaJuicio: false, 
                    votesAgainst: 0, 
                    hasVoted: false, 
                    powerUsed: false, 
                    powerUsedDescription: false,
                    nombreCarta: "noSet",
                    nombreCarta2: "noSet", 
                    descripcionCarta: "noSet", 
                    descripcionCarta2: "noSet",
                };
                match.jugadores.push(userPush);
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
                const jugador = new Jugador({
                    nombre: req.body.nombre, 
                    apellido: req.body.apellido,
                    sexo: req.body.sexo,
                    edad: req.body.edad,
                    email: req.body.email,
                    carrera: req.body.carrera,
                    semestre: req.body.semestre,
                    motivacion: req.body.motivacion,
                    pensamiento: req.body.pensamiento,
                    amplitud: req.body.amplitud,
                    orientacion: req.body.orientacion,
                    inteligencia: req.body.inteligencia,
                    innovacion: req.body.innovacion,
                    tiempoRespuesta: req.body.tiempoRespuesta,
            
                });
            
                jugador.save().then(user => {
                    if(user != undefined){
                        let userPush = {
                            nombre: user.nombre, 
                            email: user.email,
                            vida: 1, 
                            protected: false, 
                            beenPostulated: false, 
                            hasPostulated: false, 
                            idea: "none",
                            postuloIdeaJuicio: false, 
                            votesAgainst: 0, 
                            hasVoted: false, 
                            powerUsed: false, 
                            powerUsedDescription: false,
                            nombreCarta: "noSet",
                            nombreCarta2: "noSet",  
                            descripcionCarta: "noSet"
                        };
                        match.jugadores.push(userPush);
                        partidaInGame.findOneAndUpdate({codigo: _codigo}, match).then(result => {
                            res.status(200).json({
                                message:"Se logro añadir y crear jugador a la partida", 
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
                            message: "El jugador creado no es valido", 
                            error: ""
                        });
                    }
                }).catch(err => {
                    res.status(404).json({
                        message: "Hubo un error al guardar el jugador en la DB", 
                        error: err
                    });
                });
            }
            }).catch(error => {
                res.status(404).json({
                    message:"Hubo un error el encontrar el jugador", 
                    error: error
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

    try {
        res.status(200).json({
            message: "Se encontraron los jugadores", 
            jugadores: match.jugadores
        });
    } catch (err) {
        res.status(404).json({
            message: "No se lograron encontrar los jugadores", 
            error: err
        });
    }

})
.catch(err => {
res.status(404).json({
    message: "Hubo un error al encontrar la partida", 
    error: err
    });
});
}

/**
 * Busca los jugadores de una partida por el codigo y si encuentra demotivados los devuelve de lo contrario solo envia un mensaje.
 * Input: codigo
 * Output: message:(exito o error), desmotivados(exito), error(solo si falla, info sobre el error)
 */
exports.obtenerDesmotivados = (req, res, next) => {

let _codigo = req.body.codigo;

partidaInGame.findOne({codigo: _codigo})
.then(match => {
    let desmotivados = [];
    match.jugadores.forEach(element => {
        if(element.vida == 0){
            desmotivados.push(element);
        }
    });
    if(desmotivados.length > 0){
        res.status(200).json({
            message: "Se encontraron desmotivados en la partida", 
            desmotivados: desmotivados
        });
    }else{
        res.status(200).json({
            message: "No se encontro ningun desmotivado en la partida"
        });
    }
})
.catch(err => {
    res.status(404).json({
        message: "Hubo un problema al encontrar la partida", 
        error: err
    });
});

}


/**
 * Busca una partida, coge la lista de jugadores  y modifica en la coleccion de estos el nombreCarta y descripcionCarta.
 * Input: codigo, tipoPartida(0: basica, 1:avanzada, 2:personalizada)
 * Output: message:(exito o error), users(solo si exito, array con jugadores actualizados con roles), error(solo si falla, info sobre el error)
 */
exports.asignarRol = (req, res, next) => {
    let _codigo = req.body.codigo;
    let _tipoPartida = req.body.tipoPartida;
      partidaInGame.findOne({ codigo: _codigo })
        .then(match => {
            gestCartas.asignarRol(match.jugadores, _tipoPartida);
            match.estadoActual = "rolesAsignados";
            partidaInGame.findOneAndUpdate({_id: match._id}, match)
            .then(result => {
                res.status(200).json({
                    message:" Se logro actualizar la partida con los roles asignados", 
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
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

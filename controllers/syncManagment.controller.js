const partidaInGame = require("../modelsDB/partidaInGame");
const gestSync = require("../Scripts/gestionSync");
const gestPoderes = require("../Scripts/gestionPoderes");

/**
 * Busca una partida y utiliza un script sobre el arreglo de jugadores para encontrar si esta el indeciso, donde al encontrarlo le asigna el rol dependiendo de
 * la desicion
 * Input: codigo, desicion("Creaticida" else emprendedor(solo reconoce string "Creaticida")).  
 * Output: message:(exito o error), error(solo si falla, info sobre el error)
 * 
 * Notas: Deberia utilizar el email para buscar al jugador dentro de la partida y verificar si este esta dentro de esta, ademas de si es el indeciso.
 */
exports.accionIndeciso = (req, res, next) => {

let _codigo = req.body.codigo;
let _desicion = req.body.desicion;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {

        let validation = gestPoderes.poderIndeciso(match.jugadores, _desicion);
        console.log(validation);
        if(validation){
        match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
        match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
        partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
        .then(result => {
            res.status(200).json({
                message: "Se logro actualizar el jugador y la partida con el siguiente evento", 
                resultDb: result
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
            message: "Hubo un problema al usar el pdoer del indeciso"
        });
    }
}).catch(err => {
  res.status(404).json({
    message: "Hubo un error al encontrar la partida", 
    error: err
  });
});

}

/**
 * Busca una partida, obtiene los jugadores  y con un script encuentra si en los jugadores esta el indeciso, si esta
 * pasa evento sino solo se envia un mensaje hasta que se encuentre el indeciso.
 * 
 * Input: codigo  
 * Output: message:(exito o error), error(solo si falla, info sobre el error), //El server cambia de evento si no existe un indeciso en la partida.
 */
exports.seguirAccionIndeciso = (req, res, next) => {
  
let _codigo = req.body.codigo;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {
    let validation = gestSync.existeIndeciso(match.jugadores);

    if(!validation){
        match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
        match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
        partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
        .then(result => {
            res.status(200).json({
                message: "Se logro actualizar la partida con el siguiente evento", 
                resultDb: result
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Hubo un problema al actualizar la partida"
            });
        });    
    }else{
        res.status(200).json({
            message: "Todavia existe un emprendedor indeciso en la partida"
        });
    }
}).catch(err => {
  res.status(404).json({
    message: "Hubo un error al encontrar la partida", 
    error: err
  });
});

}

/**
 * Busca una partida, obtiene los jugadores  y con un script encuentra encuentra un jugador y muestra este como resultado, ademas encuentra al jugador
 * mentor y pone variables de poder como usadas;
 * Input: codigo, jugadorAConocer(email), jugadorMentor(email)  
 * Output: message:(exito o error),jugador(exito), error(solo si falla, info sobre el error), 
 */
exports.accionMentor = (req, res, next) => {

let _codigo = req.body.codigo;
let _jugadorAConocer = req.body.jugadorAConocer;
let _jugadorMentor = req.body.jugadorMentor;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {

        let validation = gestPoderes.poderMentor(match.jugadores, _jugadorAConocer,_jugadorMentor);
        if(validation != undefined){
        match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
        match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
        partidaInGame.findOneAndUpdate({_id: match._id}, match)
        .then(result => {
            res.status(200).json({
                message: "Se logro actualizar el jugador y la partida con el siguiente evento", 
                jugador: validation,
                resultDb: result
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
            message: "Hubo un problema al usar el poder del mentor"
        });
    }
}).catch(err => {
  res.status(404).json({
    message: "Hubo un error al encontrar la partida", 
    error: err
  });
});

}

/**
 * Busca una partida, obtiene los jugadores  y encuentra al mentor, si este ha usado el poder se pasa de evento de lo contrario no pasa de evento
 * Input: codigo,  jugadorMentor(email)  
 * Output: message:(exito o error), error(solo si falla, info sobre el error),
 */
exports.seguirAccionMentor = (req, res, next) => {

    let _codigo = req.body.codigo;

    partidaInGame.findOne({codigo: _codigo})
    .then(match =>{
        let validator = false;
        match.jugadores.forEach(element => {
            if(element.nombreCarta == "Aliado Mentor"){
                if(element.powerUsed == true){
                    validator = true;
                }
            }
        });
        if(validator){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar el jugador y la partida con el siguiente evento", 
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
                    error: err
                });
         });
        }else{
            res.status(200).json({
                message: "El jugador mentor todavia no ha usado su poder, no se tomara accion sobre los eventos"
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


exports.accionEstadoSalvar = (req, res, next) => {

    let _codigo = req.body.codigo;
    let _desicion = req.body.desicion;
    let _jugadorABuscar = req.body.jugadorABuscar;
    let _jugadorEstado = req.body.jugadorEstado;
    
    partidaInGame.findOne({codigo: _codigo})
    .then(match => {
        if(_desicion == "si"){
            let validation = gestPoderes.poderEstado(match.jugadores, _jugadorEstado,_jugadorABuscar, "salvar");
            console.log(validation);
            if(validation != undefined){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 2;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({_id: match._id}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar el jugador y la partida con el siguiente evento", 
                    jugador: validation,
                    resultDb: result
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
                message: "Hubo un problema al usar el poder del estado"
            });
        }
        }else{
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar el jugador y la partida con el siguiente evento, el estado no quiso salvar", 
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
                    error: err
                });
         });  
        }
    })
    .catch(err => {
        res.status(404).json({
            message: "Hubo un error al encontrar la partida"
        });
    });

}

exports.accionEstadoDesmotivar = (req, res, next) => {

    let _codigo = req.body.codigo;
    let _desicion = req.body.desicion;
    let _jugadorABuscar = req.body.jugadorABuscar;
    let _jugadorEstado = req.body.jugadorEstado;

    partidaInGame.findOne({codigo: _codigo})
    .then(match => {
        if(_desicion == "si"){
            let validation = gestPoderes.poderEstado(match.jugadores, _jugadorEstado,_jugadorABuscar, "desmotivar");
            if(validation != undefined){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({_id: match._id}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar el jugador y la partida con el siguiente evento", 
                    jugador: validation,
                    resultDb: result
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
                message: "Hubo un problema al usar el poder del estado"
            });
        }
        }else{
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar el jugador y la partida con el siguiente evento, el estado no quiso desmotivar", 
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
                    error: err
                });
         });  
        }
    })
    .catch(err => {
        res.status(404).json({
            message: "Hubo un error al encontrar la partida"
        });
    });

}

/**
 * Busca una partida y al jugador que quiera conocer dependiendo de la desicion le da una vida o le quita una, ademas el jugador estado se le ponen
 * variables de uso de poder.
 * Input: codigo,  jugadorEstado(email),jugadorAConocer(email), desicion("salvar" o "desmotivar")  
 * Output: message:(exito o error),jugador(exito),resultDb(exito), error(solo si falla, info sobre el error),
 */
exports.accionEstado = (req, res, next) => {
    let _codigo = req.body.codigo;
    let _jugadorAConocer = req.body.jugadorAConocer;
    let _jugadorEstado = req.body.jugadorEstado;
    let _desicion = req.body.desicion;
    
    partidaInGame.findOne({ codigo: _codigo })
    .then(match => {
    
            let validation = gestPoderes.poderEstado(match.jugadores, _jugadorEstado,_jugadorAConocer, _desicion);
            if(validation != undefined){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({_id: match._id}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar el jugador y la partida con el siguiente evento", 
                    jugador: validation,
                    resultDb: result
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
                message: "Hubo un problema al usar el poder del estado"
            });
        }
    }).catch(err => {
      res.status(404).json({
        message: "Hubo un error al encontrar la partida", 
        error: err
      });
    });
}

/**
 * Busca una partida y si el jugador estado ha usado su poder se cambia de evento de lo contrario no se cambia.
 * Input: codigo,  jugadorEstado(email),  
 * Output: message:(exito o error),resultDb(exito), error(solo si falla, info sobre el error),
 */
exports.seguirAccionEstado = (req, res, next) => {

    let _codigo = req.body.codigo;

    partidaInGame.findOne({codigo: _codigo})
    .then(match =>{
        let validator = false;
        match.jugadores.forEach(element => {
            if(element.nombreCarta == "Aliado Estado"){
                if(element.powerUsed == true){
                    validator = true;
                }
            }
        });
        if(validator){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar el jugador y la partida con el siguiente evento", 
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
                    error: err
                });
         });
        }else{
            res.status(200).json({
                message: "El jugador estado todavia no ha usado su poder, no se cambiara el evento"
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
 * Busca una partida, obtiene los jugadores y con un script encuentra si los jugadores creaticidas han votado, si es verdad
 * se cambia el evento de la partida, sino se envia solo mensaje.
 * Input: codigo  
 * Output: message:(exito o error), error(solo si falla, info sobre el error), //El server cambia de evento si creaticidas han votado en la partida.
 */
exports.votacionCreaticidas = (req, res, next) => {
let _codigo = req.body.codigo;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {
    let validation = gestSync.creaticidasHanVotado(match.jugadores);
    if(validation){
        match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
        match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
        partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
        .then(result => {
            res.status(200).json({
                message: "Todos los creaticidas han votado y se cambio el evento",
                resultDb: result
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Hubo un problema al actualizar la partida", 
                error: err
            });
        });    
    }else{
        res.status(200).json({
            message: "Todavia faltan creaticidas por votar",
        });
    }
}).catch(err => {
  res.status(404).json({
    message: "Hubo un error al encontrar la partida", 
    error: err
  });
});
}

/**
 * Busca los jugadores de una partida y si por lo menos 1 se ha postulado entonces se sigue con el siguiente evento
 * Input: codigo  
 * Output: message:(exito o error), jugadoresPostulados(exito),matchModified(exito), error(solo si falla, info sobre el error).
 */
exports.postulacionRep = (req, res, next) => {

let _codigo = req.body.codigo;

partidaInGame.findOne({codigo: _codigo})
.then(match => {
    let jugadoresPostulados = [];
    match.jugadores.forEach(e => {
        if(e.beenPostulated == true){
            jugadoresPostulados.push(e);
        }
    });

    if(jugadoresPostulados.length > 0){
        match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
        match.estadoActual = match.secuenciaDia[match.eventoSecuenciaActual];
        partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
        .then(result => {
            res.status(200).json({
                message:"Hay por lo menos una persona postulada y se actualizo la partida con nuevo evento",
                jugadoresPostulados: jugadoresPostulados, 
                matchModified: result
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Hubo un problema al actualizar la partida", 
                error: err
            });
        });
    }else{
        res.status(200).json({
            message: "Tiene que postularse por lo minimo una persona para continuar"
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
 * Busca una partida, obtiene los jugadores y con un script encuentra si todos los jugadores han votado, si es verdad
 * se cambia el evento de la partida, sino se envia solo mensaje.
 * Input: codigo  
 * Output: message:(exito o error), resultDB(exito), error(solo si falla, info sobre el error)
 */
exports.votacionRep = (req, res, next) => {
    let _codigo = req.body.codigo;

    partidaInGame.findOne({ codigo: _codigo })
    .then(match => {
        let validation = gestSync.todosHanVotado(match.jugadores);
        if(validation){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaDia[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Todos han votado y se cambio el evento",
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
                    error: err
                });
            });    
        }else{
            res.status(200).json({
                message: "Todavia faltan jugadores por votar",
            });
        }
    }).catch(err => {
      res.status(404).json({
        message: "Hubo un error al encontrar la partida", 
        error: err
      });
    });
}

/**
 * Antes de esto se debe conocer al ganador y este link checkea si el representante existe
 * Input: codigo  
 * Output: message:(exito o error), resultDB(exito), error(solo si falla, info sobre el error)
 */
exports.seguirVotacionRep = (req, res, next) => {

let _codigo = req.body.codigo;
console.log(_codigo);
partidaInGame.findOne({codigo: _codigo})
.then(match => {
let validation = false;

match.jugadores.forEach(e => {
if(e.nombreCarta2 == "Representante Empresarial"){
    validation = true;
}
});

if(validation){
    match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
    match.estadoActual = match.secuenciaDia[match.eventoSecuenciaActual];
    partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
    .then(result => {
        res.status(200).json({
            message: "Se encontro representante y se cambio el evento",
            resultDb: result
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
        message: "No se puede seguir el evento porque no se ha definido el representante"
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
 * Es exactamente igual a postulacion rep por lo que se debe reconsiderar dejarlo como un solo modulo
 * Busca los jugadores de una partida y si por lo menos 1 se ha postulado entonces se sigue con el siguiente evento
 * Input: codigo  
 * Output: message:(exito o error), jugadoresPostulados(exito),matchModified(exito), error(solo si falla, info sobre el error).
 */
exports.postulacionJuicio = (req, res, next) => {
    let _codigo = req.body.codigo;

    partidaInGame.findOne({codigo: _codigo})
    .then(match => {
        let jugadoresPostulados = [];
        match.jugadores.forEach(e => {
            if(e.beenPostulated == true){
                jugadoresPostulados.push(e);
            }
        });
    
        if(jugadoresPostulados.length > 0){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaDia[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message:"Hay por lo menos una persona postulada y se actualizo la partida con nuevo evento",
                    jugadoresPostulados: jugadoresPostulados, 
                    matchModified: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
                    error: err
                });
            });
        }else{
            res.status(200).json({
                message: "Tiene que postularse por lo minimo una persona para continuar"
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
 * Es exactamente igual a postulacion rep por lo que se debe reconsiderar dejarlo como un solo modulo
 * Busca una partida, obtiene los jugadores y con un script encuentra si todos los jugadores han votado, si es verdad
 * se cambia el evento de la partida, sino se envia solo mensaje.
 * Input: codigo  
 * Output: message:(exito o error), resultDB(exito), error(solo si falla, info sobre el error)
 */
exports.votacionJuicio = (req, res, next) => {
    let _codigo = req.body.codigo;

    partidaInGame.findOne({ codigo: _codigo })
    .then(match => {
        let validation = gestSync.todosHanVotado(match.jugadores);
        if(validation){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaDia[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Todos han votado y se cambio el evento",
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
                    error: err
                });
            });    
        }else{
            res.status(200).json({
                message: "Todavia faltan jugadores por votar",
            });
        }
    }).catch(err => {
      res.status(404).json({
        message: "Hubo un error al encontrar la partida", 
        error: err
      });
    });
}

/**
 * Busca la partida y obtiene los jugadores , cuando el primer equipo llegue a 0 vidas en sus jugadores (creaticidas o emprendedores) se le condedera la victoria
 * al otro equipo.
 * Input: codigo  
 * Output: message:(exito o error), error(solo si falla, info sobre el error), //El server cambia de evento si ningun equipo ha llegado a que todos sus jugadores
 * tengan 0 vidas. de lo contrario finaliza y se cambia el estado a "partida finalizada".
 */
exports.transicion = (req, res, next) => {
    let _codigo = req.body.codigo;
    let desicion = req.body.desicion;

    partidaInGame.findOne({ codigo: _codigo })
    .then(match => {
        //Este validator (onSucces) devuelve {ganador: String, empate: Boolean, jugadoresEmpatados: Array<JugadoresPartidaInGame
        let validator = gestSync.condicionesParaGanar(match.jugadores);
        console.log(validator);
        if(validator.pass == true){
            match.eventoSecuenciaActual = -1;
            match.estadoActual = "Partida finalizada";
            match.jugadores = [];

            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "El ganador es: " +  validator.ganador, 
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida", 
                    error: err
                });
            });    
        }else{
            if(desicion == "dia"){
            var _validateRep = false;

            match.jugadores.forEach(e => {
                if(e.nombreCarta2 == "Aliado Representante Empresarial"){
                    _validateRep = true;
                }
            });
            //Se añade a la secuencia el representante si no esta y si esta se quita de la secuencia
            if(_validateRep){
            console.log("Se ha quitado de la secuencia la postulacion y votacion del representante");
            match.secuenciaDia.splice(0,3);
            }else{
            console.log("Se ha añadido a postulacion y votacion de representante");
            match.secuenciaDia.unshift("seguirVotRep");
            match.secuenciaDia.unshift("votacionRepresentante");
            match.secuenciaDia.unshift("postulacionRepresentante");
            }
            match.tiempo = "Dia";
            match.eventoSecuenciaActual = 0;
            match.estadoActual = match.secuenciaDia[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Todavia no se encuentra ganador se sigue la partida a dia", 
                    resultDb: result
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida",
                    error: err
                });
            });
        }else if(desicion == "noche"){
            var _validateIndeciso = false;

            match.jugadores.forEach(e => {
                if(e.nombreCarta == "Aliado Emprendedor Indeciso"){
                    _validateIndeciso = true;
                }
            });
            //Se quita el evento del indeciso si este ya no esta en la partida (uso su rol)
            if(!_validateIndeciso){
            console.log("Se ha quitado de la secuencia los eventos del indeciso");
            match.secuenciaNoche.splice(0,2);
            }
            match.tiempo = "Noche";
            match.eventoSecuenciaActual = 0;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Todavia no se encuentra ganador se sigue la partida a Noche", 
                    resultDb: result
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
                message: "Hubo un problema a la hora elegir la secuencia de dia, noche o evento"
            });
        }    
        }
    }).catch(err => {
      res.status(404).json({
        message: "Hubo un error al encontrar la partida", 
        error: err
      });
    });  
}




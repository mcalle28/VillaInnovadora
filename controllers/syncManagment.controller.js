const partidaInGame = require("../modelsDB/partidaInGame");
const gestSync = require("../Scripts/gestionSync");
const gestPoderes = require("../Scripts/gestionPoderes");
const Jugador = require("../modelsDB/jugador");

exports.accionIndeciso = (req, res, next) => {

let _codigo = req.body.codigo;
let _desicion = req.body.desicion;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {

    Promise.all(match.jugadores.map(idJugador => {
        return Jugador.findOne({_id: idJugador}).exec();
    })).then(fetchedUsers => {
        let indeciso = gestPoderes.poderIndeciso(fetchedUsers, _desicion);
        Jugador.findOneAndUpdate({email: indeciso.email}, indeciso)
        .then(result => {
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar el jugador y la partida con el siguiente evento"
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida"
                });
            });
        })
        .catch(err => {
            res.status(404).json({
                message:"Error al actualizar indeciso", 
                error: err
            });
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

exports.seguirAccionIndeciso = (req, res, next) => {
  
let _codigo = req.body.codigo;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {

    Promise.all(match.jugadores.map(idJugador => {
        return Jugador.findOne({_id: idJugador}).exec();
    })).then(fetchedUsers => {
       
        let validation = gestSync.existeIndeciso(fetchedUsers);

        if(!validation){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Se logro actualizar la partida con el siguiente evento"
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida"
                });
            });    
        }else{
            res.status(404).json({
                message: "Todavia existe un emprendedor indeciso en la partida"
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

exports.postulacionCreaticidas = (req, res, next) => {
    let _codigo = req.body.codigo;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {

    Promise.all(match.jugadores.map(idJugador => {
        return Jugador.findOne({_id: idJugador}).exec();
    })).then(fetchedUsers => {
       
        let validation = gestSync.creaticidasHanPostulado(fetchedUsers);
        if(validation){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Todos los creaticidas han votado y se cambio el evento"
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida"
                });
            });    
        }else{
            res.status(404).json({
                message: "Todavia faltan creaticidas por postular"
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

exports.votacionCreaticidas = (req, res, next) => {
let _codigo = req.body.codigo;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {

    Promise.all(match.jugadores.map(idJugador => {
        return Jugador.findOne({_id: idJugador}).exec();
    })).then(fetchedUsers => {
       
        let validation = gestSync.creaticidasHanVotado(fetchedUsers);
        if(validation){
            match.eventoSecuenciaActual = match.eventoSecuenciaActual + 1;
            match.estadoActual = match.secuenciaNoche[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Todos los creaticidas han votado y se cambio el evento",
                    datos : true
                });
            })
            .catch(err => {
                res.status(404).json({
                    message: "Hubo un problema al actualizar la partida"
                });
            });    
        }else{
            res.status(404).json({
                message: "Todavia faltan creaticidas por postular",
                datos: false
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

exports.transicionADia = (req, res, next) => {
    let _codigo = req.body.codigo;
    
    partidaInGame.findOne({ codigo: _codigo })
    .then(match => {
    
        Promise.all(match.jugadores.map(idJugador => {
            return Jugador.findOne({_id: idJugador}).exec();
        })).then(fetchedUsers => {

            let validator = gestSync.condicionesParaGanar(fetchedUsers);
            if(validator.pass == true){
                match.eventoSecuenciaActual = -1;
                match.estadoActual = "Partida finalizada";
                partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
                .then(result => {
                    res.status(200).json({
                        message: "El ganador es: " +  validator.ganador
                    });
                })
                .catch(err => {
                    res.status(404).json({
                        message: "Hubo un problema al actualizar la partida"
                    });
                });    
            }else{
                match.eventoSecuenciaActual = 0;
                match.estadoActual = match.secuenciaDia[match.eventoSecuenciaActual];
                partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
                .then(result => {
                    res.status(200).json({
                        message: "Todavia no se encuentra ganador se sigue la partida "
                    });
                })
                .catch(err => {
                    res.status(404).json({
                        message: "Hubo un problema al actualizar la partida"
                    });
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


const partidaInGame = require("../modelsDB/partidaInGame");
const gestSync = require("../Scripts/gestionSync");
const gestPoderes = require("../Scripts/gestionPoderes");
const Jugador = require("../modelsDB/jugador");

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

    let indeciso = gestPoderes.poderIndeciso(match.jugadores, _desicion);
    Jugador.findOneAndUpdate({email: indeciso.email}, indeciso)
    .then(result => {
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
    })
    .catch(err => {
        res.status(404).json({
            message:"Error al actualizar indeciso", 
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
 * Busca una partida, obtiene los jugadores  y con un script encuentra si en los jugadores creaticidas han postulado 
 * en la votacion, donde de ser verdadero se cambia de evento y de ser falso solo se envia un mensaje.
 * 
 * Input: codigo  
 * Output: message:(exito o error), error(solo si falla, info sobre el error), //El server cambia de evento si no creaticidas han postulado en la partida.
 */
exports.postulacionCreaticidas = (req, res, next) => {
    let _codigo = req.body.codigo;

partidaInGame.findOne({ codigo: _codigo })
.then(match => {
    let validation = gestSync.creaticidasHanPostulado(match.jugadores);
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
                message: "Hubo un problema al actualizar la partida", 
                error: err
            });
        });    
    }else{
        res.status(200).json({
            message: "Todavia faltan creaticidas por postular"
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
            message: "Todavia faltan creaticidas por postular",
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
exports.transicionADia = (req, res, next) => {
    let _codigo = req.body.codigo;
    
    partidaInGame.findOne({ codigo: _codigo })
    .then(match => {
        //Este validator (onSucces) devuelve {ganador: String, empate: Boolean, jugadoresEmpatados: Array<JugadoresPartidaInGame
        let validator = gestSync.condicionesParaGanar(match.jugadores);
        if(validator.pass == true){
            match.eventoSecuenciaActual = -1;
            match.estadoActual = "Partida finalizada";
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
            match.eventoSecuenciaActual = 0;
            match.estadoActual = match.secuenciaDia[match.eventoSecuenciaActual];
            partidaInGame.findOneAndUpdate({codigo: _codigo}, match)
            .then(result => {
                res.status(200).json({
                    message: "Todavia no se encuentra ganador se sigue la partida ", 
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
    }).catch(err => {
      res.status(404).json({
        message: "Hubo un error al encontrar la partida", 
        error: err
      });
    });  
}


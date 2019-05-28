const Jugador = require("../modelsDB/jugador");
const partidaInGame = require("../modelsDB/partidaInGame");
const gestUser = require("../Scripts/gestionUser");

/**
 * Crea un jugador y lo guarda en mongo atlas, donde se busca que el email sea unico.
 * Input: nombre, email 
 * Output: message:(exito o error), error(solo si falla, info sobre el error), res(resultado de guardar en la base de datos) 
 */
exports.createUser = (req, res, next) => {
    const jugador = new Jugador({
        nombre: req.body.nombre,
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
        postulaciones: req.body.postulaciones,
        tiempoRespuesta: req.body.tiempoRespuesta,
        carta: req.body.carta
    });

    jugador.save().then(result => {
        res.status(200).json({
            message: "Se logro crear el usuario", 
            res: result
        });
    }).catch(err => {
        res.status(404).json({
            message: "Hubo un error al guardar el jugador en la DB", 
            error: err
        });
    });
}

/**
 * Busca en la partida los jugadors, consigue los jugadores de la db y busca por email para devolver el rol de esta persona.
 * Input: nombreA, email 
 * Output: message:(exito o error), error(solo si falla, info sobre el error), res(resultado de guardar en la base de datos) 
 */
exports.obtenerPersonaje = (req, res , next) => {
    let _codigo = req.body.codigo;
    let _nombreA = req.body.nombreA;

    partidaInGame.findOne({codigo: _codigo})
    .then(match =>{
        let personaje = gestUser.conseguirPersonaje(match.jugadores, _nombreA);
        console.log(personaje);
          res.status(200).json({
              message: "Se logro entronctrar el jugador", 
              rol: personaje.nombreCarta,
              descripcion: personaje.descripcionCarta
          });
    })
    .catch(err =>{
        res.status(404).json({
            message: "No se logro encontrar la partida",
            err: err
        });
    });

}

exports.llenarEncuesta = (req, res, next) => {
    let email = req.body.email;
    Jugador.findOne({email: email})
    .then(user => {
        user.sexo = req.body.sexo;
        user.edad = req.body.edad;
        user.carrera = req.body.carrera;
        user.semestre = req.body.semestre;
        user.motivacion = req.body.motivacion;
        user.pensamiento = req.body.pensamiento;
        user.amplitud = req.body.amplitud;
        user.orientacion = req.body.orientacion;
        user.inteligencia = req.body.inteligencia;
        user.innovacion = req.body.innovacion;
        user.tiempoRespuesta = req.body.tiempoRespuesta;

        Jugador.findOneAndUpdate({email: email}, user)
        .then(userModified => {
            res.status(200).json({
                message: "Se logro actualizar al jugador con los datos enviados",
                userModified: userModified
            });
        })
        .catch(err => {
            res.status(404).json({
                message: "Hubo un error al actualizar al jugador con los datos",
                error: err
            });
        });
    })
    .catch(err => {
        res.status(404).json({
            message:"Hubo un problema al encontrar al jugador", 
            error: err
        });
    });
}
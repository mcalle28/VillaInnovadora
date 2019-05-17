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
        email: req.body.email, 
        powerUsed: false, 
        hasVoted: false, 
        beenPostulated: false, 
        hasPostulated: false,
        vida: 1, 
        estado: "vivo", 
        votesAgainst: 0
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
 * Input: nombre, email 
 * Output: message:(exito o error), error(solo si falla, info sobre el error), res(resultado de guardar en la base de datos) 
 */
exports.obtenerPersonaje = (req, res , next) => {
    let _codigo = req.body.codigo;
    let _nombreA = req.body.nombreA;

    partidaInGame.findOne({codigo: _codigo})
    .then(match =>{
        Promise.all(match.jugadores.map(idJugador => {
            return Jugador.findOne({_id: idJugador}).exec();
        })).then(fetchedUser => {
            console.log(fetchedUser);
            let personaje = gestUser.conseguirPersonaje(fetchedUser, _nombreA);
              res.status(200).json({
                  message: "Se logro entronctrar el jugador", 
                  rol: personaje
              });
        }).catch(err => {
            res.status(404).json({
                message: "Problema al encontrar uno de los jugdores", 
                error: err
            });
        });
    })
    .catch(err =>{
        res.status(404).json({
            message: "No se logro encontrar la partida",
            err: err
        });
    });

}
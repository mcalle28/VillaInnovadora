const Jugador = require("../modelsDB/jugador");
const partidaInGame = require("../modelsDB/partidaInGame");

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

exports.obtenerPersonaje = (req, res , next) => {
    let _codigo = req.body.codigo;
    partidaInGame.findOne({codigo: _codigo})
    .then(match =>{
        
    })
    .catch(err =>{
        res.status(404).json({
            message: "No se logro encontrar la partida",
            err: err
        });
    });

}
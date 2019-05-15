const Jugador = require("../modelsDB/jugador");

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
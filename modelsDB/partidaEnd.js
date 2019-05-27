var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

var partidaSchema = new mongoose.Schema({
    codigo: {type: Number, require: true},
    ganadoresPartida: {type: String, require: false},
    jugadores:[{ type: Schema.Types.ObjectId, ref: 'Jugador' }],
    //se usa de la siguiente forma 0: basica, 1 avanzada, 2: personalizada.
    tipoPartida:{type: Number, require: false}
});


partidaSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Partida", partidaSchema);
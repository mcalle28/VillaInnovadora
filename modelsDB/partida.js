var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

var partidaSchema = new mongoose.Schema({
    tipo: {type: String, require: true},
    equipoGanador: {type: String, require: true},
    jugadores:[{
        nombre: {type: String, require: true},
        apellido: {type: String, require: false},
        sexo: {type: String, require: false}, 
        edad: {type: Number, require: false},
        carrera: {type: String, require: false},
        semestre: {type: Number, require: false},
        motivacion: {type: String, require: false},
        pensamiento: {type: String, require: false},
        amplitud: {type: String, require: false},
        orientacion: {type: String, require: false},
        inteligencia: {type: String, require: false},
        innovacion: {type: String, require: false},
    }],
});

partidaSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Partida", partidaSchema);
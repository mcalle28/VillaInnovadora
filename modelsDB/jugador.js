var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


//Este jugador debe se usado con el proposito de tener orden en la partida, cuando se finalice se debera usar jugadorFinished para guardar debidamente a este.
var jugadorSchema = new mongoose.Schema({
        nombre: {type: String, require: true},
        apellido: {type: String, require: false, default: "null"},
        sexo: {type: String, require: false, default: "null"}, 
        edad: {type: Number, require: false, default: 0},
        email: {type: String, required: true, unique: true},
        carrera: {type: String, require: false, default: "null"},
        semestre: {type: Number, require: false, default: 0},
        motivacion: {type: String, require: false, default: "null"},
        pensamiento: {type: String, require: false, default: "null"},
        amplitud: {type: String, require: false, default: "null"},
        orientacion: {type: String, require: false, default: "null"},
        inteligencia: {type: String, require: false, default: "null"},
        innovacion: {type: String, require: false, default: "null"}, 
        tiempoRespuesta: {type: Number, require: false, default: 0}
});

jugadorSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Jugador", jugadorSchema);
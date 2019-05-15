var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");


//Este jugador debe se usado con el proposito de tener orden en la partida, cuando se finalice se debera usar jugadorFinished para guardar debidamente a este.
var jugadorSchema = new mongoose.Schema({
        nombre: {type: String, require: true},
        sexo: {type: String, require: false}, 
        edad: {type: Number, require: false},
        email: {type: String, required: true, unique: true},
        carrera: {type: String, require: false},
        semestre: {type: Number, require: false},
        motivacion: {type: String, require: false},
        pensamiento: {type: String, require: false},
        amplitud: {type: String, require: false},
        orientacion: {type: String, require: false},
        inteligencia: {type: String, require: false},
        innovacion: {type: String, require: false}, 
        estado: {type: String, require: false},
        vida: {type: Number, require: false},
        dataExtra: {type: JSON, require: false},
        protected: {type: Boolean, require: false},
        beenPostulated: {type: Boolean, require: false},
        hasPostulated: {type: Boolean, require: false},
        idea: {type: String, require: false},
        postuloIdeaJuicio: {type: Boolean, require: false},
        votesAgainst: {type: Number, require: false},
        hasVoted: {type: Boolean, require: false},
        powerUsed: {type: Boolean, require: false},
        powerUsedDescription: {type: String, require: false},
        nombreCarta: {type: String, require: false},
        descripcionCarta: {type: String, require: false},
        tiempoRespuesta: {type: Number, require: false}
});

jugadorSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Jugador", jugadorSchema);
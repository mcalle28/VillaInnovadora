var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

var partidaSchema = new mongoose.Schema({
    //-1 para estado de configuracion donde cuando se de comenzar y se hallan asignado roles entonces se cambiara a
    //0 que es un tiempo donde pueden ver su tarjeta y le dan a seguir a 
    //1 Que es la primera noche , luego se pasa al dia que seria 
    //2 y se seguiria el ciclo 1-2 hasta que se lleguen a las condiciones de ganar donde se pasa al estado donde se
    //Finaliza la partida
    eventoSecuenciaActual:{type: Number, require: false},
    codigo: {type: Number, require: true},
    ganadoresPartida: {type: String, require: false},
    jugadores:[{
        nombre: {type: String, require: false},
        email: {type: String, required: false},
        vida: {type: Number, require: false},
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
        }],
    //No se ha puesto tipo de partida, pero se usa de la siguiente forma 0: basica, 1 avanzada, 2: personalizada.
    tipoPartida:{type: Number, require: false},
    secuenciaDia: [{type: String, require: false}],
    secuenciaNoche: [{type: String, require: false}],
    secuenciaEventoEspecial: [{type: String, require: false}],
    estadoActual: {type: String, require: false},
    temaEventoEspecial: {type: String, require: false},
    tituloEventoEspecial: {type: String, require: false},
    tiempo: {type: String, require: false},
});


partidaSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Partida", partidaSchema);
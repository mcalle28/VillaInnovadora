var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    crearRoute = require("./routes/crearPartida"),
    app = express();
    

//mongoose.connect('mongodb://db/villaInnovadora', { useNewUrlParser: true });
//mongoose.connect('mongodb://localhost/villaInnovadora', { useNewUrlParser: true });

mongoose.connect("mongodb+srv://webApi:IxjpYbyed6de8WrC@clustervillainnovadora-ttwgu.mongodb.net/test",{ useNewUrlParser: true })
    .then(() => {
        console.log('Conectado a Base de Datos')
        //myFunc();
    })
    .catch(() => {
        console.log('Error al conectarse a Base de Datos')
    });

process.env.PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use(crearRoute);
//app.use(unirsePartida);
//app.use(obtenerJugadores);
app.listen(process.env.PORT, () => {
});

console.log("Running...");

var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    crearRoute = require("./routes/crearPartida"),
    confMatchRoute = require("./routes/rutasConfiguracionPartida"),
    userManagmentRoute = require("./routes/rutasUserManagment"),
    votesManagmentRoute = require("./routes/rutasVotesManagment"),
    app = express();
    

//mongoose.connect('mongodb://db/villaInnovadora', { useNewUrlParser: true });
//mongoose.connect('mongodb://localhost/villaInnovadora', { useNewUrlParser: true });

mongoose.connect("mongodb+srv://webApi:IxjpYbyed6de8WrC@clustervillainnovadora-ttwgu.mongodb.net/testN",{ useNewUrlParser: true })
    .then(() => {
        console.log('Conectado a Base de Datos')
        //myFunc();
    })
    .catch((error) => {
        console.log('Error al conectarse a Base de Datos')
        console.log(error);
    });

process.env.PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//Rutas
app.use(crearRoute);
app.use(confMatchRoute);
app.use(userManagmentRoute);
app.use(votesManagmentRoute);


app.listen(process.env.PORT, () => {
});

console.log("Running...");

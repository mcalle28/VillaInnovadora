var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cors = require('cors'),
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
app.use(cors({credentials: true, origin: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://villawebgl.s3-website.us-east-2.amazonaws.com');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if ('OPTIONS' == req.method) {
    res.sendStatus(200);
    } else {
      next();
    }
  });
//Rutas
app.use(confMatchRoute);
app.use(userManagmentRoute);
app.use(votesManagmentRoute);


app.listen(process.env.PORT, () => {
});

console.log("Running...");

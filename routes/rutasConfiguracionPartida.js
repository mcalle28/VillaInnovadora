const express = require("express");
const bodyParser = require("body-parser");
const router = express();
const confMatchController = require("../controllers/configuracionPartida.controller");

router.get("/codigoPartida", confMatchController.crearPartida);

//Este metodo toma el codigo de una partida y la configura para el dia y la noche. 
//Tambien pone la secuencia actual y se puede ver como una forma para iniciar la partida.
router.post("/configurarPartida", confMatchController.configurarPartida);
router.post("/unirsePartida", confMatchController.unirJugador);
router.post("/asignarRol", confMatchController.asignarRol);
router.post("/obtenerJugadores", confMatchController.obtenerJugadores);
router.post("/conseguirEventoActual", confMatchController.conseguirEventoActual);



module.exports = router;
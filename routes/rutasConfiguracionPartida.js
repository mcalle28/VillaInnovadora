const express = require("express");
const bodyParser = require("body-parser");
const router = express();
const confMatchController = require("../controllers/configuracionPartida.controller");
const syncManagment = require("../controllers/syncManagment.controller");


/**
 * Este archivo se hace con el proposito de exponer las rutas de la API para la configuracion de una partida, esto incluye el inicio, ejecucion y finalizacion
 * de esta.
 * 
 * Tambien este archivo permite utilizar middleware  para una ruta si se quieren hacer modificaciones al request que llega a esta ruta y poder verificar o
 * normalizar datos para el correcto funcionamiento de la db.
 * 
 * Para esto se usa "router.<typeRequest>.(<"nameOfRoute">, <"middleware1">, <"middleware2">, ... , <"controlador">);"
 * donde middleware1, tomara el request y podra verificar ciertos campos y mandar un error si no se cumple con lo deseado.
 * 
 * Para encontrar los diferentes controladores y middleware que se pueden utilizar, usar los archivos de las carpetas /controllers & /Middleware
 */


//Gestion de configuracion
router.get("/codigoPartida", confMatchController.crearPartida);
router.post("/configurarPartida", confMatchController.configurarPartida);
router.post("/unirsePartida", confMatchController.unirJugador);
router.post("/asignarRol", confMatchController.asignarRol);
router.post("/obtenerJugadores", confMatchController.obtenerJugadores);
router.post("/conseguirEventoActual", confMatchController.conseguirEventoActual);
router.post("/obtenerDesmotivados", confMatchController.obtenerDesmotivados);

//Gestion de ejecucion
router.post("/accionIndeciso", syncManagment.accionIndeciso);
router.post("/seguirAccionIndeciso", syncManagment.seguirAccionIndeciso);
router.post("/accionMentor", syncManagment.accionMentor);
router.post("/seguirAccionMentor", syncManagment.seguirAccionMentor);
router.post("/accionCreaticidas", syncManagment.votacionCreaticidas);
router.post("/accionEstado", syncManagment.accionEstado);
router.post("/seguirAccionEstado", syncManagment.seguirAccionEstado);

router.post("/seguirTransicion", syncManagment.transicion);

router.post("/postulacionRep", syncManagment.postulacionRep);
router.post("/votacionRep", syncManagment.votacionRep);
router.post("/seguirVotRep", syncManagment.seguirVotacionRep);
router.post("/votacionJuicio", syncManagment.votacionJuicio);
router.post("/postulacionJuicio", syncManagment.postulacionJuicio);

router.get("/", (req, res) => {
    res.send("<h1>¡Server Villa Innovadora!</h1>");
});

module.exports = router;
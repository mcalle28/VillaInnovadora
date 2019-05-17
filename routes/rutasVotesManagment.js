const express = require("express");
const bodyParser = require("body-parser");
const router = express();
const votesController = require("../controllers/votesManagment.controller");

/**
 * Este archivo se hace con el proposito de exponer las rutas de la API para el manejo de la votacion del juego, postulacion para los diferentes tipos de evento, 
 * añadir votos y conocer el ganador, ademas de opciones para obtener y conocer estos datos.
 * 
 * Tambien este archivo permite utilizar middleware  para una ruta si se quieren hacer modificaciones al request que llega a esta ruta y poder verificar o
 * normalizar datos para el correcto funcionamiento de la db.
 * 
 * Para esto se usa "router.<typeRequest>.(<"nameOfRoute">, <"middleware1">, <"middleware2">, ... , <"controlador">);"
 * donde middleware1, tomara el request y podra verificar ciertos campos y mandar un error si no se cumple con lo deseado.
 * 
 * Para encontrar los diferentes controladores y middleware que se pueden utilizar, usar los archivos de las carpetas /controllers & /Middleware
 */

router.post("/postularPersona", votesController.postularPersona);
router.post("/obtenerPostulado", votesController.obtenerPostulado);
router.post("/addVotoAPersona", votesController.addVotoPersona);
router.post("/conocerGanador", votesController.conocerGanador);

module.exports = router;
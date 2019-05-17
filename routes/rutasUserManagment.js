const express = require("express");
const bodyParser = require("body-parser");
const router = express();
const userManagment = require("../controllers/userManagment.controller");

/**
 * Este archivo se hace con el proposito de exponer las rutas de la API para el manejo de los usuarios del juego, esto se compone de las operaciones CRUD
 * a la DB sobre los usuarios.
 * 
 * Tambien este archivo permite utilizar middleware  para una ruta si se quieren hacer modificaciones al request que llega a esta ruta y poder verificar o
 * normalizar datos para el correcto funcionamiento de la db.
 * 
 * Para esto se usa "router.<typeRequest>.(<"nameOfRoute">, <"middleware1">, <"middleware2">, ... , <"controlador">);"
 * donde middleware1, tomara el request y podra verificar ciertos campos y mandar un error si no se cumple con lo deseado.
 * 
 * Para encontrar los diferentes controladores y middleware que se pueden utilizar, usar los archivos de las carpetas /controllers & /Middleware
 */
router.post("/crearUsuario", userManagment.createUser);
router.post("/obtenerPersonaje", userManagment.obtenerPersonaje)

module.exports = router;
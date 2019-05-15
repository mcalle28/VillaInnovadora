const express = require("express");
const bodyParser = require("body-parser");
const router = express();
const userManagment = require("../controllers/userManagment.controller");

router.post("/crearUsuario", userManagment.createUser);

module.exports = router;
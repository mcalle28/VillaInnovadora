const express = require("express");
const bodyParser = require("body-parser");
const router = express();
const votesController = require("../controllers/votesManagment.controller");

router.post("/postularPersona", votesController.postularPersona);
router.post("/obtenerPostulado", votesController.obtenerPostulado);
router.post("/addVotoAPersona", votesController.addVotoPersona);
router.post("/conocerGanador", votesController.conocerGanador);

module.exports = router;
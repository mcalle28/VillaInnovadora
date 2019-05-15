const express = require("express");
const bodyParser = require("body-parser");
const router = express();
const syncManagment = require("../controllers/syncManagment.controller");

router.post("/accionIndeciso", syncManagment.accionIndeciso);
router.post("/seguirAccionIndeciso", syncManagment.seguirAccionIndeciso);
router.post("/postulacionCreaticidas", syncManagment.postulacionCreaticidas);
router.post("/accionCreaticidas", syncManagment.votacionCreaticidas);
router.post("/seguirTransicionADia", syncManagment.transicionADia);

module.exports = router;
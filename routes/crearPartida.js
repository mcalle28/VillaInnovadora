'use strict';
var express = require("express");
var router = express();
var Jugador = require("../classes/Jugador");
var Partida = require("../classes/Partida");
var Evento = require("../classes/Evento");
var PartidaSave = require("../modelsDB/partidaInGame");

var partidas = new Map();

router.get("/", (req, res) => {
    res.send("<h1>¡Server Villa Innovadora!</h1>");
}
)


/**
 * 
 * ESTE ESPACIO SE ESPERA BORRAR EN EL FUTURO, LAS RUTAS AQUI SIRVEN PARA GUIAR CON NOMBRES Y TALVES ALGO DE CODIGO QUE FUNCIONARA EN EL REFACTOR, 
 * COMO ESTO ESTABA ENFOCADO A USAR LAS CLASSES , ESTAS TAMBIEN SE BORRARAN CUANDO SE TERMINE CON ESTE DOCUMENTO POR LO QUE NO ES RECOMENDABLE 
 * USAR ESTE ARCHIVO O LA CARPETA /CLASSES PARA EL DESARROLLO DEL JUEGO. 
 * 
 * 
 * 
 */


router.post("/accionMentor", (req, res, next) => {

    if(partidas[req.body.codigo] != undefined){
        var _jugadorMentor = new Jugador("null");
        var _jugadorAConocer = new Jugador("null");
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
        console.log("Estado actual: " + partidas[req.body.codigo].estadoActual);
        partidas[req.body.codigo].jugadores.forEach(e => {
            if(e.nombre == req.body.nombreJugador){
                _jugadorMentor = e;
            }else if(e.nombre == req.body.nombreJugadorAConocer){
                _jugadorAConocer = e;
            }   
        });
        //Desicion debe ser "Creaticida" o de lo contrario sera emprendedor (social)
        _jugadorMentor.carta.poder(_jugadorAConocer,_jugadorMentor);
        console.log("Jugador mentor uso su poder para conocer a " + _jugadorAConocer.nombre);
        _jugadorMentor.powerUsed  = true;
        res.status(200).json({
            message: "Se logro usar el poder del mentor y eligio conocer a  " + _jugadorAConocer.nombre
        });
    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }   

});

router.post("/seguiAccionMentor", (req, res, next) => {

    if(partidas[req.body.codigo] != undefined){
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
        console.log("El estado actual es " + partidas[req.body.codigo].estadoActual);
        // Es un booleano con el mensaje de si debe pasar o no
        res.status(200).json({
            message: true
        })

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }

});

//Este metodo verifica que los creaticidas hallan votado.
// router.post("/accionCreaticidas", (req, res, next) => {
//     if(partidas[req.body.codigo] != undefined){
//     var _contCreat = 0;
//     var _conVotes = 0;
//     partidas[req.body.codigo].jugadores.forEach(e => {
//         if(e.carta.nombre == "Creaticida"){
//             _contCreat = _contCreat + 1;
//             if(e.hasVoted == true){
//                 e.powerUsed = true;
//                 _conVotes = _conVotes + 1;
//             }
//         }
//     });

//     if(_conVotes == _contCreat){
//         partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
//         partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
//         res.status(200).json({
//             message: "Todos los creaticidas han votado",
//             data: true
//         });
//     }else{
//         res.status(404).json({
//             message: "No todos los creaticidas han votado", 
//             data: false
//         });
//     }
// }else{
//     res.status(404).json({
//         message: "No se encontro la partida"
//     });
// }

// });

router.post("/seguiAccionCreaticidas", (req, res, next) => {

    if(partidas[req.body.codigo] != undefined){
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
        // Es un booleano con el mensaje de si debe pasar o no
        res.status(200).json({
            message: true
        })

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }

});

router.post("/accionEstado", (req, res, next) => {

if(partidas[req.body.codigo] != undefined){
    partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
    partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
    partidas[req.body.codigo].jugadores.forEach(e => {
        if(e.nombre == req.body.nombreEstado){
            //La desicion de salvar a alguien o no (true or false)....en el nombre a buscar tambien puede estar el estado para salvarse a si mismo.
            e.carta.poder(partidas[req.body.codigo].jugadores, req.body.nombreABuscar, req.body.desicionA);
            e.powerUsed = true;
            if(req.body.desicionA == "salvar"){
            e.powerUsedDescription = "El usuario desicio salvar";
            }else{
            e.powerUsedDescription = "El usuario decidio desmotivar"
            }
        
        }
    });

    res.status(200).json({
        message: "se tomo la desicion de " + req.body.desicionA
    });

}else{
    res.status(404).json({
        message: "No se logro encontrar la partida"
    });
}

});

router.post("/seguirAccionEstado", (req, res, next) => {

    if(partidas[req.body.codigo] != undefined){
        var _verification = false;
        //Transicion se refiere al cambio del dia a la noche o viceversa
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
        // Es un booleano con el mensaje de si debe pasar o no
        partidas[req.body.codigo].jugadores.forEach(e => {
            if(e.nombre == req.body.nombreEstado){
                if(e.powerUsed == true){
                    _verification = true;
                    e.powerUsed = false;
                }
            }
        });
        res.status(200).json({
            message: _verification
        })

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }

});



router.post("/postulacionRepresentante", (req, res ,next) => {

    if(partidas[req.body.codigo] != undefined){
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual]; 
        console.log("El estado actual es "+ partidas[req.body.codigo].estadoActual);

        var _personasPostuladas = partidas[req.body.codigo].votaciones.conocerPostulados();
        var _contPostulados = _personasPostuladas.length;

        if(_contPostulados > 0){
            res.status(200).json({
                message: "Se han postulado a " + _contPostulados.toString() + " personas",
                data: true,
                postulados: _personasPostuladas
            });
        }else{
            res.status(404).json({
                message: "No hse ha postulado nadie", 
                data: false
            });
        }
    }else{
        res.status(404).json({
            message: "No se encontro la partida", 
            data: false
        });
    }

});

//Este metodo se debe alcanzar cuando se termine la votacion
router.post("/votacionRepresentante", (req, res, next) => {
    if(partidas[req.body.codigo] != undefined){
        var _contEmpr = 0;
        var _conVotes = 0;
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual]; 
        console.log("El estado actual es "+ partidas[req.body.codigo].estadoActual);
        partidas[req.body.codigo].jugadores.forEach(e => {
            if(e.carta.nombre != "Creaticida"){
                _contEmpr = _contEmpr + 1;
                if(e.hasVoted == true){
                    e.powerUsed = true;
                    _conVotes = _conVotes + 1;
                }
            }
        });
    
        if(_conVotes == _contEmpr){
            res.status(200).json({
                message: "Todos los emprendedores han votado",
                data: true
            });
        }else{
            res.status(404).json({
                message: "No todos los emprendedores han votado", 
                data: false
            });
        }
    }else{
        res.status(404).json({
            message: "No se encontro la partida"
        });
    }
});

router.post("/postulacionJuicio", (req, res, next) => {

    if(partidas[req.body.codigo] != undefined){
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual]; 
        console.log("El estado actual es "+ partidas[req.body.codigo].estadoActual);

        var _personasPostuladas = partidas[req.body.codigo].votaciones.conocerPostulados();
        var _contPostulados = _personasPostuladas.length;

        if(_contPostulados > 0){
            res.status(200).json({
                message: "Se han postulado a " + _contPostulados.toString() + " personas",
                data: true,
                postulados: _personasPostuladas
            });
        }else{
            res.status(404).json({
                message: "No hse ha postulado nadie", 
                data: false
            });
        }
    }else{
        res.status(404).json({
            message: "No se encontro la partida", 
            data: false
        });
    }

});

router.post("/votacionJuicio", (req, res, next) => {
    if(partidas[req.body.codigo] != undefined){
        var _conVotes = 0;
        console.log("El estado actual es "+ partidas[req.body.codigo].estadoActual);
        partidas[req.body.codigo].jugadores.forEach(e => {
                if(e.hasVoted == true){
                    e.powerUsed = true;
                    _conVotes = _conVotes + 1;
                }
        });
    
        if(_conVotes == partidas[req.body.codigo].jugadores.length){
            partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
            partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual]; 
            res.status(200).json({
                message: "Todos han participado en la votacion del juicio",
                data: true
            });
        }else{
            res.status(404).json({
                message: "No todos han participado en la votacion del juicio", 
                data: false
            });
        }
    }else{
        res.status(404).json({
            message: "No se encontro la partida"
        });
    }  
});

router.post("/seguirTransicionEventoEspecial", (req, res, next) => {

    var _codigo = req.body.codigo;

    if(partidas[_codigo] != undefined){

        partidas[_codigo].tituloEventoEspecial = req.body.tituloEvento;
        partidas[_codigo].temaEventoEspecial = req.body.descripcionEvento;

        partidas[_codigo].jugadores.forEach(e => {
            e.powerUsed = false;

            if(e.vida = 0 && e.protected != true){
                e.estado = "Desmotivado";
                console.log("La persona " +  e.nombre + " ha sido desmotivada");
            }
        });

        partidas[_codigo].eventoSecuenciaActual = 0;
        partidas[_codigo].estadoActual = partidas[_codigo].secuenciaEventoEspecial[partidas[_codigo].eventoSecuenciaActual];
        console.log("Se puso como evento actual " + partidas[_codigo].estadoActual);

        res.status(200).json({
            message: "Se cambio al estado " + partidas[_codigo].estadoActual 
        });

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }

});

router.post("/tituloDescEventoEspecial", (req, res, next) => {
   
    var _codigo = req.body.codigo;

    if(partidas[_codigo] != undefined){

    res.status(200).json({
        message: "Se logro encontrar titulo y descripcion para el evento", 
        titulo: partidas[_codigo].tituloEventoEspecial,
        descripcion: partidas[_codigo].temaEventoEspecial
    });

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        })
    }

});

router.post("/postularIdeaEventoDia", (req,res, next) => {

    if(partidas[req.body.codigo] != undefined){
        var _jugador = new Jugador("null");
        partidas[req.body.codigo].jugadores.forEach(element => {
            if(element.nombre == req.body.nombreJugador){
                element.idea = req.body.ideaJugador;
                element.hasBeenPostulated = true;
                _jugador = element;
            }
        });
        console.log("El jugador "+ _jugador.nombre + "Ha postulado una idea");
        if(_jugador.nombre != "null"){
            res.status(200).json({
                message: "Se logro encontrar la persona " + req.body.nombreJugador + " y se postulo con la idea: " + req.body.ideaJugador
            }); 
        }else{
            res.status(404).json({
                message: "No se logro encontrar el jugador con el nombre: " +  req.body.nombreJugador
            });
        }

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }

});


//Pasa al dia y dependiendo de la desicion se sigue con evento o con secuencia de la noche
// router.post("/seguirTransicionADia", (req, res, next) => {

//     if(partidas[req.body.codigo] != undefined){

//         var _codigo = req.body.codigo;
//         var _validateRep = false;
//         partidas[_codigo].tiempo = "Dia";

//         partidas[_codigo].jugadores.forEach(e => {
//             e.powerUsed = false;

//             if(e.carta.nombre == "Representante Empresarial"){
//                 _validateRep = true;
//             }
//             if(e.vida = 0 && e.protected != true){
//                 e.estado = "Desmotivado";
//                 console.log("La persona " +  e.nombre + " ha sido desmotivada");
//             }
//         });

//         if(_validateRep == true){
//             console.log("Se ha quitado de la secuencia la postulacion y votacion del representante");
//             partidas[_codigo].secuenciaDia.splice(0,2);
//         }else{
//             console.log("Se ha añadido a postulacion y votacion de representante");
//             partidas[_codigo].secuenciaDia.unshift("votacionRepresentante");
//             partidas[_codigo].secuenciaDia.unshift("postulacionRepresentante");
//         }

//         partidas[_codigo].eventoSecuenciaActual = 0;
//         partidas[_codigo].estadoActual = partidas[_codigo].secuenciaDia[partidas[_codigo].eventoSecuenciaActual];
//         console.log("Se puso como evento actual " + partidas[_codigo].estadoActual);

//         res.status(200).json({
//             message: "Se cambio al estado " + partidas[_codigo].estadoActual 
//         });

//     }else{
//         res.status(404).json({
//             message: "No se puede encontrar la partida"
//         });
//     }

// });

router.post("/seguirTransicionANoche", (req, res, next) => {

    if(partidas[req.body.codigo] != undefined){

        var _codigo = req.body.codigo;
        var _validateIndeciso = false;
        partidas[_codigo].jugadores.forEach(e => {
            e.powerUsed = false;
            if(e.carta.nombre == "Emprendedor Indeciso"){
                _validateIndeciso = true;
            }
            if(e.vida = 0 && e.protected != true){
                e.estado = "Desmotivado";
                console.log("Se ha desmotivado a la persona " + e.nombre);
            }
        });

        //Si el indeciso existe entonces se necesita añadir llamadoIndeciso y accionIndeciso, de lo contrario se necesita quitar estos dos.
        if(_validateIndeciso != true){
            partidas[_codigo].secuenciaNoche.splice(0,2);
        }else{
            partidas[_codigo].secuenciaNoche.unshift("accionIndeciso");
            partidas[_codigo].secuenciaNoche.unshift("llamadoIndeciso");
        }

        partidas[_codigo].tiempo = "Noche";
        partidas[_codigo].eventoSecuenciaActual = 0;
        partidas[_codigo].estadoActual = partidas[_codigo].secuenciaNoche[partidas[_codigo].eventoSecuenciaActual];
        res.status(200).json({
            message: "Se cambio al estado " + partidas[_codigo].estadoActual 
        });
    }else{
        res.status(404).json({
            message: "No se puede encontrar la partida"
        });
    }

});


// router.post("/conseguirEventoActual", (req, res, next) => {

// if(partidas[req.body.codigo] != undefined){

//     res.status(200).json({
//         message: "Se devuelve el evento actual y el dia", 
//         evento : partidas[req.body.codigo].estadoActual,
//         dia: partidas[req.body.codigo].tiempo
//     });

// }else{
//     res.status(404).json({
//         message: "No se encontro la partida"
//     });
// }



// });

//Esta ruta al brindar el nombre de un jugador con un codigo devuelve la carta que este utiliza
// router.post("/obtenerPersonaje", (req,res, next) => {
//     var data;
//     var codigo = req.body.codigo;
//     var nombreABuscar = req.body.nombreA;
//     if(partidas[codigo] != undefined){
//     partidas[codigo].jugadores.forEach(e => {
//         if(e.nombre == nombreABuscar){
//             data = e.carta.nombre;
//         }

//     });

//     res.status(200).json({
//         message:"Busqueda exitosa",
//         rol: data
//     });
//     }else{
//         res.status(404).json({
//             message: "No se encontro la partida, codigo usado: " + req.body.codigo.toString()
//         });
//     }
// });

router.post("/postularLista", (req, res, next) => {
    if(partidas[req.body.codigo] != undefined){
        var codigo = req.body.codigo;
        partidas[codigo].votaciones.setPostulados(_req.body.jugadoresPostulados, partidas[codigo]);
        res.status().json({
            message: "Se envio la lista para postular"
        });

    }else{
        res.status(404).json({
            message: "El codigo enviado no concide con una partida"
        });
    }
});

//Se ponen todas las personas para que no puedan votar, se ponen los votos en contra en 0 y se reinicia la votacion de la partida.
router.post("/finalizarVotacion", (req, res,next) => {
    partidas[req.body.codigo].jugadores.forEach(e =>{
        e.canVote = false;
        e.hasVote = false;
        e.beenPostulated = false;
        e.hasPostulated = false;
        e.votesAgainst = 0;
    });

    partidas[req.body.codigo].votaciones.reiniciarObjeto();

    res.status(200).json({
        message: "Se le quito el permiso para votar a las personas, se quitaron los votos contra estas, y los postulados."
    });
});

router.post("/llenarEncuesta", (req, res , next) => {

    var _codigo = req.body.codigo;
    var _nombreJugador = req.body.nombreJugador;
    //Se espera un objeto json con los campos a llenar de la encuesta.
    var _dataJugador = JSON.parse(req.body.dataJugador);

    if(partidas[_codigo] != undefined){

        partidas[_codigo].jugadores.forEach(e => {
            if(e.nombre == _nombreJugador){
                e.dataExtra = _dataJugador;
                console.log("Data añadida para: " +  e.nombre);
            }
        });
        res.status(200).json({
            message: "Se logro encontrar el jugador y se pudo la data extra para cuando se almacene"
        });

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }

});

router.post("/finalizarPartida", (req, res,next) => {
    console.log("Llega a la encuesta");
    partidas.delete(req.body.codigo);
    if(partidas[req.body.codigo] != undefined){
        var _jugadoresToSave = [];
        partidas[req.body.codigo].jugadores.forEach(e => {
            if(e.dataExtra != {}){
            _jugadoresToSave.push({
                nombre: e.nombre, 
                sexo: e.dataExtra["sexo"],
                edad: e.dataExtra["edad"], 
                carrera: e.dataExtra["carrera"], 
                semestre: e.dataExtra["semestre"], 
                motivacion: e.dataExtra["motivacion"], 
                pensamiento: e.dataExtra["pensamiento"], 
                amplitud: e.dataExtra["amplitud"], 
                orientacion: e.dataExtra["orientacion"], 
                inteligencia: e.dataExtra["inteligencia"], 
                innovacion: e.dataExtra["innovacion"] 
            });
        }else{
            _jugadoresToSave.push({
                nombre: e.nombre
            });
        }
        });
        var _partidaSave = new PartidaSave({
            id: req.body.codigo, 
            tipo: partidas[req.body.codigo].tipoPartida,
            equipoGanador: partidas[req.body.codigo].ganadoresPartida,
            jugadores: _jugadoresToSave,
        });
        _partidaSave.save().then(result => {
            console.log("Partida guardada en base de datos");
            console.log(result);
            res.status(200).json({
                message: "Se logro eliminar la partida correctamente y se guardo esta en la base de datos"
            });
        }).catch(err => {
            res.status(500).json({
                message: "No se logro guardar la partida correctamente",
                error: err
            });
        });
    }else{
        res.status(501).json({
            message: "Hubo un problema al borrar la partida"
        });
    }
});


router.post("/finalizarPartidaMostrar", (req, res,next) => {

    console.log("Nombre: " + req.body.nombre);
    console.log("Sexo: " + req.body.sexo);
    console.log("Edad: " + req.body.edad);
    console.log("Carrera: " + req.body.carrera);
    console.log("Semestre: " + req.body.semestre);
    console.log("Motivación: " + req.body.motivacion);
    console.log("Pensamiento: " + req.body.pensamiento);
    console.log("Amplitud: " + req.body.amplitud);
    console.log("Orientación: " + req.body.orientacion);
    console.log("Inteligencia: " + req.body.inteligencia);

 
});

//Metodo Solicitado para esperar por medio de accion
router.post("/esperaJugador", (req, res, next) => {
    if(req.body.shouldWait){
        res.status(200).json({
            message: "El personaje debe de esperar", 
            data: "wait"
        });
    }else{
        res.status(200).json({
            message: "El jugador no debe esperar", 
            data: "next"
        });
    }
});

//Ruta para conocer si alguien ha usado el poder
router.post("/poderUsadoEstado", (req, res, next) => {
    let fetchedUser;
    partidas[req.body.codigo].jugadores.forEach(e => {
        if(e.nombre == req.body.nombreJugador){
            fetchedUser = e;
        }
    });
    if(fetchedUser.powerUsed == true){
        res.status(200).json({
            message: "La persona ha usado el poder", 
            validation: true,
            description: fetchedUser.powerUsedDescription
        });
    }else{
        res.status(200).json({
            message: "La persona no ha usado el poder", 
            validation: false,
        }); 
    }
});

module.exports = router;

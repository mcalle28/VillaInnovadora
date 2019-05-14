﻿'use strict';
var express = require("express");
var router = express();
var Jugador = require("../classes/Jugador");
var Partida = require("../classes/Partida");
var Evento = require("../classes/Evento");
var PartidaSave = require("../modelsDB/partida");

var gestPartida = require("../Middelware/gestionPartidas");
var gestPer = require("../Middelware/gestionPersonaje");

var partidas = new Map();

router.get("/", (req, res) => {
    res.send("<h1>¡Server Villa Innovadora!</h1>");
}
)

//Este metodo toma el codigo de una partida y la configura para el dia y la noche. 
//Tambien pone la secuencia actual y se puede ver como una forma para iniciar la partida.
router.post("/configurarPartida", (req, res, next) => {

    var _codigo = req.body.codigo;
    var _tipoPartida = req.body.tipoPartida

    if(partidas[_codigo] != undefined){

    if(_tipoPartida == 0){
        if(partidas[_codigo].readyToConfig == true ){
        partidas[_codigo].secuenciaNoche= ["llamadoIndeciso", "accionIndeciso", "llamadoMentor","accionMentor", "postulacionCreaticidas", "votacionCreaticidas",
        "llamadoEstado", "accionEstado", "transicionADia"];
        partidas[_codigo].secuenciaDia = ["postulacionJuicio", "votacionJuicio", "transicionANoche"];
        partidas[_codigo].secuenciaEventoEspecial = ["postulacionEventoEspecial", "votacionEventoEspecial","transicion"];
        partidas[_codigo].eventoSecuenciaActual = partidas[_codigo].eventoSecuenciaActual + 1;
        partidas[_codigo].estadoActual = partidas[_codigo].secuenciaNoche[partidas[_codigo].eventoSecuenciaActual];
        partidas[_codigo].tiempo = "Noche";
        partidas[_codigo].tipoPartida = _tipoPartida;
        console.log("---------------------------------");
        console.log("Partida: " + _codigo.toString());
        console.log("secuenciaNoche: " );
        console.log(partidas[_codigo].secuenciaNoche);
        console.log("secuenciaDia: ");
        console.log(partidas[_codigo].secuenciaDia);
        console.log("Dia: " + partidas[_codigo].tiempo);
        console.log("---------------------------------");
        console.log("Tipo Partida: " + partidas[_codigo].tipoPartida);
        console.log("---------------------------------");
        res.status(200).json({
            message: "Se configuraron las secuencias del dia y la noche, y se puso el tiempo en noche"
        });
    }else{
        res.status(200).json({
            message: "Todavia no se han asignado roles"
        });
    }
    }else if (_tipoPartida == 1){
        if(partidas[_codigo].readyToConfig == true ){
            partidas[_codigo].secuenciaNoche= ["llamadoNetworker","accionNetworker","llamadoIndeciso", "accionIndeciso","llamadoInversionista","accionInversionista",
            "llamadoMentor","accionMentor","llamadoInnovador","accionInnovador","postulacionCreaticidas", "votacionCreaticidas","llamadoCeo","accionCeo","llamadoEstado", "accionEstado", "transicionADia"];
            partidas[_codigo].secuenciaDia = ["postulacionRepresentante", "votacionRepresentante" ,"postulacionJuicio", 
            "votacionJuicio", "transicionANoche"];
            partidas[_codigo].secuenciaEventoEspecial = ["postulacionEventoEspecial", "votacionEventoEspecial","transicion"];
            partidas[_codigo].eventoSecuenciaActual = partidas[_codigo].eventoSecuenciaActual + 1;
            partidas[_codigo].estadoActual = partidas[_codigo].secuenciaNoche[partidas[_codigo].eventoSecuenciaActual];
            partidas[_codigo].tiempo = "Noche";
            partidas[_codigo].tipoPartida = _tipoPartida;
            console.log("---------------------------------");
            console.log("Partida: " + _codigo.toString());
            console.log("secuenciaNoche: " );
            console.log(partidas[_codigo].secuenciaNoche);
            console.log("secuenciaDia: ");
            console.log(partidas[_codigo].secuenciaDia);
            console.log("Dia: " + partidas[_codigo].tiempo);
            console.log("---------------------------------");
            console.log("Tipo Partida: " + partidas[_codigo].tipoPartida);
            console.log("---------------------------------");
            res.status(200).json({
                message: "Se configuraron las secuencias del dia y la noche, y se puso el tiempo en noche"
            });
        }else{
            res.status(200).json({
                message: "Todavia no se han asignado roles"
            });
        }
    }else if (_tipoPartida == 2){
        console.log("Configuracion para partida personalizada");
        res.status(501).json({
            message: "Falta por implementar"
        });
    }else{
        console.log("Fallo por no poner tipoPartida");
        res.status(404).json({
            message: "Fallo por no poner tipoPartida"
        });
    }
}else{

    res.status(404).json({
        message: "No se logro encontrar la partida"
    });

}

});

router.post("/conocerJugadoresCompleto", (req, res, next) => {
    var _jugadores = [];
    partidas[req.body.codigo].jugadores.forEach(e => {
        _jugadores.push(e);
    });
    res.status(200).json({
        jugador: _jugadores
    });
});

router.post("/accionIndeciso", (req, res, next) => {
if(partidas[req.body.codigo] != undefined){
    var _jugadorIndeciso;
    partidas[req.body.codigo].jugadores.forEach(e => {
        if(e.nombre == req.body.nombreA){
            _jugadorIndeciso = e;
        }   
    });
    //Desicion debe ser "Creaticida" o de lo contrario sera emprendedor (social)
    _jugadorIndeciso.carta.poder(_jugadorIndeciso, req.body.desicion);
    console.log("El indeciso uso el poder, y decidio ser " + req.body.desicion);
    partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
    partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
    console.log("Estado actual: " + partidas[req.body.codigo].estadoActual);
    res.status(200).json({
        message: "Se logro usar el poder del indeciso y eligio ser " + _jugadorIndeciso.carta.nombre
    });
}else{
    res.status(404).json({
        message: "No se logro encontrar la partida"
    });
}  

});

router.post("/seguirAccionIndeciso", (req, res, next) => {

    if(partidas[req.body.codigo] != undefined){
        var _message = true;
        partidas[req.body.codigo].jugadores.forEach(element => {
            if(element.carta.nombre == "Emprendedor Indeciso"){
                _message = false;
            }
        });

        if(_message){
            partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
            partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
            console.log("El estado actual " + partidas[req.body.codigo].estadoActual);
        }

        // Es un booleano con el mensaje de si debe pasar o no
        res.status(200).json({
            message: _message
        })

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }

});

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

router.post("/postulacionCreaticidas", (req, res, next) => {
    var _codigo = req.body.codigo;
    var contCreat = 0;
    var hanPostulado = 0;

    partidas[_codigo].jugadores.forEach(e => {
        if(e.carta.nombre == "Creaticida"){
            contCreat = contCreat +1;
        }
        if(e.hasPostulated == true){
            hanPostulado = hanPostulado + 1;
        }
    });

    if(contCreat == hanPostulado){
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
        res.status(200).json({
            message: "Todos los creaticidas han postulado"
        });
    }else{
        res.status(404).json({
            message: "Todavia no han postulado todos los creaticidas"
        });
    }

});

//Este metodo verifica que los creaticidas hallan votado.
router.post("/accionCreaticidas", (req, res, next) => {
    if(partidas[req.body.codigo] != undefined){
    var _contCreat = 0;
    var _conVotes = 0;
    partidas[req.body.codigo].jugadores.forEach(e => {
        if(e.carta.nombre == "Creaticida"){
            _contCreat = _contCreat + 1;
            if(e.hasVoted == true){
                e.powerUsed = true;
                _conVotes = _conVotes + 1;
            }
        }
    });

    if(_conVotes == _contCreat){
        partidas[req.body.codigo].eventoSecuenciaActual = partidas[req.body.codigo].eventoSecuenciaActual + 1;
        partidas[req.body.codigo].estadoActual = partidas[req.body.codigo].secuenciaNoche[partidas[req.body.codigo].eventoSecuenciaActual];
        res.status(200).json({
            message: "Todos los creaticidas han votado",
            data: true
        });
    }else{
        res.status(404).json({
            message: "No todos los creaticidas han votado", 
            data: false
        });
    }
}else{
    res.status(404).json({
        message: "No se encontro la partida"
    });
}

});

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
                e.powerUsedDescription = "haSalvado";
                }else{
                e.powerUsedDescription = "haDesmotivado"
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
router.post("/seguirTransicionADia", (req, res, next) => {

    if(partidas[req.body.codigo] != undefined){

        var _codigo = req.body.codigo;
        var _validateRep = false;
        partidas[_codigo].tiempo = "Dia";

        partidas[_codigo].jugadores.forEach(e => {
            e.powerUsed = false;

            if(e.carta.nombre == "Representante Empresarial"){
                _validateRep = true;
            }
            if(e.vida = 0 && e.protected != true){
                e.estado = "Desmotivado";
                console.log("La persona " +  e.nombre + " ha sido desmotivada");
            }
        });

        if(_validateRep == true){
            console.log("Se ha quitado de la secuencia la postulacion y votacion del representante");
            partidas[_codigo].secuenciaDia.splice(0,2);
        }else{
            console.log("Se ha añadido a postulacion y votacion de representante");
            partidas[_codigo].secuenciaDia.unshift("votacionRepresentante");
            partidas[_codigo].secuenciaDia.unshift("postulacionRepresentante");
        }

        partidas[_codigo].eventoSecuenciaActual = 0;
        partidas[_codigo].estadoActual = partidas[_codigo].secuenciaDia[partidas[_codigo].eventoSecuenciaActual];
        console.log("Se puso como evento actual " + partidas[_codigo].estadoActual);

        res.status(200).json({
            message: "Se cambio al estado " + partidas[_codigo].estadoActual 
        });

    }else{
        res.status(404).json({
            message: "No se puede encontrar la partida"
        });
    }

});

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


router.post("/conseguirEventoActual", (req, res, next) => {

if(partidas[req.body.codigo] != undefined){

    res.status(200).json({
        message: "Se devuelve el evento actual y el dia", 
        evento : partidas[req.body.codigo].estadoActual,
        dia: partidas[req.body.codigo].tiempo
    });

}else{
    res.status(404).json({
        message: "No se encontro la partida"
    });
}



});

router.get("/codigoPartida", function(req, res){
    var nuevoCodigo = gestPartida.añadirPartida(partidas);
    var codigo = {
        codigo: nuevoCodigo
    };
    gestPer.agregarJugador("npc1", nuevoCodigo, partidas);
    gestPer.agregarJugador("npc2", nuevoCodigo, partidas);
    gestPer.agregarJugador("npc3", nuevoCodigo, partidas);
    gestPer.agregarJugador("npc4", nuevoCodigo, partidas);
    gestPer.agregarJugador("npc5", nuevoCodigo, partidas);
    gestPer.agregarJugador("npc6", nuevoCodigo, partidas);
    gestPer.agregarJugador("npc7", nuevoCodigo, partidas);
    gestPer.agregarJugador("npc8", nuevoCodigo, partidas);
    gestPer. agregarJugador("npc9", nuevoCodigo, partidas);
    res.send(codigo);


});

router.post("/condicionParaGanarBasica", (req,res, next) => {
    var codigo = req.body.codigo;
    var contCreat = 0;
    var contEmp = 0;
    //Se comento que en la basica no entra multinacional ni networker.
    partidas[codigo].jugadores.forEach(e => {
        if(e.carta.nombre == "Creaticida" && e.estado != "Desmotivado"){
            contCreat = contCreat + 1;
        }else if(e.vida != 0){
            contEmp = contEmp + 1;
        }
    });
    //Si ninguno de los dos es 0 entonces todavia no hay un ganador
    if(contCreat == 0 || contEmp == 0){
        if(contCreat > 0){
            partidas[codigo].ganadoresPartida = "creaticidas";
            res.status(200).json({
                message: "Ganaron los creaticidas",
                code: 1
            });
        }else{
            partidas[codigo].ganadoresPartida = "emprendedores";
            res.status(200).json({
                message: "Ganaron los Emprendedores y aliados", 
                code : 2
            });
        }
    }else{
        res.status(501).json({
            message: "Todavia no se alcanzan condiciones para ganar",
            code: -1
        });
    }

});

//Esta ruta al brindar el nombre de un jugador con un codigo devuelve la carta que este utiliza
router.post("/obtenerPersonaje", (req,res, next) => {
    var data;
    var codigo = req.body.codigo;
    var nombreABuscar = req.body.nombreA;
    if(partidas[codigo] != undefined){
    partidas[codigo].jugadores.forEach(e => {
        if(e.nombre == nombreABuscar){
            data = e.carta.nombre;
        }

    });

    res.status(200).json({
        message:"Busqueda exitosa",
        rol: data
    });
    }else{
        res.status(404).json({
            message: "No se encontro la partida, codigo usado: " + req.body.codigo.toString()
        });
    }
});

//Este metodo lo pondria en controlador pero no encuetnro la forma de pasar partidas como parametro por el momento.
//Para usar este metodo se deben tener dos Headers: codigo y tipoPartida (donde 0 = basica, 1 avanzada, 2 personalizada)
router.post("/asignarRol", function(req, res){

    var codigo = parseInt(req.body.codigo);
    var tipoPartida = parseInt(req.body.tipoPartida);
    
    //Se usa get ya que asi se llaman a los headers de http que se envia
    var listaJugadores = [];

    if(partidas[codigo].jugadores.length > 6){
        if(tipoPartida == 0){

            var creaticidas = "creaticidas";
            var empBasic = ["emprendedorSocial", "emprendedorCultural", "emprendedorTecnologico"];
            var unicos = ["estado", "mentor", "emprendedorIndeciso"];
            //Esta lista depende de el orden en que estan las anteriores 3 listas.
            var primerosSiete = [creaticidas, creaticidas, unicos[0], unicos[1], empBasic[0], empBasic[1], unicos[2]];

                for (let i = 0; i < 7; i++) {
                    partidas[codigo].jugadores[i].carta.factoryCard(primerosSiete[i]);
                    listaJugadores.push(partidas[codigo].jugadores[i]);          
                }
            var cuantoCreatDebeHaber = listaJugadores.length / 3;
            var numeroCreaticidas = 0;

                for (let i = 0; i < partidas[codigo].jugadores.length; i++) {
                    if(partidas[codigo].jugadores[i].carta.nombre == "Creaticida"){
                        numeroCreaticidas = numeroCreaticidas + 1;
                    }
            }

            var contForEmp = 0;
                for (let i = 7; i < partidas[codigo].jugadores.length; i++){
                    if((listaJugadores.length/numeroCreaticidas) > cuantoCreatDebeHaber){
                        partidas[codigo].jugadores[i].carta.factoryCard("creaticidas");
                        numeroCreaticidas = numeroCreaticidas + 1;
                        listaJugadores.push(partidas[codigo].jugadores[i]);

                    }else{
                        partidas[codigo].jugadores[i].carta.factoryCard(empBasic[contForEmp]);

                        listaJugadores.push(partidas[codigo].jugadores[i]);
                        contForEmp = contForEmp + 1;
                        if(contForEmp == 3){
                            contForEmp = 0;
                        }

                    }
               
                    }
            partidas[codigo].readyToConfig = true;        
            res.status(200).json({
                message: "Roles asignados",
                jugadoresConRoles: listaJugadores
            });    
    
    }else if(tipoPartida == 1){
        //El ultimo que se une es el emprendero indeciso
        partidas[codigo].jugadores[ partidas[codigo].jugadores.length - 1].role = 9;
    
        //Este metodo se debe modificar para hacer que 1/4 de las personas sean creaticidas y algunas roles no se repitan.
       var setCartas = ["Emprendedor Social","Emprendedor Cultural","Emprendedor Tecnologico","Emprendedor Tradicional",
       "Networker","Mentor","Inversionista","Innovador/invesigador","Emprendedor Indeciso","Creaticida","CEO"];
        var aux = 0;
            for (let i = 0; i < partidas[codigo].jugadores.length - 1; i++) {
                aux = i;
                if(aux >= setCartas.length){
                    aux = aux-setCartas.length;
                }
            partidas[codigo].jugadores[i].role = setCartas[aux];
            
        }
    
        res.status(200).json({
            message: "Roles asignados",
            jugadoresConRoles: partidas[codigo].jugadores
        });  
    
    }else{
    
        res.status(400);
        res.send('Not Implemented');
        console.log("Aqui va la implementacion de la asignacion de roles para la personalizada");
    
    }
    
    }else{
        console.log("No se puede comenzar partida porque el numero de participantes es muy bajo.");
        res.status(400);
        res.send('Pocos participantes.');
    }
    
    });

function obtenerJugadores(codigoPartida){
    return partidas[codigoPartida].jugadores;
}

router.post("/unirsePartida", (req, res) => {
    var nombre = req.body.nombreJugador;
    var codigoPartida = req.body.codigo;
    gestPer.agregarJugador(nombre, codigoPartida, partidas);
    var data={
        nombre: nombre
    }
    res.send(data);
});

router.post("/obtenerJugadores", (req, res, next) => {
    if(partidas[req.body.codigo] != undefined){
    var jugadores = obtenerJugadores(parseInt(req.body.codigo));
    var jugadoresEnviar = [];
    jugadores.forEach(jugador => {
        jugadoresEnviar.push({nombre: jugador.nombre, carta: jugador.carta});
    });
    var data = {
        jugadores: jugadoresEnviar 
    }
    res.send(data);
}else{
    res.status(501).json({
        message: "No se encuentra una partida con ese codigo"
    });
}
});

//Aunque esto no tiene efecto en la votacion se hace con el proposito de que el servidor maneje en que evento esta y en unity pregunte constantemente el estado de la partida.
router.post("/darVotoAJugadores", (req, res, next) =>{

    if(partidas[req.body.codigo] != undefined ){

        var codigo = req.body.codigo;
        //Creaticidas o emprendedores
        var quienesVotan = req.body.quienesVotan;

        if(quienesVotan == "creaticidas"){    
        partidas[codigo].jugadores.forEach(e => {
        
            if(e.carta.nombre == "Creaticida"){
                e.canVote = true;
            }else{
                e.canVote = false;
            }
        });
        }else{
            partidas[codigo].jugadores.forEach(e => {
        
                if(e.carta.nombre != "Creaticida"){
                    e.canVote = true;
                }else{
                    e.canVote = false;
                }
    
            });
        }

        res.status(200).json({
            message: "Los " + quienesVotan + " han sido habilitados para votar"
        });

    }else{
        res.status(404).json({
            message: "No se pudo encontrar la partida"
        });
    }

});

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

router.post("/postularPersona", (req, res, next) => {
    if(partidas[req.body.codigo] != undefined){
        var codigo = req.body.codigo;
        partidas[codigo].votaciones.postularJugador(req.body.nombreAPostular, partidas, codigo, req.body.nombrePostulador);
        res.status(200).json({
            message: "Se envio la persona para postular"
        });

    }else{
        res.status(404).json({
            message: "El codigo enviado no concide con una partida"
        });
    }
});

router.post("/obtenerPostulado", (req, res, next) => {
    var jugadorABuscar = new Jugador("null");

    if(partidas[req.body.codigo] != undefined){
    var _postulados = partidas[req.body.codigo].votaciones.conocerPostulados();
    _postulados.forEach(e => {
        if(e.nombre === req.body.nombreBuscar){
            jugadorABuscar = e;
        }
    });
    console.log(jugadorABuscar);
    if(jugadorABuscar.nombre != "null"){
    res.status(200).json({
        message: "Se encontro el jugador " + jugadorABuscar.nombre,
        nombre: jugadorABuscar.nombre,
        idea: jugadorABuscar.idea
    });
    }else{
        res.status(404).json({
            message: "El jugador buscado no se ha postulado"
        });
    }
}else{
    res.status(404).json({
        message: "No se encontro la partida"
    });
}
});
//Eso se alcanza cuando alguien vota por una persona, donde se necesita que en el body este el codigo y nombre.
router.post("/addVotoAPersona", (req, res, next) => {
    if(partidas[req.body.codigo] != undefined){

        var _valid = partidas[req.body.codigo].votaciones.addVoto(req.body.jugadorAVotar, req.body.jugadorVotante);
        partidas[req.body.codigo].jugadores.forEach(e => {
            if(e.nombre == req.body.jugadorVotante){
                e.hasVoted = true;
            }
        });
        
        if(_valid = true ){

            res.status(200).json({
                message: "Se voto por la persona " + req.body.jugadorAVotar
            });

        }else{

            res.status(404).json({
                message: "No se logro encontrar a la persona dentro de los postulados.s"
            });

        }

    }else{
        res.status(404).json({
            message: "No se logro encontrar la partida"
        });
    }
});

router.post("/conocerGanador", (req, res, next) => {
   partidas[req.body.codigoPartida].votaciones.conocerGanador();
   var ganador = partidas[req.body.codigoPartida].votaciones.getGanador();
   if(ganador.nombre != "null"){
       if(partidas[req.body.codigoPartida].estadoActual == "votacionEventoEspecial"){
           partidas[req.body.codigoPartida].jugadores.forEach(e => {
               if(e.nombre == ganador.nombre){
                   e.protected = true;
               }
           });
       }else if(partidas[req.body.codigoPartida].estadoActual == "votacionRepresentante"){
        partidas[req.body.codigoPartida].jugadores.forEach(e => {
            if(e.nombre == ganador.nombre){
                e.carta.factoryCard("representanteEmpresarial");
            }
        });
       }else{
        partidas[req.body.codigoPartida].jugadores.forEach(e => {
            if(e.nombre == ganador.nombre){
                e.vida = e.vida - 1;
                if(e.vida <= 0){
                    e.estado = "Desmotivado";
                }
            }
        });
       }
       res.status(200).json({
           message: "Se encontro al ganador", 
            jugador: ganador
       });
   }else if(partidas[req.body.codigoPartida].votaciones.empate == true){
       //Se debe llamar al representante para que saque la duda.
       res.status(501).json({
           message: "Not implemented, se genera un empate se llama al representante"
       });
   }else{
       res.status(404).json({
           message: "Hubo un problema al encontrar al jugador"
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

module.exports = router;

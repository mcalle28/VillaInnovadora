const gestSync = {};

/**
 * Este archivo tiene como objetivo ayudar a la ejecucion de la partida, donde diferentes tipos de informacion se pueden necesitar.
 */

gestSync.existeIndeciso = function(jugadores){
let validation = false;
jugadores.forEach(element => {
    if(element.nombreCarta == "Emprendedor Indeciso"){
        validation = true;
    }
});

return validation;

}

gestSync.creaticidasHanPostulado = function(jugadores){
    let validation = false;
    let contCreaticidas = 0;
    let contHasPostulated = 0;
    jugadores.forEach(e => {
        if(e.nombreCarta == "Creaticida"){
            contCreaticidas = contCreaticidas + 1;
        }
        if(e.hasPostulated == true){
            contHasPostulated = contHasPostulated + 1;
        }
    });

    if(contCreaticidas == contHasPostulated){
        validation = true;
    }

    return validation;

}

gestSync.creaticidasHanVotado = function(jugadores){
    let validation = false;
    let contCreaticidas = 0;
    let contHasPostulated = 0;
    jugadores.forEach(e => {
        if(e.nombreCarta == "Creaticida"){
            contCreaticidas = contCreaticidas + 1;
        }
        if(e.hasVoted == true){
            contHasPostulated = contHasPostulated + 1;
        }
    });

    if(contCreaticidas == contHasPostulated){
        validation = true;
    }

    return validation;
}

gestSync.condicionesParaGanar = function(jugadores){
    let validation = {
        pass: false, 
        ganador: ""
    };
    let contCreaticidas = 0;
    let contEmp = 0;

    jugadores.forEach(element => {
        if(element.nombreCarta == "Creaticida" && element.vida <= 0){
            contCreaticidas = contCreaticidas + 1;
        }
        //Falta añadir que pasa si son los otros emprendedores
        if(element.nombreCarta == "Emprededor Social" && element.vida <= 0){
            contEmp = contEmp +1;
        }
    });
    if(contCreaticidas > 0){
        validation.pass = true;
        validation.ganador = "Emprendedores";
        return validation;
    }else if(contEmp > 0){
        validation.pass = true;
        validation.ganador = "Creaticidas";
        return validation;
    }else{
        return validation;
    }
}
module.exports = gestSync;
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
    let deatCreat = 0;
    let deatEmp = 0;
    let contCreaticidas = 0;
    let contEmp = 0;

    jugadores.forEach(element => {
        if(element.nombreCarta == "Creaticida"){
            contCreaticidas = contCreaticidas + 1;
            if(element.vida <= 0){
                deatCreat = deatCreat + 1;
            }
        }
        let getEmp = element.nombreCarta.split(" ")[0];
        if(getEmp == "Emprededor"){
            contEmp = contEmp +1;
            if(element.vida <= 0){
                deatEmp = deatEmp + 1;
            }
        }
    });
    if(contCreaticidas = deatCreat){
        validation.pass = true;
        validation.ganador = "Emprendedores";
        return validation;
    }else if(contEmp = deatEmp){
        validation.pass = true;
        validation.ganador = "Creaticidas";
        return validation;
    }else{
        validation.pass = false;
        validation.ganador = "nadie";
        return validation;
    }
}

module.exports = gestSync;
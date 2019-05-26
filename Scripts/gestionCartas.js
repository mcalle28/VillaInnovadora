const gestCartas = {};
const Jugador = require("../modelsDB/jugador");

/**
 * Este gestor permite asignar roles y crear diferentes tipos de cartas.
 */

gestCartas.asignarRol = function(jugadores, tipoPartida){
    let listaJugadores = [];

    if(jugadores.length > 6){
        if(tipoPartida == 0){

            let creaticidas = "creaticidas";
            let empBasic = ["emprendedorSocial", "emprendedorCultural", "emprendedorTecnologico"];
            let unicos = ["estado", "mentor", "emprendedorIndeciso"];
            //Esta lista depende de el orden en que estan las anteriores 3 listas.
            let primerosSiete = [creaticidas, creaticidas, unicos[0], unicos[1], empBasic[1], empBasic[2], unicos[2]];

                for (let i = 0; i < 7; i++) {
                    if(jugadores[i] != undefined){
                    listaJugadores.push(factoryCard(primerosSiete[i], jugadores[i]));
                    }else{
                        console.log("Se trata de iterar sobre un jugador que no esta");
                    }          
                }
            var cuantoCreatDebeHaber = listaJugadores.length / 3;
            var numeroCreaticidas = 2;

                for (let i = 0; i < jugadores.length; i++) {
                    if(jugadores[i].nombreCarta == "Creaticida"){
                        numeroCreaticidas = numeroCreaticidas + 1;
                    }
            }

            var contForEmp = 0;
                for (let i = 7; i < jugadores.length; i++){
                    if((listaJugadores.length/numeroCreaticidas) > cuantoCreatDebeHaber){
                        listaJugadores.push(factoryCard("creaticidas", jugadores[i]));
                        numeroCreaticidas = numeroCreaticidas + 1;

                    }else{
                        listaJugadores.push(factoryCard(empBasic[contForEmp], jugadores[i]));
                        contForEmp = contForEmp + 1;
                        if(contForEmp == 3){
                            contForEmp = 0;
                        }

                    }
               
                    }
            
            return listaJugadores;    
        
    }else if(tipoPartida == 1){
    
        console.log("Falta revisar esta implementacionde asignar roles para avanzada");
        return jugadores; 
    
    }else if(tipoPartida == 2){
        let creaticidas = "creaticidas";
        let empBasic = ["emprendedorSocial", "emprendedorCultural", "emprendedorTecnologico"];
        let unicos = ["estado", "mentor", "emprendedorIndeciso"];
        //Esta lista depende de el orden en que estan las anteriores 3 listas.
        let primerosSiete = [creaticidas, creaticidas, unicos[0], unicos[1], creaticidas, creaticidas, unicos[2]];

            for (let i = 0; i < 7; i++) {
                if(jugadores[i] != undefined){
                listaJugadores.push(factoryCard(primerosSiete[i], jugadores[i]));
                }else{
                    console.log("Se trata de iterar sobre un jugador que no esta");
                }          
            }
        var cuantoCreatDebeHaber = listaJugadores.length / 3;
        var numeroCreaticidas = 2;

            for (let i = 0; i < jugadores.length; i++) {
                if(jugadores[i].nombreCarta == "Creaticida"){
                    numeroCreaticidas = numeroCreaticidas + 1;
                }
        }

        var contForEmp = 0;
            for (let i = 7; i < jugadores.length; i++){
                if((listaJugadores.length/numeroCreaticidas) > cuantoCreatDebeHaber){
                    listaJugadores.push(factoryCard("creaticidas", jugadores[i]));
                    numeroCreaticidas = numeroCreaticidas + 1;

                }else{
                    listaJugadores.push(factoryCard(empBasic[contForEmp], jugadores[i]));
                    contForEmp = contForEmp + 1;
                    if(contForEmp == 3){
                        contForEmp = 0;
                    }

                }
           
                }
        
        return listaJugadores;
    }
}else{
    console.log("No estan los jugadores completos para iniciar");
    return jugadores;
}
}

factoryCard = function(tipo, player){
    switch(tipo){
        case "emprendedorSocial":
        return this.emprededorSocial(player);
        case "emprendedorCultural":
        return this.emprededorCultural(player);
        case "emprendedorTecnologico":
        return this.emprededorTecnologico(player);
        case "emprendedorTradicional":
        return this.emprededorTradicional(player);
        case "networker":
        return this.networker(player);
        case "mentor":
        return this.mentor(player);
        case "inversionista":
        return this.inversionista(player);
        case "innovador":
        return this.innovador(player);
        case "emprendedorIndeciso":
        return this.emprendedorIndeciso(player);
        case "representanteEmpresarial":
        return this.representanteEmpresarial(player);
        case "estado":
        return this.estado(player);
        case "creaticidas":
        return this.creaticidas(player);
        case "ceoMultinacional":
        return this.ceoMultinacional(player);

    }
}

emprededorSocial = function(player) {
    player.nombreCarta = "Aliado Emprededor Social";
    player.descripcionCarta = "Es cercano a la comunidad desinteresado y solidario," + 
    "a veces ingenuo. Su motivación principal no es el dinero, sino el bienestar" +
    "de su comunidad.";
    return player;
}

emprededorCultural= function(player) {
    player.nombreCarta = "Aliado Emprededor Cultural";
    player.descripcionCarta = "Tiene muchas ideas novedosas y habilidades artísticas." + 
    " Le gusta la vida bohemia y vestirse de forma original.";
    return player;  
}

emprededorTecnologico = function(player) {
    player.nombreCarta = "Aliado Emprededor Tecnológico";
    player.descripcionCarta = "Gracias a su ingenio, fortalezas, técnicas y conocimiento es capaz " + 
    "de sacar adelante sus ideas y enfrentar con éstas incluso a las multinacionales.";
    player.vida = player.vida + 1;
    return player;  
}

emprededorTradicional = function(player) {
    player.nombreCarta = "Aliado Emprededor Tradicional";
    player.descripcionCarta = "Es muy apreciado porque es leal, optimista, comunicativo y luchador." + 
    " Nunca intenta dañar a nadie. No tiene ideas novedosas, pero es muy trabajador; no le " +
    " importa extender su jornada laboral más allá de las ocho horas.";
    return player;  
}

networker = function(player){
    player.nombreCarta = "NetWorker";
    player.descripcionCarta = "Lucha por estrechar lazos entre miembros de la villa y contribuye a sacar adelante ideas de las que se enamora.";
    //Se debera checkear en la secuencia si alguno de ellos ha sido desmotivado para desmotivar a todo el grupo.
    return player;
}

mentor = function(player){
    player.nombreCarta = "Aliado Mentor";
    player.descripcionCarta = "Es un personaje curtido en muchas batallas, respetado por su experiencia y trabajo. Es confiable de él se puede aprender.";
    return player;
}

inversionista = function(player){
    player.nombreCarta = "Inversionista";
    player.descripcionCarta = "Tiene recursos financieros, es aventurero y ama el riesgo. Le gusta apoyar cualquier proyecto novedoso si le parece atractivo y hacer buenas inversiones.";
    return player; 
}

innovador = function(player){
    player.nombreCarta = "Innovador/Investigador";
    player.descripcionCarta = "Se caracteriza por ser creativo y estudioso. Busca recursos para sus ideas y protege a los miembros de la Villa con su conocimiento, siempre" + 
    " tiene alguna innovación en mente o patente en trámite.";
    return player;
}

emprendedorIndeciso= function (player){
    player.nombreCarta = "Aliado Emprendedor Indeciso";
    player.descripcionCarta = "Alguien con el potencial para emprender, pero no confía en si mismo.";
    return player;
}

representanteEmpresarial = function(player){
    player.nombreCarta = "Representante Empresarial";
    player.descripcionCarta = "Es un cargo elegido por los actores del ecosistema para ser su representante y defender sus intereses. Se convierte en un actor decisivo para la " + 
    "toma de decisiones dificiles.";
    return player;
}

estado = function(player){
    player.nombreCarta = "Aliado Estado";
    player.descripcionCarta = "Puede apoyar con recursos a un emprendedor y facilitar sus logros o hacer muy dificil su exito por medio de la burocracia los impuestos y los" + 
    "tramites excecivos.";
    return player;
}
creaticidas = function(player){
    player.nombreCarta = "Creaticida";
    player.descripcionCarta = "Son actores del ecosistema con poder, desconfiados y egoistas. Es dificil identificarlos porque se mueven en la sombra y agreden sin mostrar la cara" + 
    ". Matan las iniciativas, atacan los innovadores y cualquiera que compita con ellos; no dudan en eliminar cualquier innovación que los amenace y lo hacen sin remordimientos.";
    return player; 
}

ceoMultinacional = function(player){
    player.nombreCarta = "CEO de multinacional";
    player.descripcionCarta = "Es un personaje individualista que no conoce la lealtad. Se alia por conveniencia, aunque su interes es ser único en su territorio."
    return player;  
}

module.exports = gestCartas;
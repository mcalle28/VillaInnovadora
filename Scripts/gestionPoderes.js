const gestPoderes = {}

/**
 * Este archivo tiene como objetivo poder hacer uso de los poderes de cada personaje dentro de la partida.
 */

gestPoderes.poderIndeciso = function(jugadores, desicion){

let validate = false;

jugadores.forEach(element => {
    try {
        if(element.nombreCarta == "Aliado Emprendedor Indeciso"){
            if(desicion == "Creaticida"){
            element.nombreCarta = "Creaticida";
            element.descripcionCarta = "Son actores del ecosistema con poder, desconfiados y egoistas. Es dificil identificarlos porque se mueven en la sombra y agreden sin mostrar la cara" + 
            ". Matan las iniciativas, atacan los innovadores y cualquiera que compita con ellos; no dudan en eliminar cualquier innovacion que los amenace y lo hacen sin remordimientos.";
            element.powerUsed = true;
            element.powerUsedDescription = "Poder usado para ser creaticida";
            }else{
                element.nombreCarta = "Aliado Emprededor Social";
                element.descripcionCarta = "Es cercano a la comunidad desinteresado y solidario," + 
                "a veces ingenuo. Su motivación principal no es el dinero, sino el bienestar" +
                "de su comunidad.";

            element.powerUsed = true;
            element.powerUsedDescription = "Poder usado para ser Emprendedor";     
            }
            validate = true;
        }  
    } catch (error) {
        console.log(error);
    }
});
return validate;
}

//Este metodo lo que hace es setear al jugador ganador como representante
gestPoderes.poderEleccionRep = function(jugadores, ganador){
    let validate = false;
    
    jugadores.forEach(element => {
        try {
            if(element.email == ganador.email){
                element.nombreCarta2 = "Representante Empresarial";
                element.descripcionCarta2 = "Es un cargo elegido por los actores del ecosistema para ser ru representante y defender sus intereses. Se convierte en un actor desicivo para la " + 
                "toma de desiciones dificiles.";
            }
                validate = true;  
        } catch (error) {
            console.log(error);
        }
    });
    return validate;
}
//Aqui se debe crear el metodo para que el rep tome accion sobre un empate


gestPoderes.poderMentor = function(jugadores, jugadorAConocer, jugadorMentor){
let fetchedPlayer;
let validateMentor = false;
let validatePlayerMeet = false;
jugadores.forEach(e => {
    if(e.email == jugadorAConocer){
        fetchedPlayer = e;
        validatePlayerMeet = true;
    }else if(e.email == jugadorMentor){
        e.powerUsed = true;
        e.powerUsedDescription = "Poder usado para conocer a " + jugadorAConocer.toString();
        validateMentor = true;
    }
});
if(!validatePlayerMeet || !validateMentor){
    fetchedPlayer = undefined;
}
return fetchedPlayer;
}

gestPoderes.poderEstado = function(match, jugadorEstado, jugadorABuscar, desicion){
    let validateEstado = false;
    let validatePlayerMeet = false;
    let dataSend = {
        pass: false,
        jugadores: match.jugadores
    }

    console.log(jugadorEstado);
    console.log(jugadorABuscar);
    match.jugadores.forEach(e => {
        if(e.email == jugadorEstado){
            if(desicion == "salvar"){
            e.powerUsed = true;
            e.powerUsedDescription = "Uso el poder para salvar"
            validateEstado = true;
            }else{
            e.powerUsed = true;
            e.powerUsedDescription = "Uso el poder para desmotivar"
            validateEstado = true;    
            }
        }
        if(e.email == jugadorABuscar){
            if(desicion == "salvar"){
                e.vida = e.vida + 1;
                validatePlayerMeet = true;
            }else{
                e.vida = e.vida - 1;
                validatePlayerMeet = true;
            }
        }
    });
    if(validateEstado && validatePlayerMeet){
        dataSend.pass = true;
    }

    return dataSend;   
}

module.exports = gestPoderes;
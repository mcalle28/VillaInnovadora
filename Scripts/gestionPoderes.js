const gestPoderes = {}

/**
 * Este archivo tiene como objetivo poder hacer uso de los poderes de cada personaje dentro de la partida.
 */

gestPoderes.poderIndeciso = function(jugadores, desicion){

jugadores.forEach(element => {
    try {
        if(element.nombreCarta == "Emprendedor Indeciso"){
            if(desicion == "Creaticida"){
            element.nombreCarta = "Creaticida";
            element.descripcionCarta = "Son actores del ecosistema con poder, desconfiados y egoistas. Es dificil identificarlos porque se mueven en la sombra y agreden sin mostrar la cara" + 
            ". Matan las iniciativas, atacan los innovadores y cualquiera que compita con ellos; no dudan en eliminar cualquier innovacion que los amenace y lo hacen sin remordimientos.";
            element.powerUsed = true;
            element.powerUsedDescription = "Poder usado para ser creaticida";
            }else{
                element.nombreCarta = "Emprededor Social";
                element.descripcionCarta = "Es cercano a la comunidad desinteresado y solidario," + 
                "a veces ingenuo. Su motivación principal no es el dinero, sino el bienestar" +
                "de su comunidad.";

            element.powerUsed = true;
            element.powerUsedDescription = "Poder usado para ser Emprendedor";     
            }
            return true;
        }  
    } catch (error) {
        console.log(error);
        return false;
    }
});
}

gestPoderes.poderMentor = function(jugadores, jugadorAConocer, jugadorMentor){
let fetchedPlayer;
jugadores.forEach(e => {
    if(e.email == jugadorAConocer){
        fetchedPlayer = e;
    }else if(e.email == jugadorMentor){
        e.powerUsed = true;
        e.powerUsedDescription = "Poder usado para conocer a " + jugadorAConocer.toString();
    }
});
return fetchedPlayer;
}

module.exports = gestPoderes;
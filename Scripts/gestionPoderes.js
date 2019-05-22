const gestPoderes = {}

/**
 * Este archivo tiene como objetivo poder hacer uso de los poderes de cada personaje dentro de la partida.
 */

gestPoderes.poderIndeciso = function(jugadores, desicion){

let indeciso;
jugadores.forEach(element => {
    try {
        if(element.nombreCarta == "Emprendedor Indeciso"){
            if(desicion == "Creaticida"){
            element.nombreCarta = "Creaticida";
            element.descripcionCarta = "Son actores del ecosistema con poder, desconfiados y egoistas. Es dificil identificarlos porque se mueven en la sombra y agreden sin mostrar la cara" + 
            ". Matan las iniciativas, atacan los innovadores y cualquiera que compita con ellos; no dudan en eliminar cualquier innovacion que los amenace y lo hacen sin remordimientos.";
            indeciso = element;    
            }else{
                element.nombreCarta = "Emprededor Social";
                element.descripcionCarta = "Es cercano a la comunidad desinteresado y solidario," + 
                "a veces ingenuo. Su motivación principal no es el dinero, sino el bienestar" +
                "de su comunidad.";        
            indeciso = element;
            }
            return true;
        }  
    } catch (error) {
        console.log(error);
        return false;
    }
});

return indeciso;

}

module.exports = gestPoderes;
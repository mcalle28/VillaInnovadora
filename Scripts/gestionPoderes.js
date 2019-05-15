const gestPoderes = {}

gestPoderes.poderIndeciso = function(jugadores, desicion){

let indeciso;
jugadores.forEach(element => {
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
}
});

return indeciso;

}

module.exports = gestPoderes;
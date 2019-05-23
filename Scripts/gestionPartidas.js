const gestPartidas = {};
const Partida = require("../modelsDB/partidaInGame");

/**
 * Este archivo tiene el proposito de ayudar a la partida a poder empezar y finalizar correctamente.
 */


//Para lo que retorna este metodo se usa, 0 = se creo partida basica, 1 = se ecreo partida avanzada, 2= se creo partida personalizada,
// 3 = tipo de partida no adecuado, -1 = no se puede configurar
gestPartidas.configurarPartidas = function(partidas, tipoPartida){
        if(tipoPartida == 0){
        try {
            partidas.secuenciaNoche = ["llamadoIndeciso", "accionIndeciso", "llamadoMentor","accionMentor", "votacionCreaticidas",
            "llamadoEstado", "accionEstado", "transicion"];
            partidas.secuenciaDia = ["postulacionJuicio", 
            "votacionJuicio", "transicion"];
            partidas.secuenciaEventoEspecial = ["postulacionEventoEspecial", "votacionEventoEspecial","transicion"];
            partidas.eventoSecuenciaActual = partidas.eventoSecuenciaActual + 1;
            partidas.estadoActual = partidas.secuenciaNoche[partidas.eventoSecuenciaActual];
            partidas.tiempo = "Noche";
            partidas.tipoPartida = tipoPartida;
            console.log("---------------------------------");
            console.log("Partida: " + _codigo.toString());
            console.log("secuenciaNoche: " );
            console.log(partidas.secuenciaNoche);
            console.log("secuenciaDia: ");
            console.log(partidas.secuenciaDia);
            console.log("Dia: " + partidas.tiempo);
            console.log("---------------------------------");
            console.log("Tipo Partida: " + partidas.tipoPartida);
            console.log("---------------------------------");
            return partidas;
        } catch (error) {
            console.log("Hubo un problema");
            console.log(error);
            return partidas;
        }
    }else if(tipoPartida == 1){
        partidas.secuenciaNoche= ["llamadoNetworker","accionNetworker","llamadoIndeciso", "accionIndeciso","llamadoInversionista","accionInversionista",
        "llamadoMentor","accionMentor","llamadoInnovador","accionInnovador","postulacionCreaticidas", "votacionCreaticidas","llamadoCeo","accionCeo","llamadoEstado", "accionEstado", "transicionADia"];
        partidas.secuenciaDia = ["postulacionRepresentante", "votacionRepresentante" ,"postulacionJuicio", 
        "votacionJuicio", "transicionANoche"];
        partidas.secuenciaEventoEspecial = ["postulacionEventoEspecial", "votacionEventoEspecial","transicion"];
        partidas.eventoSecuenciaActual = partidas.eventoSecuenciaActual + 1;
        partidas.estadoActual = partidas.secuenciaNoche[partidas.eventoSecuenciaActual];
        partidas.tiempo = "Noche";
        partidas.tipoPartida = tipoPartida;
        console.log("---------------------------------");
        console.log("Partida: " + _codigo.toString());
        console.log("secuenciaNoche: " );
        console.log(partidas.secuenciaNoche);
        console.log("secuenciaDia: ");
        console.log(partidas.secuenciaDia);
        console.log("Dia: " + partidas.tiempo);
        console.log("---------------------------------");
        console.log("Tipo Partida: " + partidas.tipoPartida);
        console.log("---------------------------------");
        return partidas;
    }else if(tipoPartida == 2){
        //Motivos de sustentacion
        try {
            partidas.secuenciaNoche = ["llamadoIndeciso", "accionIndeciso","votacionCreaticidas", "transicion"];
            partidas.secuenciaDia = ["postulacionRepresentante", "votacionRepresentante" ,"postulacionJuicio", 
            "votacionJuicio", "transicionANoche"];
            partidas.secuenciaEventoEspecial = ["postulacionEventoEspecial", "votacionEventoEspecial","transicion"];
            partidas.eventoSecuenciaActual = partidas.eventoSecuenciaActual + 1;
            partidas.estadoActual = partidas.secuenciaNoche[partidas.eventoSecuenciaActual];
            partidas.tiempo = "Noche";
            partidas.tipoPartida = tipoPartida;
            console.log("---------------------------------");
            console.log("Partida: " + _codigo.toString());
            console.log("secuenciaNoche: " );
            console.log(partidas.secuenciaNoche);
            console.log("secuenciaDia: ");
            console.log(partidas.secuenciaDia);
            console.log("Dia: " + partidas.tiempo);
            console.log("---------------------------------");
            console.log("Tipo Partida: " + partidas.tipoPartida);
            console.log("---------------------------------");
            return partidas;
        } catch (error) {
            console.log("Hubo un problema");
            console.log(error);
            return partidas;
        }
    }else{
        console.log("Error tipo de partida");
        return partidas;
    }
}

gestPartidas.generarCodigo = function(){
    var codigo = Math.floor(Math.random() * 9000000) + 1000000;
    return codigo;
}

module.exports = gestPartidas;
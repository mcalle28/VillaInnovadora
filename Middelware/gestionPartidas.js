const gestPartidas = {};

var Partida = require("../classes/Partida");

gestPartidas.añadirPartida = function(partidas){

    var partida = new Partida();
    var nuevoCodigo = partida.codigo;
    partidas[nuevoCodigo] = partida;
    return nuevoCodigo;

}

gestPartidas.isValidMatch = function(partidas, codigo){

if(partidas[codigo] != undefined){
    return true;
}else{
    return false;
}
}


//Para lo que retorna este metodo se usa, 0 = se creo partida basica, 1 = se ecreo partida avanzada, 2= se creo partida personalizada,
// 3 = tipo de partida no adecuado, -1 = no se puede configurar
gestPartidas.configurarBasica = function(partidas, _codigo, tipoPartida){
    if(partidas[_codigo].readyToConfig == true ){
        if(tipoPartida == 0){
        partidas[_codigo].secuenciaNoche= ["llamadoIndeciso", "accionIndeciso", "llamadoMentor","accionMentor", "postulacionCreaticidas", "votacionCreaticidas",
        "llamadoEstado", "accionEstado", "transicionADia"];
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
        return Promise.resolve(0);
    }else if(tipoPartida == 1){
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
        return Promise.resolve(1);
    }else if(tipoPartida == 2){
        return Promise.resolve(2);
    }else{
        return Promise.resolve(3);
    }
    }else{
        console.log("Antes de configurar la partida se deben asignar roles");
        return Promise.reject(-1);
    }
}

module.exports = gestPartidas;
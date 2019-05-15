'use strict';

module.exports = class Narrador {
   constructor(nombre) {
       this.nombre = nombre;
       //El texto que va a decir el narrador.
       this.msg = "";
   }

   setNullMsg(){
       this.textoAdecir = "";
   }

   setAsignacionDeRolesMsg(){
        this.msg = "Porfavor miren sus cartas y conozcan sus habilidads. Cuando entiendan su rol presionen seguir";
   }

   setEpocaDeCrisisMsg(){
       this.msg = "Se acerca una epoca de crisis en la villa, Van a ser llamados en orden y haran uso de su poder";
   }

   setEmprendedorIndecisoMsg(){
       this.msg = "Jugador Indeciso es tu turno para seleccionar a que bando vas a pertenecer si a los creaticidas o los emprendedores";
   }

   setMentorMsg(){
       this.msg = "Jugador con el rol de Mentor es tu turno para usar tu poder y conocer la identidad de la persona que creas es creaticida";
   }

   setVotacionCreatMsg0(){
       this.msg = "Jugadores Creaticidas porfavor abran los ojos y conozcan a sus aliados, ahora prosigan a postular a la persona que deseen desmotivar";
   }

   setVotacionCreatMsg1(){
       this.msg = "Ahora las personas voten por las personas que postularon para decidir a la persona que quieren demosivar";
   }

   setEstadoMsg0(){
       this=msg = "Jugador con el Rol Estado, ahora deberas usar tu poder y decidir si alguien que esta desmotivado se salva o no";
   }

   setEstadoMsg1(){
       this.msg = "Estado tambien podras eliminar a alguien que sospeches que es creaticida";
   }

   setMessageStartDay(partidas, codigoPartida){
       var aux = "Jugadores abran los ojos, empieza el dia en la villa, los jugadores que han sido desmotivado  son: ";
       partidas[codigoPartida].jugadores.forEach(e => {
            if(e.vida == 0){
                aux = aux + e.nombre + " .";
            }
       });
       
       this.msg = this.msg + aux;

    }

    setRepresentateMsg0(){
        this.msg = "Los jugadores que deseen postularse para ser representatne de la villa porfavor describan una idea (Describir un tema que se desee tratar en clase) y postulense."
    }

    setRepresentateMsg1(partidas, codigoPartida){
        this.msg = "Los jugadores que se postularon son: ";
        var aux = "";
        partidas[codigoPartida].jugadores.forEach(e => {
            if(e.beenPostulated == true){
                aux = aux + e.nombre + " , con la idea: " + e.idea  + "  -  ";
            }
       });
       
       this.msg = this.msg + aux;

    }

    setEventoMsg0(){
        this.msg = "Empezaremos un evento en la villa donde los jugadores que sean mencionados participaran en este , el ganador ganara proteccion en la votacion";
    }

    setEventoMsg1(){
        this.msg = "Los jugadores seleccionados deberan generar una idea alrededor del tema: (propone el profesor)";
    }

    setEventoMsg2(partidas, codigoPartida){
        this.msg = "Se realizaran las votaciones donde las ideas propuestas son las siguientes: ";
        var aux = "";
        partidas[codigoPartida].jugadores.forEach(e => {
            if(e.beenPostulated == true){
                aux = aux + e.nombre + " , con la idea: " + e.idea  + "  -  ";
            }
       });
       
       this.msg = this.msg + aux;
    }

    setJuicioMsg0(partidas, codigoPartida){
        this.msg = "Empieza la epoca de juicio, los jugadores que tienen protecciones son: "
        var aux = "";
        partidas[codigoPartida].jugadores.forEach(e => {
            if(e.protected == true){
                aux = aux + e.nombre + " .";
            }
       });

       this.msg = this.msg + " Ahora en la epoca de Juicio se postularan las personas que se creen son creaticidas y deben justificar su desicion";
    }

    setJuicioMsg1(partidas, codigoPartida){
        this.msg = "Los jugadores nomidados son los siguientes: ";
        var aux = "";
        partidas[codigoPartida].jugadores.forEach(e => {
            if(e.beenPostulated == true){
                aux = aux + e.nombre;
            }
       });
       this.msg = this.msg + aux;
       //Las personas que los postularon se mostrara su justificacion.
       this.msg = this.msg + " ... Estas personas fueron postuladas con esta justificacion: ";
       var aux = "";
       partidas[codigoPartida].jugadores.forEach(e => {
           if(e.postuloIdeaJuicio == true){
               aux = aux + e.idea + " - " + e.nombre;
           }
      });
      this.msg = this.msg + aux;
    }

    setJuicioMsg2(partidas, codigoPartida){
        var aux = "Jugadores termino el juicio, va a empezar la noche en la villa, los jugadores que han sido desmotivados  son: ";
        partidas[codigoPartida].jugadores.forEach(e => {
             if(e.vida == 0){
                 aux = aux + e.nombre + " .";
             }
        });
        
        this.msg = this.msg + aux;
 
     }


}
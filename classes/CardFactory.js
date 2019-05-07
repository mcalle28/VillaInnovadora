// person.js
'use strict';

const Jugador = require("../classes/Jugador");
const Partida = require("../classes/Partida");

module.exports = class Carta{
    constructor(){
        this.nombre = "";
        this.descripcion = "";
        this.poder = function(){};
    }

    factoryCard(tipo){
        switch(tipo){
            case "emprendedorSocial":
            return this.emprededorSocial();
            case "emprendedorCultural":
            return this.emprededorCultural();
            case "emprendedorTecnologico":
            return this.emprededorTecnologico();
            case "emprendedorTradicional":
            return this.emprededorTradicional();
            case "networker":
            return this.networker();
            case "mentor":
            return this.mentor();
            case "inversionista":
            return this.inversionista();
            case "innovador":
            return this.innovador();
            case "emprendedorIndeciso":
            return this.emprendedorIndeciso();
            case "representanteEmpresarial":
            return this.representanteEmpresarial();
            case "estado":
            return this.estado();
            case "creaticidas":
            return this.creaticidas();
            case "ceoMultinacional":
            return this.ceoMultinacional();

        }
    }

    emprededorSocial() {
        this.nombre = "Emprededor Social";
        this.descripcion = "Es cercano a la comunidad desinteresado y solidario," + 
        "a veces ingenuo. Su motivación principal no es el dinero, sino el bienestar" +
        "de su comunidad.";
    
        //El jugador como poder puede votar, este poder como se pone desde otra rura
        //Entonces solo se maneja el aviso para el server de que sucedio
        this.poder = function( _jugador){
            console.log(_jugador.nombre + " Tiene voto en el momento de desicion");
        }
    }
    
    
    emprededorCultural() {
        this.nombre = "Emprededor Cultural";
        this.descripcion = "Tiene muchas ideas novedosas y habilidades artísticas." + 
        " Le gusta la vida bohemia y vestirse de forma original.";
        this.poder = function(_jugador){
             console.log(_jugador.nombre + " Tiene voto en el momento de desicion.");
         }  
    }
    
    emprededorTecnologico() {
        this.nombre = "Emprededor Tecnológicol";
        this.descripcion = "Gracias a su ingenio, fortalezas, técnicas y conocimiento es capaz " + 
        "de sacar adelante sus ideas y enfrentar con éstas incluso a las multinacionales.";
        this.poder = function(_jugador){
            _jugador.vida = _jugador.vida + 1;
             console.log(_jugador.nombre + " Tiene voto en momento de desicion y una vida extra" );
         }   
    }
    
    emprededorTradicional() {
        this.nombre = "Emprededor Tradicional";
        this.descripcion = "Es nuy apreciado porque es leal, optimista, comunicativo y luchador." + 
        " Nunca intenta dañar a nadie. No tiene ideas novedosas, pero es muy trabajador; no le " +
        " importa extender su jornada laboral más allá de las ocho horas.";
        //Se hara que el representante tome la desicion de exponerse y respecto a esa desicion se usa este poder.
        this.poder = function(_jugador, _desicion){
            if(_desicion == true){
            _jugador.beenPostulated = false;
            console.log(_jugador.nombre + " Tiene voto en momento de desicion y opto por exponerse");
            }else{
            console.log("Tiene voto en el momento de desicion y no opto por exponerse");    
            }
         }   
    }

    networker(){
        this.nombre = "NetWorker";
        this.descripcion = "Lucha por estrechar lazos entre miembros de la villa y contribuye a sacar adelante ideas de las que se enamora.";
        //Se debera checkear en la secuencia si alguno de ellos ha sido desmotivado para desmotivar a todo el grupo.
        this.poder = function(_personasParaRed, _jugador){
            _personasParaRed.forEach(element => {
                _jugador.aliados.push(element);
            });
        }
    }

    mentor(){
        this.nombre = "Mentor";
        this.descripcion = "Es un personaje curtido en muchas batallas, respetado por su experiencia y trabajo. Es confiable de el se puede aprender.";
        this.poder = function(_personajeAConocer, _jugadorMentor){
            if(_personajeAConocer.carta.nombre == "Creaticida"){
                console.log("El mentor "+ _jugadorMentor.nombre +" conocio al creaticida " + _personajeAConocer.nombre);
            }else{
                _jugadorMentor.aliados.push(_personajeAConocer);
                console.log("Se añadio aliado " + _personajeAConocer.nombre + " al mentor " + _jugadorMentor.nombre);
            }
        } 
    }

    inversionista(){
        this.nombre = "Inversionista";
        this.descripcion = "Tiene recursos financieros, es aventurero y ama el riesgo. Le gusta apoyar cualquier proyecto novedoso si le parece atractivo y hacer buenas inversiones";
        //depende de si quiere conocer la informacion de un jugador o si quiere proteger a  una persona porque lo mataron el jugador a conocer va a cambiar.
        this.poder = function(_jugadores, _jugadorAconocer, _jugadorInversionista){
            _jugadores.forEach(element => {
                if(element.nombre == _jugadorAconocer){
                    if(_jugadorInversionista.vida == 0){
                        //Se usa el poder para proteger a alguien porque el inversionista ha muerto
                        element.protected = true;
                        return element;
                    }else{
                        //Se retorna una persona ya que no ha muerto el inversionista y este desea conocer la info de esta persona
                        if(element.carta.nombre == "Creaticida" || "CEO de multinacional"){
                            return element;
                        }else{
                            _jugadorInversionista.aliados.push(element);
                            return element;
                        }
                    }
                }
            });
        } 
    }

    innovador(){
        this.nombre = "Innovador/Investigador";
        this.descripcion = "Se caracteriza por ser creativo y estudioso. Busca recursos para sus ideas y protege a los miembros de la Villa con su conocimiento, siempre" + 
        " tiene alguna innovacion en mente o patente en tramite";
        //Puede proteger a alguien antes de una votacion, este decidira a quien
        this.poder = function(_personajeElegido, _jugadores){
            _jugadores.forEach(element => {
                if(element.nombre == _personajeElegido){
                    element.protected = true;
                }
            });
        } 
    }

    emprendedorIndeciso(){
        this.nombre = "Emprendedor Indeciso";
        this.descripcion = "Alguien con el potencial para emprender, pero no confia en si mismo";
        this.poder = function(_jugador, _desicion){
            if(_desicion == "Creaticida"){
                _jugador.carta.factoryCard("creaticidas");
            }else{
                _jugador.carta.factoryCard("emprendedorSocial");
            }
        } 
    }

    representanteEmpresarial(){
        this.nombre = "Representante Empresarial";
        this.descripcion = "Es un cargo elegido por los actores del ecosistema para ser ru representante y defender sus intereses. Se convierte en un actor desicivo para la " + 
        "toma de desiciones dificiles.";
        //Se le da un arreglo de jugadores emptatados y este tomara una desicion para 
        //Que este ya no este postulado a la votacion del juicio y no tenga votos.
        this.poder = function(_jugadoresEmpatados, _desicion){
            _jugadoresEmpatados.forEach(element => {
                if(element.nombre == desicion){
                    element.beenPostulated = false;
                    element.votesAgainst = 0;
                }
            });
        } 
    }

    estado(){
        this.nombre = "Estado";
        this.descripcion = "Puede apoyar con recursos un a un emprendedor y facilitar sus logros o hacer muy dificil su exito por medio de la burocracia los impuestos y los" + 
        "tramites excecivos.";
        this.poder = function(_jugadores, _nombre, _desicionSafe){
            //El nombre sirve para los 3 casos, si se pone el nombre diferente al estado quiere salvar a 
            //otra persona desmotivada de lo contrario quiere salvarse a si mismo, de lo contrario quiere desmotivar a alguien.
            _jugadores.forEach(element => {
                //Depende del nombre si se salva a si mismo o si salva  a alguien mas.
                if(element.nombre == _nombre && _desicionSafe == "salvar"){
                    element.vida = element.vida + 1;
                }else{
                    element.vida = element.vida - 1;
                    if(element.vida <= 0){
                        element.estado = "Desmotivado";
                    }
                }
            });          
        } 
    }
    creaticidas(){
        this.nombre = "Creaticida";
        this.descripcion = "Son actores del ecosistema con poder, desconfiados y egoistas. Es dificil identificarlos porque se mueven en la sombra y agreden sin mostrar la cara" + 
        ". Matan las iniciativas, atacan los innovadores y cualquiera que compita con ellos; no dudan en eliminar cualquier innovacion que los amenace y lo hacen sin remordimientos.";
        //Retorna un jugador seleccionado por creaticidas, o retorna un jugador nullo de no llegar a un consenso
        this.poder = function(_jugador, _eventoActual){
            if(_eventoActual == "llamadoCreaticidas"){
                console.log(_jugador.nombre + " Tiene voto");
                }else{
                console.log("El Creaticida " + _jugador.nombre  + " no puede votar porque no es el evento adecuado");    
                }
         }  
    }

    ceoMultinacional(){
        this.nombre = "CEO de multinacional";
        this.descripcion = "Es un personaje individualista que no conoce la lealtad. Se alia por conveniencia, aunque su interes es ser unico en su territorio."

        //Retorna un jugador seleccionado por creaticidas, o retorna un jugador nullo de no llegar a un consenso
        this.poder = function(_jugador, _eventoActual){
            if(_eventoActual == "votoCreaticidas"){
            console.log(_jugador.nombre + " Tiene voto");
            }else{
            console.log("El CEO " + _jugador.nombre  + " no puede votar porque no es el evento adecuado");    
            }
        }  
    }

}
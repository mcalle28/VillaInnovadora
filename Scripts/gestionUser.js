const gestUser = {};

/**
 * Este archivo se hace con el proposito de ayudar al controlador del usuario, con el proposito de permitir conocer diferente informacion sobre este.
 * de esta.
 */

gestUser.conseguirPersonaje = function(jugadores, nombreA){
    let userFetched = {};
    console.log(jugadores);
    jugadores.forEach(element => {
        if(element.email == nombreA){
            userFetched = element;
        }
    });
    console.log(userFetched);
    return userFetched;
}

module.exports = gestUser;
const gestUser = {};

gestUser.conseguirPersonaje = function(jugadores, nombreA){
    let userFetched;
    jugadores.forEach(element => {
        if(element.email == nombreA){
            userFetched = element;
        }
    });
    return userFetched;
}

module.exports = {};
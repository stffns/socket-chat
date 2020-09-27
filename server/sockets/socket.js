const {io} = require ( '../server' );
const {Usuarios} = require ( "../classes/usuarios" );
const {crearMensaje} = require ( "../utils/utils" );

const usuarios = new Usuarios ();

io.on ( 'connection' , (client) => {

    client.on ( 'entrarChat' , (usuario , callback) => {

        if (!usuario.nombre || !usuario.sala) {
            return callback ( {
                err: true ,
                message: 'El nombre y la sala es necesario'
            } );
        }

        client.join(usuario.sala);

        usuarios.agregarPersona ( client.id , usuario.nombre, usuario.sala );

        client.broadcast.to(usuario.sala).emit ( 'listaPersonas' , usuarios.getPersonasPorSala(usuario.sala))
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Administrador',`${usuario.nombre} se unió` ));
        callback (usuarios.getPersonasPorSala(usuario.sala));
    } )

    client.on('crearMensaje', (data, callback)=>{

        let persona = usuarios.getPersonaById(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);

    })

    client.on ( 'disconnect' , () => {

        let deletedPerson = usuarios.deletePersona ( client.id );
        client.broadcast.to(deletedPerson.sala).emit ( 'crearMensaje' ,
            crearMensaje ( `Administrador` , `${deletedPerson.nombre} salio del chat` ) );
        client.broadcast.to(deletedPerson.sala).emit('listaPersonas',usuarios.getPersonasPorSala(deletedPerson.sala))

    })

    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersonaById(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);
     })



});


const params = new URLSearchParams(window.location.search);

let nombre = params.get('nombre')
let sala = params.get('sala')

let divUsuarios = $('#divUsuarios');
let formEnviar = $('#formEnviar');
let txtMensaje = $('#txtMensaje');
let divChatBox = $('#divChatbox');


//Funciones para renderizar usuarios

function renderizarUsuarios(personas) {

    console.log(personas);

    let html;
    html = `<li>
                <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
            </li>`

    for (let i = 0; i < personas.length; i++) {
        html += `<li>
                        <a data-id="${personas[i].id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span> ${personas[i].nombre} <small class="text-success">online</small></span></a>
                    </li>`
    }

    divUsuarios.html(html);
}

function renderizarMensajes(mensaje, yo) {

    let fecha = new Date(mensaje.fecha);
    let hora = fecha.getHours() + ':' + fecha.getMinutes();
    let html = '';
    let adminClass = 'info';

    if(mensaje.nombre === 'Administrador'){
        adminClass = 'danger';
    }
    let imagen = '';
    if (mensaje.nombre !== 'Administrador'){
        imagen = '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
    }


    if(!yo) {
        html = `<li class="animated fadeIn">
                    ${imagen}
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-time">${hora}</div>
                </li>`
    }else {
        html = `<li class="reverse animated fadeIn">
                    <div class="chat-content">
                        <h5>${mensaje.nombre}</h5>
                        <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                    </div>
                    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user"/></div>
                    <div class="chat-time">${hora}</div>
                </li>`
    }

    divChatBox.append(html);
}

function scrollBottom(){
    let newMessage = divChatBox.children('li:last-child');

    let clientHeight = divChatBox.prop('clientHeight');
    let scrollTop = divChatBox.prop('scrollTop');
    let scrollHeight = divChatBox.prop('scrollHeight');
    let newMessageHeight = newMessage.innerHeight();
    let lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        divChatBox.scrollTop(scrollHeight);
    }
}


//LISTENERS

divUsuarios.on('click', 'a', function () {
    let id = $(this).data('id');

    if(id){
        console.log(id);
    }
})

formEnviar.on('submit', (e) => {

    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }
    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: txtMensaje.val()
    }, function (mensaje) {
        txtMensaje.val('');
        renderizarMensajes(mensaje, true);
            scrollBottom();
    });


})
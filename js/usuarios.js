document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var instances = M.FormSelect.init(elems);
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

function CargarUsuarios(){  
    $(".filaUsuarios").remove();
    $("#errorBusqueda h3").remove();
    $.post("./php/ObtenerUsuariosIniciales.php")
    .then(function(rta) {
            rta = JSON.parse(rta);
            if(rta.length>0){
                rta.forEach(element => {
                    var htmlTags = '<tr class="filaUsuarios" onclick="AbrirUsuario('+element.ID+');">' +
                    '<td scope="row">' +element.name + '</td>' +
                    '<td>' + element.username + '</td>'+
                    '<td>' + element.password + '</td>'+
                    '<td>' + element.profile + '</td>'+
                    '<td>' + element.status + '</td>'+
                    '</tr>';
                    $('#tabla-usuarios tbody').append(htmlTags);
                });
            }else{
                $('#errorBusqueda').append('<h3>NO HAY USUARIOS PARA MOSTRAR<h3>');
            }
    });
}

function BuscarUsuarios(){
    id = $("#buscadorCliente").val();
    $(".filaUsuarios").remove();
    $("#errorBusqueda h3").remove();
    $("#buscadorCliente").val("");
    $.post("./php/BuscarUsuarios.php",{valorBusqueda:id})
    .then((rta)=>{
            rta = JSON.parse(rta);
            if(rta.length>0){
                rta.forEach(element => {
                    var htmlTags = '<tr class="filaUsuarios" onclick="AbrirUsuario('+element.ID+');">' +
                    '<td scope="row">' +element.name + '</td>' +
                    '<td>' + element.username + '</td>'+
                    '<td>' + element.password + '</td>'+
                    '<td>' + element.profile + '</td>'+
                    '<td>' + element.status + '</td>'+
                    '</tr>';
                    $('#tabla-usuarios tbody').append(htmlTags);
                });
            }else{
                $('#errorBusqueda').append('<h3>NO HAY CLIENTES PARA MOSTRAR<h3>');
            }     
    });

}

function NuevoUsuario(){
    const elem = document.getElementById('modalNuevoUsuario');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

function Cerrar(){
    const elem = document.getElementById('modalNuevoUsuario');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function cargarNuevoUsuario(){
    datos = [];
    nombre = $("#nombre").val();
    usuario = $("#usuario").val();
    password = $("#password").val(); 
    perfil = $("#perfil").val();
    estado = $("#estado").val();
    datos.push(nombre,usuario,password,perfil,estado);
    datos = JSON.stringify(datos);
    if(nombre && usuario && password && perfil && estado){ //Validate OK
        $.post("./php/NuevoUsuario.php",{valorBusqueda:datos}, function(rta) {
            if(rta==="OK"){
                cuteToast({
                    type: "success", // or 'info', 'error', 'warning'
                    message: "USUARIO CARGADO CON EXITO",
                    timer: 3000
                  })
                $('#nuevoUsuario')[0].reset();
                Cerrar();
                CargarUsuarios();
            }else{
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL CARGAR USUARIO. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
            }
        });
    }else{ //Validate NO
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR AL CARGAR USUARIO. COMPLETA TODOS LOS CAMPOS",
            timer: 3000
          })
    }

}

function AbrirUsuario(id){

    $.post("./php/ObtenerDatosCliente.php",{valorBusqueda:id})
    .then(function(rta) {
        rta = JSON.parse(rta);
            if(rta.length>0){
                $("#id_usuario").val(rta[0].ID);
                $("#nombre_usuario").val(rta[0].name);
                $("#username_usuario").val(rta[0].username);
                $("#password_usuario").val(rta[0].password);
                $("#perfil_usuario").val(rta[0].profile);
                $("#estado_usuario").val(rta[0].status);
            }        
    });

    const elem = document.getElementById('modalVerUsuario');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();

}

function CerrarVerUsuario(){
    const elem = document.getElementById('modalVerUsuario');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function ActualizarUsuario(){
    datos = [];
    id=$("#id_usuario").val();
    nombre = $("#nombre_usuario").val();
    usuario = $("#username_usuario").val();
    password = $("#password_usuario").val(); 
    perfil = $("#perfil_usuario").val();
    estado = $("#estado_usuario").val();
    datos.push(id,nombre,usuario,password,perfil,estado);
    datos = JSON.stringify(datos);
    if(nombre && usuario && password && perfil && estado && id){ //Validate OK
        $.post("./php/ActualizarUsuario.php",{valorBusqueda:datos}, function(rta) {
            if(rta==="OK"){
                cuteToast({
                    type: "success", // or 'info', 'error', 'warning'
                    message: "USUARIO ACTUALIZADO CON EXITO",
                    timer: 3000
                  })
                CargarUsuarios();
                AbrirUsuario(id);
            }else{
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL ACTUALIZAR USUARIO. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
            }
        });
    }else{ //Validate NO
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR AL ACTUALIZAR USUARIO. COMPLETA TODOS LOS CAMPOS",
            timer: 3000
          })
    }
}

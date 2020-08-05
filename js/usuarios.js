document.addEventListener('DOMContentLoaded', function() {
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

function AbrirUsuario(id){

    $.post("./php/ObtenerDatosCliente.php",{valorBusqueda:id})
    .then(function(rta) {
        rta = JSON.parse(rta);
            if(rta.length>0){
                $("#id_cliente").val(rta[0]['ID']);
                $("#nombre_cliente").val(rta[0]['nombre']);
                $("#direccion_cliente").val(rta[0]['direccion']);
                $("#telefono_cliente").val(rta[0]['telefono']);
                $("#email_cliente").val(rta[0]['email']);
                $("#CUIT_cliente").val(rta[0]['CUIT']);
                CargarDependencias(id);
                CargarOrdenes(id);
            }        
    });

    const elem = document.getElementById('modalFichaUsuario');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();

}

function cargarNuevoUsuario(){
    datos = [];
    suma = 0;
    nombre = $("#nombre").val();
    direccion = $("#direccion").val();
    telefono = $("#telefono").val(); 
    cuit = $("#CUIT").val();
    email = $("#email").val();
    if(nombre) suma ++;
    if(direccion) suma ++;
    if(telefono) suma ++;
    if(cuit) suma ++;
    if(email) suma ++;
    datos.push(nombre,direccion,telefono,cuit,email);
    datos = JSON.stringify(datos);
    if(suma===5){ //Validate OK
        $.post("NuevoCliente.php",{valorBusqueda:datos}, function(rta) {
            if(rta==="OK"){
                cuteToast({
                    type: "success", // or 'info', 'error', 'warning'
                    message: "CLIENTE CARGADO CON EXITO",
                    timer: 3000
                  })
                $('#verCliente')[0].reset();
            }else{
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL CARGAR CLIENTE. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
            }
        });
    }else{ //Validate NO
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR AL CARGAR CLIENTE. COMPLETA TODOS LOS CAMPOS",
            timer: 3000
          })
    }

}

function Cerrar(){
    const elem = document.getElementById('modalVerCliente');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function CerrarVerCliente(){
    const elem = document.getElementById('modalFichaCliente');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function AbrirUsuario(id){

    $.post("ObtenerDatosCliente.php",{valorBusqueda:id}, function(rta) {
        rta = JSON.parse(rta);
        if(rta){ 
            if(rta){
                $("#id_cliente").val(rta[0]['ID']);
                $("#nombre_cliente").val(rta[0]['nombre']);
                $("#direccion_cliente").val(rta[0]['direccion']);
                $("#telefono_cliente").val(rta[0]['telefono']);
                $("#email_cliente").val(rta[0]['email']);
                $("#CUIT_cliente").val(rta[0]['CUIT']);
                CargarDependencias(id);
                CargarOrdenes(id);
            }            
        };
    });


    
    const elem = document.getElementById('modalFichaCliente');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();

}

function NuevoCliente(){
    const elem = document.getElementById('modalVerCliente');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

function ActualizarCliente(){
    datos = [];
    suma = 0;
    id = $("#id_cliente").val();
    nombre = $("#nombre_cliente").val();
    direccion = $("#direccion_cliente").val();
    telefono = $("#telefono_cliente").val(); 
    cuit = $("#CUIT_cliente").val();
    email = $("#email_cliente").val();
    if(nombre) suma ++;
    if(direccion) suma ++;
    if(telefono) suma ++;
    if(cuit) suma ++;
    if(email) suma ++;
    datos.push(id,nombre,direccion,telefono,cuit,email);
    datos = JSON.stringify(datos);
    if(suma===5){ //Validate OK
        $.post("ActualizarCliente.php",{valorBusqueda:datos}, function(rta) {
            if(rta==="OK"){
                cuteToast({
                    type: "success", // or 'info', 'error', 'warning'
                    message: "CLIENTE ACTUALIZADO CON EXITO",
                    timer: 3000
                  })
                AbrirCliente(id);
            }else{
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL ACTUALIZAR CLIENTE. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
            }
        });
    }else{ //Validate NO
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR AL ACTUALIZAR CLIENTE. COMPLETA TODOS LOS CAMPOS",
            timer: 3000
          })
    }
}


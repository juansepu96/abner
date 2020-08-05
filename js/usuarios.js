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
                    var htmlTags = '<tr class="filaUsuarios">' +
                    '<td scope="row">' +element.name + '</td>' +
                    '<td>' + element.username + '</td>'+
                    '<td>' + element.password + '</td>'+
                    '<td>' + element.profile + '</td>'+
                    '<td>' + element.status + '</td>'+
                    '<td></td></tr>';
                    $('#tabla-usuarios tbody').append(htmlTags);
                });
            }else{
                $('#errorBusqueda').append('<h3>NO HAY CLIENTES PARA MOSTRAR<h3>');
            }
    });
}


function BuscarClientes(){
    id = $("#buscadorCliente").val();
    $(".filaClientes").remove();
    $("#errorBusqueda h3").remove();
    $("#buscadorCliente").val("");
    $.post("BuscarClientes.php",{valorBusqueda:id}, function(rta) {
        if(rta){ 
            rta = JSON.parse(rta);
            if(rta.length>0){
                rta.forEach(element => {
                    var htmlTags = '<tr class="filaClientes" onclick="AbrirCliente('+element['ID']+');">' +
                    '<td scope="row">' + element['nombre'] + '</td>' +
                    '<td>' + element['direccion'] + '</td>'+
                    '<td>' + element['telefono'] + '</td>'+
                    $.post("VerificarEstadoCuenta.php",{valorBusqueda:id}, function(rta) {
                    }).then((rta)=>{
                        if(rta==='OK'){
                            htmlTags=htmlTags+'<td style="color:red;font-weight:bold;">EN DEUDA</td></tr>';
                        }else{
                            htmlTags=htmlTags+'<td style="color:green;font-weight:bold;">AL DIA</td></tr>';
                        }   
                        $('#tabla-clientes tbody').append(htmlTags);
                    });       
                });
            }else{
                $('#errorBusqueda').append('<h3>NO HAY CLIENTES PARA MOSTRAR<h3>');
            }            
        }else{
            $('#errorBusqueda').append('<h3>ERROR DE CONEXIÓN CON LA BASE DE DATOS<h3>');
        }
    });

}

function ValidarCUIT(){
    $("#error_cuit").show();
    $("#ok_cuit").hide();
    sCUIT = $("#CUIT").val();
    var aMult   = '6789456789';
    var aMult   = aMult.split('');
    var sCUIT   = String(sCUIT);
    var iResult = 0;
    var aCUIT = sCUIT.split('');
    
    if (aCUIT.length == 11)
    {
        // La suma de los productos
        for(var i = 0; i <= 9; i++)
        {
            iResult += aCUIT[i] * aMult[i];
        }
        // El módulo de 11
        iResult = (iResult % 11);
        
        // Se compara el resultado con el dígito verificador
        if (iResult == aCUIT[10]){
            $("#error_cuit").hide();
            $("#ok_cuit").show();
        }
    }    
}

function cargarNuevoCliente(){
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

function AbrirCliente(id){

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

function ValidarCUITAlActualizar(){
    $("#error_cuit_cliente").show();
    $("#ok_cuit_cliente").hide();
    sCUIT = $("#CUIT_cliente").val();
    var aMult   = '6789456789';
    var aMult   = aMult.split('');
    var sCUIT   = String(sCUIT);
    var iResult = 0;
    var aCUIT = sCUIT.split('');
    
    if (aCUIT.length == 11)
    {
        // La suma de los productos
        for(var i = 0; i <= 9; i++)
        {
            iResult += aCUIT[i] * aMult[i];
        }
        // El módulo de 11
        iResult = (iResult % 11);
        
        // Se compara el resultado con el dígito verificador
        if (iResult == aCUIT[10]){
            $("#error_cuit_cliente").hide();
            $("#ok_cuit_cliente").show();
        }
    }    
}

function CargarDependencias(id){
    $(".filaDependencias").remove();
    $("#errorBusquedaDependencias h3").remove();

    $.post("ObtenerDependencias.php",{valorBusqueda:id}, function(rta) {
        if(rta){ 
            rta = JSON.parse(rta);
            if(rta){
                rta.forEach(element => {
                    var htmlTags = '<tr class="filaDependencias">' +
                    '<td scope="row">' + element['ID'] + '</td>' +
                    '<td scope="row">' + element['nombre'] + '</td>' +
                    '</tr>';            
                    $('#tabla-dependencias tbody').append(htmlTags);

                });
            }else{
                $('#errorBusquedaDependencias').append('<h3>NO HAY CLIENTES PARA MOSTRAR<h3>');
            }
            
        }else{
            $('#errorBusquedaDependencias').append('<h3>ERROR DE CONEXIÓN CON LA BASE DE DATOS<h3>');
        }
    });
}

function AbrirDependencia(){
    const elem = document.getElementById('modalNuevaDependencia');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

function CerrarDependencia(){
    const elem = document.getElementById('modalNuevaDependencia');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function NuevaDependencia(){
    var datos = [];
    id = $("#id_cliente").val();
    nombre = $("#name_dependencia").val();
    datos.push(id,nombre);
    datos = JSON.stringify(datos);
    if(nombre){
        $.post("NuevaDependencia.php",{valorBusqueda:datos}, function(rta) {
            if(rta==="OK"){
                CerrarVerCliente();
                $("#name_dependencia").val("");
                cuteToast({
                    type: "success", // or 'info', 'error', 'warning'
                    message: "DEPENDENCIA CARGADA CON EXITO",
                    timer: 3000
                  })

                AbrirCliente(id);
            }else{
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL CARGAR DEPENDENCIA. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
            }
        });
    }else{
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR AL CARGAR DEPENDENCIA. DEBE INGRESAR UN NOMBRE",
            timer: 3000
          })
    }


}

function CargarOrdenes(id){

    $(".filaOrdenes").remove();
    $("#errorBusquedaOrdenes h3").remove();

    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() +1 )).slice(-2);
    var today = (now.getFullYear()-1)+"-"+(month)+"-"+(day) ;
    $("#filter_fecha_desde").val(today);


    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() +1 )).slice(-2);
    var today = (now.getFullYear())+"-"+(month)+"-"+(day) ;
    $("#filter_fecha_hasta").val(today);


    $.post("ObtenerOrdenes.php",{valorBusqueda:id}, function(rta) {
        if(rta){ 
            rta = JSON.parse(rta);
            if(rta.length>0){
                rta.forEach(element => {
                    fecha = moment(element['date']);
                    fecha = fecha.format("DD/MM/YYYY");
                    var orden = element['ID'];
                    var htmlTags = '<tr class="filaOrdenes">' +
                    '<td><div class="switch"><label><input value="'+orden+'" type="checkbox"> <span class="lever"></span></label></div> </td>' +
                    '<td scope="row">' + orden + '</td>' +
                    '<td scope="row">' + fecha + '</td>' +
                    '<td scope="row" onclick="EditarEstado('+orden+');">' + element['state'] + '</td>' +
                    '<td scope="row"> $ ' + element['amount'] + '</td>' ;
                    if(element['ID_dependence']==null){
                        htmlTags=htmlTags+'<td scope="row"> ---- </td>';
                        htmlTags=htmlTags+ '<td> <div style="display:inline-flex"> <div class="send"><i onclick="EnviarPDF('+orden+');" style="font-size:30px;" class="material-icons">email</i> </div> <div class="export"><i onclick="ExportarPDF('+orden+');" style="font-size:30px;" class="material-icons">picture_as_pdf</i> </div> <div class="eliminar"><i onclick="EliminarOrden('+orden+');" style="font-size:30px;" class="material-icons eliminar">delete</i> </div> </div> </td></tr>';
                        $('#tabla-ordenes tbody').append(htmlTags);
                    }else{
                        var nom_dependencia="";
                        $.post("ObtenerNombreDependencia.php",{valorBusqueda:element['ID_dependence']}, function(rta) {
                        }).then((rta)=>{
                            nom_dependencia=rta;
                            htmlTags=htmlTags+'<td scope="row"> '+nom_dependencia+' </td>';
                            htmlTags=htmlTags+ '<td> <div style="display:inline-flex"> <div class="send"><i onclick="EnviarPDF('+orden+');" style="font-size:30px;" class="material-icons">email</i> </div> <div class="export"><i onclick="ExportarPDF('+orden+');" style="font-size:30px;" class="material-icons">picture_as_pdf</i> </div> <div class="eliminar"><i onclick="EliminarOrden('+orden+');" style="font-size:30px;" class="material-icons eliminar">delete</i> </div> </div> </td></tr>';
                            $('#tabla-ordenes tbody').append(htmlTags);
                        });
                    }

                });
            }else{
                $('#errorBusquedaOrdenes').append('<h3>NO HAY ORDENES PARA MOSTRAR<h3>');
            }
            
        }else{
            $('#errorBusquedaOrdenes').append('<h3>ERROR DE CONEXIÓN CON LA BASE DE DATOS<h3>');
        }
    });
}

function ElegirDependencia(){
    id = $("#id_cliente").val();
    $(".botonDependencia").remove();

    $.post("ObtenerDependencias.php",{valorBusqueda:id}, function(rta) {
        rta = JSON.parse(rta);    
        if(rta.length>0){
                rta.forEach(element => {
                    nro_dependencia = element['ID'];
                    nom_dependencia = element['nombre'];
                    htmlTags = '<a class="waves-effect waves-light btn-large botonDependencia" style="margin:15px;" onclick="AbrirNuevaOrden('+nro_dependencia+');">'+nom_dependencia+'</a> ';
                    $('#selectorDependencias').append(htmlTags);
                });  
                const elem = document.getElementById('modalVerDependencias');
                const instance = M.Modal.init(elem, {dismissible: false});
                instance.open();
        }else{
            AbrirNuevaOrden();
        }       
    });   
}

function CerrarElegirDependencia(){
    const elem = document.getElementById('modalVerDependencias');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function AbrirNuevaOrden(dependencia=null){
    var elem = document.getElementById('modalVerDependencias');
    var instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
    $("#nro_dependencia_elegida").val(dependencia);

    if(dependencia!==null){
        $.post("ObtenerNombreDependencia.php",{valorBusqueda:dependencia}, function(rta) {
            $("#nombre_dependencia_elegida").val('DEPENDENCIA: '+rta);
            $("#nombre_dependencia_elegida").show();
        });   
    
    }
    
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear()+"-"+(month)+"-"+(day) 
    $("#fecha_orden").val(today);

    var elem = document.getElementById('modalNuevaOrden');
    var instance = M.Modal.init(elem, {dismissible: false});    
    instance.open();   
}

function CerrarNuevaOrden(){
    const elem = document.getElementById('modalNuevaOrden');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function AbrirNuevoItem(){
    const elem = document.getElementById('modalNuevoItem');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

function CerrarNuevoItem(){
    const elem = document.getElementById('modalNuevoItem');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function AgregarItem(){
    var item = {
        descripcion : $("#nombre_item").val(),
        precio : $("#precio_item").val()
    }
    if(item.descripcion  && item.precio){
        array.push(item);
        ActualizarItems(array);
        CerrarNuevoItem();
        $("#nombre_item").val("");
        $("#precio_item").val("");
    }else{
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR. EL ITEM DEBE TENER UN DETALLE Y UN MONTO",
            timer: 3000
          })
    }
   
}

function BorrarItem(index){
    array.splice(index, 1);
    cuteToast({
        type: "success", // or 'info', 'error', 'warning'
        message: "ITEM ELIMINADO CON EXITO",
        timer: 3000
      })
    ActualizarItems(array);
}

function ActualizarItems(array){
    $(".OrdenItem").remove();
    var total=0;
    for (var i=1;i<array.length;i++){
        precio = parseFloat(array[i].precio)
        total = total + precio;
        var htmlTags = '<tr class="OrdenItem">' +
            '<td >' + i + '</td>' +
            '<td>' + array[i].descripcion + '</td>'+
            '<td>  $ ' + precio.toFixed( 2 ) + '</td>'+
            '<td class="eliminar" onclick="BorrarItem('+i+');"> <i style="font-size:30px;" class="material-icons">delete</i> </td>'+'</tr>';
           
            $('#tabla-orden tbody').append(htmlTags);
    }
    $("#monto_orden").val("");
    $("#monto_orden").val(total.toFixed(2));
}

function NuevaOrden(){
    var encabezado = [];
    id = $("#id_cliente").val();
    fecha = $("#fecha_orden").val();
    estado = $("#estado_orden").val();
    monto = $("#monto_orden").val();
    id_dependencia = $("#nro_dependencia_elegida").val();
    if(array.length>1){

        encabezado.push(id,id_dependencia,fecha,estado,monto);
        encabezado = JSON.stringify(encabezado);

        $.post("InsertarOrdenEncabezado.php",{valorBusqueda:encabezado}, function(rta) { //Inserto Encabezado
            if(rta != null){   //Inserto detalles    
                array.push(rta);
                array = JSON.stringify(array);
                CargarImagenOrder(rta);
                $.post("InsertarOrdenDetalles.php",{valorBusqueda:array}, function(rta) { //Inserto detalles
                    if(rta==='OK'){   //Todo OK
                        cuteToast({
                            type: "success", // or 'info', 'error', 'warning'
                            message: "ORDEN CARGADA CON EXITO",
                            timer: 3000
                          })
                        
                        CerrarNuevaOrden();
                        CargarOrdenes(id);
                        array = [{}];
                        ActualizarItems(array);
                    }else{ //Error!!
                        cuteToast({
                            type: "error", // or 'info', 'error', 'warning'
                            message: "ERROR AL CARGAR LA ORDEN. CONTACTE AL ADMINISTRADOR",
                            timer: 3000
                          })
                    }
                });
    
            }else{ //Error!!
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL CARGAR LA ORDEN. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
                
            }
        });


    }else{
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR AL CARGAR LA ORDEN. DEBE COMPLETAR TODOS LOS CAMPOS",
            timer: 3000
          })
    }
}

function CargarImagenOrder(id){
    var formData = new FormData(document.getElementById("formulario_foto"));
    console.log(formData);
    formData.append("id_orden", id);
     $.ajax({
        url: "recibe.php",
        type: "post",
        dataType: "html",
        data: formData,
        cache: false,
        contentType: false,
        processData: false
    }).done((rta) => {
        alert(rta);
    });
}

function EliminarOrden(id){
    id_cliente=$("#id_cliente").val();

    if(confirm('CONFIRMA QUE DESEA ELIMINAR LA ORDEN N° '+id+' ?. ESTA ACCION ES IRREVERSIBLE!! ')){
        $.post("EliminarOrden.php",{valorBusqueda:id}, function(rta) {
            if(rta==="OK"){
                cuteToast({
                    type: "success", // or 'info', 'error', 'warning'
                    message: "ORDEN ELIMINADA CON EXITO",
                    timer: 3000
                  })
                CargarOrdenes(id_cliente);
            }else{
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL ELIMINAR LA ORDEN. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
            }
        }); 
    }else{
        cuteToast({
            type: "info", // or 'info', 'error', 'warning'
            message: "ACCION CANCELADA",
            timer: 3000
          })

    }

}

function ActualizarTabla(){

    $(".filaOrdenes").remove();
    $("#errorBusquedaOrdenes h3").remove();

    var datos = [];
    id=$("#id_cliente").val();
    desde = $("#filter_fecha_desde").val();
    hasta = $("#filter_fecha_hasta").val();
    estado= $("#filter_estado").val();
    datos.push(id,desde,hasta,estado);
    datos = JSON.stringify(datos);

    $.post("ObtenerOrdenesFiltradas.php",{valorBusqueda:datos}, function(rta) {
        if(rta){ 
            rta = JSON.parse(rta);
            if(rta.length>0){
                rta.forEach(element => {
                    fecha = moment(element['date']);
                    fecha = fecha.format("DD/MM/YYYY");
                    orden = element['ID'];
                    var htmlTags = '<tr class="filaOrdenes">' +
                    '<td><div class="switch"><label><input value="'+orden+'" type="checkbox"> <span class="lever"></span></label></div> </td>' +
                    '<td scope="row">' + orden + '</td>' +
                    '<td scope="row">' + fecha + '</td>' +
                    '<td scope="row" onclick="EditarEstado('+orden+');">' + element['state'] + '</td>' +
                    '<td scope="row"> $ ' + element['amount'] + '</td>' ;
                    if(element['ID_dependence']==null){
                        htmlTags=htmlTags+'<td scope="row"> ---- </td>';
                        htmlTags=htmlTags+ '<td> <div style="display:inline-flex"> <div class="export"><i onclick="ExportarPDF('+orden+');" style="font-size:30px;" class="material-icons">picture_as_pdf</i> </div> <div class="eliminar"><i onclick="EliminarOrden('+orden+');" style="font-size:30px;" class="material-icons eliminar">delete</i> </div> </div> </td></tr>';
                        $('#tabla-ordenes tbody').append(htmlTags);
                    }else{
                        var nom_dependencia="";
                        $.post("ObtenerNombreDependencia.php",{valorBusqueda:element['ID_dependence']}, function(rta) {
                        }).then((rta)=>{
                            nom_dependencia=rta;
                            htmlTags=htmlTags+'<td scope="row"> '+nom_dependencia+' </td>';
                            htmlTags=htmlTags+ '<td> <div style="display:inline-flex"> <div class="export"><i onclick="ExportarPDF('+orden+');" style="font-size:30px;" class="material-icons">picture_as_pdf</i> </div> <div class="eliminar"><i onclick="EliminarOrden('+orden+');" style="font-size:30px;" class="material-icons eliminar">delete</i> </div> </div> </td></tr>';
                            $('#tabla-ordenes tbody').append(htmlTags);
                        });
                    }
                });
            }else{
                $('#errorBusquedaOrdenes').append('<h3>NO HAY ORDENES PARA MOSTRAR<h3>');
            }
            
        }else{
            $('#errorBusquedaOrdenes').append('<h3>ERROR DE CONEXIÓN CON LA BASE DE DATOS<h3>');
        }
    });


}

function ResetearFiltros(){
    CargarOrdenes($("#id_cliente").val());
}

function EditarEstado(id){
    $("#id_orden_editar_estado").val(id);
    const elem = document.getElementById('modalEditarEstado');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

function CerrarEditarEstado(){
    const elem = document.getElementById('modalEditarEstado');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function ActualizarEstadoOrden(){
    var datos=[];
    id=$("#id_orden_editar_estado").val();
    estado=$("#nuevo_estado_orden").val();
    datos.push(id,estado);
    datos = JSON.stringify(datos);
    $.post("ActualizarEstadoOrden.php",{valorBusqueda:datos}, function(rta) {
        if(rta==='OK'){
            cuteToast({
                type: "success", // or 'info', 'error', 'warning'
                message: "ESTADO DE LA ORDEN ACTUALIZADO CON EXITO",
                timer: 3000
              })
            CerrarEditarEstado();
            CargarOrdenes($("#id_cliente").val());
        }else{
            cuteToast({
                type: "error", // or 'info', 'error', 'warning'
                message: "ERROR AL ACTUALIZAR EL ESTADO. CONTACTE AL ADMINISTRADOR",
                timer: 3000
              })
        }
    });   
}

function ExportarPDF(id){
    $.post("./remito/CargarDatosPDF.php",{valorBusqueda:id}
    ).then((res) => {
        window.open("./remito/GenerarPDF.php", '_blank');
    }); 
    cuteToast({
        type: "success", // or 'info', 'error', 'warning'
        message: "GENERANDO ARCHIVO. ESPERE....",
        timer: 12000
      });
    
}

function EnviarPDF(id){
    cuteToast({
        type: "success", // or 'info', 'error', 'warning'
        message: "SE ENVIO CON ÉXITO EL ARCHIVO",
        timer: 3000
      });
    $.post("./remito/CargarDatosPDF.php",{valorBusqueda:id}
    ).then((res) => {
        $.post("./remito/EnviarPDF.php");
    }); 
}

function ExportarTablaPDF(){

    cuteToast({
        type: "success", // or 'info', 'error', 'warning'
        message: "GENERANDO ARCHIVO. ESPERE....",
        timer: 12000
      });

      var remitos = [];
      remitos.push($("#id_cliente").val());
      $("input:checkbox:checked").each(function() {
          remitos.push($(this).val());
     });
  
      datos = JSON.stringify(remitos);
  

    $.post("./remito/CargarEstadoCuenta.php",{valorBusqueda:datos}
    ).then(() => {
        window.open("./remito/GenerarEstadoCuenta.php", '_blank');
    }); 
    
    

}

function EnviarTablaPDF(){

    cuteToast({
        type: "success", // or 'info', 'error', 'warning'
        message: "SE ENVIO CON ÉXITO EL ESTADO DE CUENTA",
        timer: 3000
    });

    var remitos = [];
    remitos.push($("#id_cliente").val());
    $("input:checkbox:checked").each(function() {
        remitos.push($(this).val());
   });

    datos = JSON.stringify(remitos);

    
    $.post("./remito/CargarEstadoCuenta.php",{valorBusqueda:datos}
    ).then( () => {
        $.post("./remito/EnviarEstadoCuenta.php");
    }); 

    
    

}
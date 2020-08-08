$(document).ready(function() {
    $("#buscadorProducto").on('keyup', function (e) {
    e.preventDefault();
    var keycode = e.keyCode || e.which;
      if (keycode == 13) {
          BuscarProductos();
      }
  });
});

function CargarProductos(){
    $(".filaProductos").remove();
    $("#errorBusqueda h3").remove();
    $.post("./php/ObtenerProductosIniciales.php")
    .then(function(rta) {
            rta = JSON.parse(rta);
            if(rta.length>0){
                rta.forEach(element => {
                    var htmlTags = '<tr class="filaProductos" onclick="AbrirProducto('+element.ID+');">' +
                    '<td scope="row">' +element.code + '</td>' +
                    '<td>' + element.name + '</td>'+
                    '<td> $ ' + element.price_p + '</td>'+
                    '<td> $ ' + element.price_s + '</td>'+
                    '<td>' + element.stock + '</td>'+
                    '</tr>';
                    $('#tabla-productos tbody').append(htmlTags);
                });
            }else{
                $('#errorBusqueda').append('<h3>NO HAY PRODUCTOS PARA MOSTRAR<h3>');
            }
    });
}

function BuscarProductos(){
    id = $("#buscadorProducto").val();
    $(".filaProductos").remove();
    $("#errorBusqueda h3").remove();
    $("#buscadorProducto").val("");
    $.post("./php/BuscarProductos.php",{valorBusqueda:id})
    .then((rta)=>{
            rta = JSON.parse(rta);
            if(rta.length>0){
                rta.forEach(element => {
                    var htmlTags = '<tr class="filaProductos" onclick="AbrirProducto('+element.ID+');">' +
                    '<td scope="row">' +element.code + '</td>' +
                    '<td>' + element.name + '</td>'+
                    '<td> $ ' + element.price_p + '</td>'+
                    '<td> $ ' + element.price_s + '</td>'+
                    '<td>' + element.stock + '</td>'+
                    '</tr>';
                    $('#tabla-productos tbody').append(htmlTags);
                });
            }else{
                $('#errorBusqueda').append('<h3>NO HAY PRODUCTOS PARA MOSTRAR<h3>');
            }     
    });
}

function NuevoProducto(){
    const elem = document.getElementById('modalNuevoProducto');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

function Cerrar(){
    const elem = document.getElementById('modalNuevoProducto');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function cargarProducto(){
    var datos=[];
    codigo = $("#codigo").val();
    nombre = $("#nombre").val();
    precio_p = $("#precio_p").val();
    precio_s = $("#precio_s").val();
    precio_p=precio_p.replace(',','.');
    precio_s=precio_s.replace(',','.');
    stock = $("#stock").val();
    datos.push(codigo,nombre,precio_p,precio_s,stock);
    datos = JSON.stringify(datos);
    if(nombre && codigo && precio_p && precio_s && stock){ //Validate OK
        $.post("./php/NuevoProducto.php",{valorBusqueda:datos})
        .then(function(rta) {
            if(rta==="OK"){
                cuteToast({
                    type: "success", // or 'info', 'error', 'warning'
                    message: "PRODUCTO CARGADO CON EXITO",
                    timer: 3000
                  })
                $('#nuevoproducto')[0].reset();
                Cerrar();
                CargarProductos();
            }else{
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL CARGAR PRODUCTO. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
            }
        });
    }else{ //Validate NO
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR AL CARGAR PRODUCTO. COMPLETA TODOS LOS CAMPOS",
            timer: 3000
          })
    }
}

function AbrirProducto(id){
    $("#id_producto").val(" ");
    $("#codigo_producto").val(" ");
    $("#nombre_producto").val(" ");
    $("#precio_p_producto").val(" ");
    $("#precio_s_producto").val(" ");
    $("#stock_producto").val(" ");
    $.post("./php/ObtenerDatosProducto.php",{valorBusqueda:id})
    .then((rta) => {
        rta = JSON.parse(rta);
            if(rta.length>0){
                $("#id_producto").val(rta[0].ID);
                $("#codigo_producto").val(rta[0].code);
                $("#nombre_producto").val(rta[0].name);
                $("#precio_p_producto").val(rta[0].price_p);
                $("#precio_s_producto").val(rta[0].price_s);
                $("#stock_producto").val(rta[0].stock);
            }            
    });
    const elem = document.getElementById('modalEditarProducto');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
}

function CerrarEditarProducto(){
    const elem = document.getElementById('modalEditarProducto');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function ActualizarProducto(){
    var datos=[];
    id=$("#id_producto").val();
    codigo = $("#codigo_producto").val();
    nombre = $("#nombre_producto").val();
    precio_p = $("#precio_p_producto").val();
    precio_s = $("#precio_s_producto").val();
    precio_p=precio_p.replace(',','.');
    precio_s=precio_s.replace(',','.');
    stock = $("#stock_producto").val();
    datos.push(id,codigo,nombre,precio_p,precio_s,stock);
    datos = JSON.stringify(datos);
    if(nombre && codigo && precio_p && precio_s && stock){ //Validate OK
        $.post("./php/ActualizarProducto.php",{valorBusqueda:datos})
        .then(function(rta) {
            if(rta==="OK"){
                cuteToast({
                    type: "success", // or 'info', 'error', 'warning'
                    message: "PRODUCTO ACTUALIZADO CON EXITO",
                    timer: 3000
                  })
                $('#editarproducto')[0].reset();
                CerrarEditarProducto();
                CargarProductos();
            }else{
                cuteToast({
                    type: "error", // or 'info', 'error', 'warning'
                    message: "ERROR AL ACTUALIZAR PRODUCTO. CONTACTE AL ADMINISTRADOR",
                    timer: 3000
                  })
            }
        });
    }else{ //Validate NO
        cuteToast({
            type: "error", // or 'info', 'error', 'warning'
            message: "ERROR AL ACTUALIZAR PRODUCTO. COMPLETA TODOS LOS CAMPOS",
            timer: 3000
          })
    }
}
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

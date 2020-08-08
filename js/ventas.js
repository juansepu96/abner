document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
});

$(document).ready(function() {
    $("#buscadorProducto").on('keyup', function (e) {
    e.preventDefault();
    var keycode = e.keyCode || e.which;
      if (keycode == 13) {
          BuscarProductos();
      }
    });

   

});

var guardado = localStorage.getItem('arrayVentas');
var guardado=JSON.parse(guardado);

if(!guardado){
  var arrayProductos=[{}];
}else{
  var arrayProductos = guardado;
  ActualizarTabla(arrayProductos);
}

function ActualizarTabla(array){
  $("#buscadorProducto").focus();
  $("#totalizador").val("");
  $(".filaTabla").remove();
  var total=0;
  for(var i = 1;i<array.length;i++){
    total=total+parseFloat(array[i].precio);
    var htmlTags = '<tr class="filaTabla">' +
                    '<td scope="row">' + i + '</td>' +
                    '<td>' + array[i].codigo + '</td>'+
                    '<td>' + array[i].nombre + '</td>'+
                    '<td>' + array[i].precio + '</td>'+
                    '<td><div class="eliminar"><i onclick="EliminarItem('+i+');" style="font-size:30px;" class="material-icons eliminar">delete</i> </div></td>'+
                    '</tr>';
    $('#tabla-venta tbody').append(htmlTags);
  }
  total=parseFloat(total);
  total = total.toFixed(2);
  $("#totalizador").val(total);
  localStorage.setItem('arrayVentas', JSON.stringify(array));
}

function BuscarProductos(){
  id = $("#buscadorProducto").val();
  $("#errorBusqueda h3").remove();
  $("#buscadorProducto").val("");
  $.post("./php/BuscarProductos.php",{valorBusqueda:id})
  .then((rta)=>{
          rta = JSON.parse(rta);
          if(rta.length==1){
              producto = {
                codigo : rta[0].code,
                nombre : rta[0].name,
                precio : rta[0].price_s
              }
              arrayProductos.push(producto);
              ActualizarTabla(arrayProductos); 
              cuteToast({
                type: "success", // or 'info', 'error', 'warning'
                message: "CARGADO",
                timer: 1000
              })
          }else if(rta.length==0){
            cuteToast({
              type: "error", // or 'info', 'error', 'warning'
              message: "NO ENCONTRADO",
              timer: 1000
            })
          }else if(rta.length>1){
            SeleccionarProducto(rta);
          }     
  });
}

function SeleccionarProducto(array){
  $(".filaElegirProducto").remove();
  for (var i = 0;i<array.length;i++){
    var htmlTags = '<tr class="filaElegirProducto" onclick="CargarProductoArray('+array[i].ID+');">' +
                    '<td>' + array[i].code + '</td>'+
                    '<td>' + array[i].name + '</td>'+
                    '<td>' + array[i].price_s + '</td>'+
                    '</tr>';
    $('#tabla-elegirproducto tbody').append(htmlTags);

    const elem = document.getElementById('modalElegirproducto');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
  }
}

function CerrarSeleccionarProducto(){
  const elem = document.getElementById('modalElegirproducto');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.close();
}

function CargarProductoArray(id){
  CerrarSeleccionarProducto();
  $.post("./php/BuscarProductoPorID.php",{valorBusqueda:id})
  .then((rta)=>{
          rta = JSON.parse(rta);
          if(rta.length==1){
              producto = {
                codigo : rta[0].code,
                nombre : rta[0].name,
                precio : rta[0].price_s
              }
              arrayProductos.push(producto);
              ActualizarTabla(arrayProductos); 
              cuteToast({
                type: "success", // or 'info', 'error', 'warning'
                message: "CARGADO",
                timer: 1000
              })
          }  
  });
}

function EliminarItem(index){
    arrayProductos.splice(index, 1);
    cuteToast({
        type: "success", // or 'info', 'error', 'warning'
        message: "ITEM ELIMINADO CON EXITO",
        timer: 1000
      })
    ActualizarTabla(arrayProductos);
}

function NuevoAjuste(){

}

function DescartarVenta(){

}

function GuardarVenta(){
  
}

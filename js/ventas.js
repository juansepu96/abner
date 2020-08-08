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
    precio = parseFloat(array[i].precio);
    precio = precio.toFixed(2);
    var htmlTags = '<tr class="filaTabla">' +
                    '<td scope="row">' + i + '</td>' +
                    '<td>' + array[i].codigo + '</td>'+
                    '<td>' + array[i].nombre + '</td>'+
                    '<td> $' + precio + '</td>'+
                    '<td><div class="eliminar"><i onclick="EliminarItem('+i+');AumentarStock('+array[i].id+');" style="font-size:30px;" class="material-icons eliminar">delete</i> </div></td>'+
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
                id: rta[0].ID,
                codigo : rta[0].code,
                nombre : rta[0].name,
                precio : rta[0].price_s,
                precio_compra : rta[0].price_p

              }
              arrayProductos.push(producto);
              ActualizarTabla(arrayProductos); 
              cuteToast({
                type: "success", // or 'info', 'error', 'warning'
                message: "CARGADO",
                timer: 1000
              })
            $.post("./php/DisminuirStock.php",{valorBusqueda:rta[0].ID});
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
    precio = parseFloat(array[i].price_s);
    precio = precio.toFixed(2);
    var htmlTags = '<tr class="filaElegirProducto" onclick="CargarProductoArray('+array[i].ID+');">' +
                    '<td>' + array[i].code + '</td>'+
                    '<td>' + array[i].name + '</td>'+
                    '<td> $ ' + precio + '</td>'+
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
                id : rta[0].ID,
                codigo : rta[0].code,
                nombre : rta[0].name,
                precio : rta[0].price_s,
                precio_compra : rta[0].price_p
              }
              arrayProductos.push(producto);
              ActualizarTabla(arrayProductos); 
              cuteToast({
                type: "success", // or 'info', 'error', 'warning'
                message: "CARGADO",
                timer: 1000
              })
              $.post("./php/DisminuirStock.php",{valorBusqueda:rta[0].ID});
          }  
  });
}

function EliminarItem(datos){
    arrayProductos.splice(datos[0], 1);
    cuteToast({
        type: "success", // or 'info', 'error', 'warning'
        message: "ITEM ELIMINADO CON EXITO",
        timer: 1000
      })
    ActualizarTabla(arrayProductos);
}

function AumentarStock(id){
  $.post("./php/AumentarStock.php",{valorBusqueda:id});

}

function NuevoAjuste(){
  const elem = document.getElementById('modalAjuste');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.open();
}

function CargarAjuste(){
  detalle = $("#detalle_item").val();
  precio = $("#importe_item").val();
  if(precio.length>0){
    precio = precio.replace(",",".");
  }
  if(detalle && !isNaN(precio) && precio){
    detalle = detalle.toUpperCase();
    producto = { 
      codigo : "99999",
      nombre : detalle,
      precio : precio
    }
    arrayProductos.push(producto);
    ActualizarTabla(arrayProductos); 
    cuteToast({
      type: "success", // or 'info', 'error', 'warning'
      message: "AJUSTE REALIZADO CON EXITO",
      timer: 1000
    })
    $("#ajustes")[0].reset();
    const elem = document.getElementById('modalAjuste');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
  }else{
    cuteToast({
      type: "error", // or 'info', 'error', 'warning'
      message: "HAY CAMPOS INCOMPLETOS O NO INGRESO UN IMPORTE VALIDO",
      timer: 3000
    })
  }
  
}

function DescartarVenta(){
  cuteAlert({
    type: "question",
    title: "¿REALMENTE QUIERE DESCARTAR LA VENTA?",
    message: "ESTA ACCION ES IRREVERSIBLE",
    confirmText: "Aceptar",
    cancelText: "Cancelar"
}).then((e)=>{
    if ( e == ("confirm")){
      arrayProductos=[{}];
      ActualizarTabla(arrayProductos);
      cuteToast({
        type: "success", // or 'info', 'error', 'warning'
        message: "SE DESCARTÓ LA VENTA",
        timer: 3000
      });
  } else {
    cuteToast({
        type: "info", // or 'info', 'error', 'warning'
        message: "ACCION CANCELADA",
        timer: 3000
      })
    }
  })
}

function CerrarCargarAjuste(){
  const elem = document.getElementById('modalAjuste');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.close();
}

function CerrarMetodoPago(){
  const elem = document.getElementById('modalMetodo');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.close();
}

function GuardarVenta(){
  if(arrayProductos.length>1){
    total = $("#totalizador").val();
    $("#efectivo").val(total);
    const elem = document.getElementById('modalMetodo');
    const instance = M.Modal.init(elem, {dismissible: false});
    instance.open();
  }else{
    cuteToast({
      type: "error", // or 'info', 'error', 'warning'
      message: "NO HAY NINGUN PRODUCTO EN LA VENTA",
      timer: 3000
    });
  }
  
}

function CargarVenta(){
  var datos = [];
  efectivo = $("#efectivo").val();
  efectivo= efectivo.replace(",",".");
  efectivo = parseFloat(efectivo);
  mp = $("#mp").val();
  mp= mp.replace(",",".");
  mp = parseFloat(mp);
  tarjeta = $("#tarjeta").val();
  tarjeta= tarjeta.replace(",",".");
  tarjeta = parseFloat(tarjeta);
  total = $("#totalizador").val();
  total = parseFloat(total);
  datos.push(total,efectivo,mp,tarjeta);
  datos = JSON.stringify(datos);
  if(total == (efectivo+mp+tarjeta)){
    CerrarMetodoPago();
    cuteAlert({
      type: "question",
      title: "¿REALMENTE QUIERE GUARDAR LA VENTA?",
      message: "ESTA ACCION ES IRREVERSIBLE",
      confirmText: "Aceptar",
      cancelText: "Cancelar"
      }).then((e)=>{
          if ( e == ("confirm")){
                $.post("./php/InsertarEncabezadoVenta.php",{valorBusqueda:datos}) 
                .then((id)=>{
                  arrayProductos.push(id);
                  detalles = JSON.stringify(arrayProductos);
                  $.post("./php/InsertarDetallesVenta.php",{valorBusqueda:detalles})
                  .then((rta)=>{
                    console.log(rta);
                    
                    if(rta=="OK"){
                      cuteToast({
                        type: "success", // or 'info', 'error', 'warning'
                        message: "VENTA GUARDADA CON ÉXITO",
                        timer: 3000
                      });
                      arrayProductos=[{}];
                      ActualizarTabla(arrayProductos);
                    }else{
                      cuteToast({
                        type: "error", // or 'info', 'error', 'warning'
                        message: "ERROR AL GUARDAR VENTA. CONTACTE AL ADMINISTRADOR.",
                        timer: 3000
                      });
                    }
                    
                  });
                });         
        } else {
          cuteToast({
              type: "info", // or 'info', 'error', 'warning'
              message: "ACCION CANCELADA",
              timer: 3000
            })
          }
    })
  }else{
    cuteToast({
      type: "error", // or 'info', 'error', 'warning'
      message: "ERROR. LA SUMA DE LOS MEDIOS DE PAGO ES DIFERENTE AL TOTAL DE LA VENTA",
      timer: 3000
    });
  }
}

function AbrirListarVentas(){
  const elem = document.getElementById('modalListarVentas');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.open();
}

function ListarVentas(){
  $(".filaVentas").remove();
  fecha = moment().format("YYYY-MM-D");
  fecha2 = moment().format("YYYY-MM-D");
  $("#filter_fecha_hasta").val(fecha);
  $("#filter_fecha_desde").val(fecha);
  var datos = [];
  datos.push(fecha,fecha2);
  datos = JSON.stringify(datos);
  $.post("./php/ObtenerVentas.php",{valorBusqueda:datos})
  .then((rta)=>{
    rta = JSON.parse(rta);
    if(rta.length>0){
      for (var i = 0;i<rta.length;i++){
        fecha = moment(rta[i].date).format("DD/MM/YYYY");
        total = parseFloat(rta[i].total);
        total = total.toFixed(2);
        efectivo = parseFloat(rta[i].total_cash);
        efectivo = efectivo.toFixed(2);
        mp = parseFloat(rta[i].total_mp);
        mp = mp.toFixed(2);
        tarjeta = parseFloat(rta[i].total_card);
        tarjeta = tarjeta.toFixed(2);
        var htmlTags = '<tr class="filaVentas" onclick="VerVenta('+rta[i].ID+');">' +
                        '<td>' + fecha + '</td>'+
                        '<td>' + rta[i].time + '</td>'+
                        '<td> $ ' + total + '</td>'+
                        '<td> $ ' + efectivo + '</td>'+
                        '<td> $ ' + mp + '</td>'+
                        '<td> $ ' + tarjeta + '</td>'+
                        '<td>' + rta[i].saler + '</td>'+
                        '</tr>';
        $('#tabla-listarventas tbody').append(htmlTags);
      }
    }
  })
  const elem = document.getElementById('modalListarVentas');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.open();
}

function CerrarListarVentas(){
  const elem = document.getElementById('modalListarVentas');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.close();
}

function ActualizarVentas(){
  $(".filaVentas").remove();
  fecha = $("#filter_fecha_desde").val();
  fecha2 =  $("#filter_fecha_hasta").val();
  var datos = [];
  datos.push(fecha,fecha2);
  datos = JSON.stringify(datos);
  $.post("./php/ObtenerVentas.php",{valorBusqueda:datos})
  .then((rta)=>{
    rta = JSON.parse(rta);
    if(rta.length>0){
      for (var i = 0;i<rta.length;i++){
        fecha = moment(rta[i].date).format("DD/MM/YYYY");
        total = parseFloat(rta[i].total);
        total = total.toFixed(2);
        efectivo = parseFloat(rta[i].total_cash);
        efectivo = efectivo.toFixed(2);
        mp = parseFloat(rta[i].total_mp);
        mp = mp.toFixed(2);
        tarjeta = parseFloat(rta[i].total_card);
        tarjeta = tarjeta.toFixed(2);
        var htmlTags = '<tr class="filaVentas" onclick="VerVenta('+rta[i].ID+');">' +
                        '<td>' + fecha + '</td>'+
                        '<td>' + rta[i].time + '</td>'+
                        '<td> $ ' + total + '</td>'+
                        '<td> $ ' + efectivo + '</td>'+
                        '<td> $ ' + mp + '</td>'+
                        '<td> $ ' + tarjeta + '</td>'+
                        '<td>' + rta[i].saler + '</td>'+
                        '</tr>';
        $('#tabla-listarventas tbody').append(htmlTags);
      }
    }
  })
}

function VerVenta(id){
  $(".filaVerVenta").remove();
  $.post('./php/ObtenerVenta.php',{valorBusqueda:id})
  .then((array)=>{
    array = JSON.parse(array);
    for(var i = 1;i<array.length;i++){
      total=total+parseFloat(array[i].precio);
      precio = parseFloat(array[i].precio);
      precio = precio.toFixed(2);
      var htmlTags = '<tr class="filaVerVenta">' +
                      '<td>' + array[i].codigo + '</td>'+
                      '<td>' + array[i].nombre + '</td>'+
                      '<td> $' + precio + '</td>'+
                      '</tr>';
      $('#tabla-verventa tbody').append(htmlTags);
    }
  });
  CerrarListarVentas();
  const elem = document.getElementById('modalVerVenta');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.open();
}

function CerrarVerVenta(){
  const elem = document.getElementById('modalVerVenta');
  const instance = M.Modal.init(elem, {dismissible: false});
  instance.close();
  AbrirListarVentas();
}
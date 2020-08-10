function CargarContable(){
    fecha = moment().subtract(3, 'months');
    fecha = moment(fecha).format("YYYY-MM-DD");
    fecha2 = moment().format("YYYY-MM-DD");
    $("#filter_fecha_hasta").val(fecha2);
    $("#filter_fecha_desde").val(fecha);
    var datos = [];
    datos.push(fecha,fecha2);
    datos = JSON.stringify(datos);
    $(".filaContable").remove();
    $.post("./php/Contable.php",{valorBusqueda:datos})
    .then((rta)=>{
        rta = JSON.parse(rta);
        rta.forEach((e)=>{
            ingresos = e.saldo;
            var htmlTags = '<tr class="filaContable">' +
                    '<td scope="row">' + e.cuenta + '</td>' +
                    '<td style="font-weight:bold;"> $ ' + ingresos.toFixed(2) + '</td></tr>';
            $('#tabla-contable tbody').append(htmlTags);
            })
    });
    $.post("./php/Contable2.php",{valorBusqueda:datos})
    .then((rta)=>{
        e = JSON.parse(rta);
        total = parseFloat(e.total);
        costo = parseFloat(e.costo);
        resultado = total-costo;
            var htmlTags = '<tr class="filaContable">' +
                    '<td scope="row"> $ ' + total.toFixed(2) + '</td>' +
                    '<td scope="row"> $ ' + costo.toFixed(2) + '</td>' +
                    '<td style="font-weight:bold;"> $ ' + resultado.toFixed(2) + '</td></tr>';
            $('#tabla-contable2 tbody').append(htmlTags);
    });
}

function ActualizarTabla(){
    var datos = [];
    desde = $("#filter_fecha_desde").val();
    hasta = $("#filter_fecha_hasta").val(); 
    datos.push(desde,hasta);
    datos = JSON.stringify(datos);
    $(".filaContable").remove();
    $.post("./php/Contable.php",{valorBusqueda:datos})
    .then((rta)=>{
        e = JSON.parse(rta);
        e.forEach((e)=>{
            ingresos = e.saldo;
            var htmlTags = '<tr class="filaContable">' +
                    '<td scope="row"> $ ' + e.cuenta + '</td>' +
                    '<td style="font-weight:bold;"> $ ' + ingresos.toFixed(2) + '</td></tr>';
            $('#tabla-contable tbody').append(htmlTags);
        })
    });
    $.post("./php/Contable2.php",{valorBusqueda:datos})
    .then((rta)=>{
        e = JSON.parse(rta);
        total = parseFloat(e.total);
        costo = parseFloat(e.costo);
        resultado = total-costo;
            var htmlTags = '<tr class="filaContable">' +
                    '<td scope="row">' + total.toFixed(2) + '</td>' +
                    '<td scope="row">' + costo.toFixed(2) + '</td>' +
                    '<td style="font-weight:bold;"> $ ' + resultado.toFixed(2) + '</td></tr>';
            $('#tabla-contable2 tbody').append(htmlTags);
    });

}
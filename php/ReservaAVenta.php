<?php

require_once "pdo.php";

$info = $_POST['valorBusqueda'];
$info=json_decode($info,true);

$id_orden = array_pop($info);

//Cambiar el encabezado de reserva a venta
$encabezado = array();

$ObtenerReserva = $conexion->prepare("SELECT * from bookings WHERE ID=:dato");
$ObtenerReserva -> bindParam(':dato',$id_orden);
$ObtenerReserva->execute();


foreach ($ObtenerReserva as $Datos){
    array_push($encabezado,$Datos['date'],$Datos['time'],$Datos['total'],$info[0],$info[1],$info[2],$info[3],$info[4],$Datos['saler']);
    break;
}


$InsertarEncabezado = $conexion->prepare("INSERT INTO sales (date,time,total,total_cash,total_mp,total_card,saler,reseller,reseller_total) VALUES (:date,:time,:total,:total_cash,:total_mp,:total_card,:saler,:reseller,:reseller_total)");
$InsertarEncabezado -> bindParam(':date',$encabezado[0]);
$InsertarEncabezado -> bindParam(':time',$encabezado[1]);
$InsertarEncabezado -> bindParam(':total',$encabezado[2]);
$InsertarEncabezado -> bindParam(':total_cash',$encabezado[3]);
$InsertarEncabezado -> bindParam(':total_mp',$encabezado[4]);
$InsertarEncabezado -> bindParam(':total_card',$encabezado[5]);
$InsertarEncabezado -> bindParam(':reseller',$encabezado[6]);
$InsertarEncabezado -> bindParam(':reseller_total',$encabezado[7]);
$InsertarEncabezado -> bindParam(':saler',$encabezado[8]);
$InsertarEncabezado -> execute();

$ObtenerUltimoEncabezado = $conexion->query("SELECT * from sales ORDER BY ID DESC LIMIT 1");
    foreach($ObtenerUltimoEncabezado as $asf){
        $id_nuevaventa=$asf['ID'];
    }

//Cambiar detalles de reserva a detalles de ventas

$ObtenerDetalles = $conexion->prepare("SELECT * from bookings_detail WHERE (booking_ID=:dato) ");
$ObtenerDetalles -> bindParam(':dato',$id_orden);
$ObtenerDetalles->execute();


foreach ($ObtenerDetalles as $detalle){
    $InsertarDetalle  = $conexion->prepare("INSERT INTO sales_detail (sale_ID,code,name,price_p,price_s) VALUES (:sale_ID,:code,:name,:price_p,:price_s)");
    $InsertarDetalle->bindParam(':sale_ID',$id_nuevaventa);
    $InsertarDetalle->bindParam(':code',$detalle['code']);
    $InsertarDetalle->bindParam(':name',$detalle['name']);
    $InsertarDetalle->bindParam(':price_p',$detalle['price_p']);
    $InsertarDetalle->bindParam(':price_s',$detalle['price_s']);
    $InsertarDetalle->execute();
}

//Eliminar Reserva y detalles

$EliminarReserva = $conexion -> prepare ("DELETE from bookings WHERE ID=:dato");
$EliminarReserva -> bindParam(':dato',$id_orden);
$EliminarReserva -> execute();

$EliminarDetalles = $conexion -> prepare ("DELETE from bookings_detail WHERE booking_ID=:dato");
$EliminarDetalles -> bindParam(':dato',$id_orden);
$EliminarDetalles -> execute();

echo "OK";
?>
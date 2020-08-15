<?php

require_once "pdo.php";

$dato=$_POST['valorBusqueda'];

$EliminarEncabezadoReserva = $conexion -> prepare ("DELETE from bookings WHERE ID=:id");
$EliminarEncabezadoReserva -> bindParam(':id',$dato);
$EliminarEncabezadoReserva -> execute();

$EliminarDetallesReserva = $conexion -> prepare ("SELECT * FROM bookings_detail WHERE booking_ID=:id");
$EliminarDetallesReserva -> bindParam(':id',$dato);
$EliminarDetallesReserva -> execute();

foreach ($EliminarDetallesReserva as $Detalle){
    //Aumentamos el Stock
    $AumentarStock = $conexion->prepare("UPDATE products SET stock=stock+1 WHERE code=:id");
    $AumentarStock -> bindParam(':id',$Detalle['code']);
    $AumentarStock -> execute();
    //Lo borramos
    $EliminarProducto = $conexion -> prepare ("DELETE from bookings_detail WHERE ID=:producto");
    $EliminarProducto -> bindParam(':producto',$Detalle['ID']);
    $EliminarProducto -> execute();
}


?>
<?php

require_once "pdo.php";

$dato=$_POST['valorBusqueda'];

$totalizador = 0;

$ObtenerDetalles = $conexion->prepare("SELECT * from bookings_detail WHERE (booking_ID=:dato) ORDER BY ID ASC");
$ObtenerDetalles -> bindParam(':dato',$dato);
$ObtenerDetalles->execute();

foreach($ObtenerDetalles as $Detail){
    $totalizador=$totalizador+floatval($Detail['price_s']);
}

if($totalizador!=0){ //Quedan productos en la reserva
    $ActualizarTotal = $conexion -> prepare ("UPDATE bookings SET total=:total WHERE ID=:id");
    $ActualizarTotal -> bindParam(':total',$totalizador);
    $ActualizarTotal -> bindParam(':id',$dato);
    $ActualizarTotal -> execute();
    echo "1";
}else{ //No hay mas productos, borro la reserva
    $EliminarReserva = $conexion -> prepare ("DELETE from bookings WHERE ID=:id");
    $EliminarReserva -> bindParam(':id',$dato);
    $EliminarReserva -> execute();
    echo "2";
}



?>
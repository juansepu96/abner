<?php

require_once "pdo.php";

$datos=$_POST['valorBusqueda'];

$ObtenerDetalles = $conexion->prepare("SELECT * from bookings WHERE (ID=:dato)");
$ObtenerDetalles -> bindParam(':dato',$datos);
$ObtenerDetalles->execute();

foreach($ObtenerDetalles as $Detail){
    $total=floatVal($Detail['total']);
}


echo $total;

?>
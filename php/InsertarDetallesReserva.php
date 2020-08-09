<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];
$datos=json_decode($datos,true);

$id_orden = array_pop($datos);


for($i=1;$i<count($datos);$i++){
    $detalle = $datos[$i];
    $InsertarDetalle  = $conexion->prepare("INSERT INTO bookings_detail (booking_ID,code,name,price_p,price_s) VALUES (:booking_ID,:code,:name,:price_p,:price_s)");
    $InsertarDetalle->bindParam(':booking_ID',$id_orden);
    $InsertarDetalle->bindParam(':code',$detalle['codigo']);
    $InsertarDetalle->bindParam(':name',$detalle['nombre']);
    $InsertarDetalle->bindParam(':price_p',$detalle['precio_compra']);
    $InsertarDetalle->bindParam(':price_s',$detalle['precio']);
    $InsertarDetalle->execute();
}

echo "OK";


?>
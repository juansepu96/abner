<?php

require_once "pdo.php";

$datos=$_POST['valorBusqueda'];
$datos = json_decode($datos);

$ObtenerReservas = $conexion->prepare("SELECT * from bookings WHERE (date BETWEEN :date1 and :date2) ORDER BY ID DESC");
$ObtenerReservas -> bindParam(':date1',$datos[0]);
$ObtenerReservas -> bindParam(':date2',$datos[1]);
$ObtenerReservas->execute();

$result = $ObtenerReservas->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
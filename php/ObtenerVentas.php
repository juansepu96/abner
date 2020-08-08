<?php

require_once "pdo.php";

$datos=$_POST['valorBusqueda'];
$datos = json_decode($datos);

$ObtenerVentas = $conexion->prepare("SELECT * from sales WHERE (date BETWEEN :date1 and :date2) ORDER BY ID ASC");
$ObtenerVentas -> bindParam(':date1',$datos[0]);
$ObtenerVentas -> bindParam(':date2',$datos[1]);
$ObtenerVentas->execute();

$result = $ObtenerVentas->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
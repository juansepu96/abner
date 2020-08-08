<?php

require_once "pdo.php";

$datos=$_POST['valorBusqueda'];

$ObtenerDetalles = $conexion->prepare("SELECT * from sales_datail WHERE (sale_ID=:dato) ORDER BY ID ASC");
$ObtenerDetalles -> bindParam(':dato',$datos);
$ObtenerDetalles->execute();

$result = $ObtenerDetalles->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
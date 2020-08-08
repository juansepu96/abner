<?php

require_once "PDO.php";

$dato=$_POST['valorBusqueda'];

$ObtenerProducto = $conexion->prepare("SELECT * from products WHERE ID=:dato");
$ObtenerProducto->bindParam(':dato',$dato);
$ObtenerProducto->execute();

$result = $ObtenerProducto->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
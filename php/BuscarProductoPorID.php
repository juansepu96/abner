<?php

require_once "pdo.php";

$dato=$_POST['valorBusqueda'];

$ObtenerProducto = $conexion->prepare("SELECT * from products WHERE ID=:dato AND stock>0");
$ObtenerProducto->bindParam(':dato',$dato);
$ObtenerProducto->execute();

$result = $ObtenerProducto->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
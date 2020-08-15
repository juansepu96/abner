<?php

require_once "pdo.php";

$dato=$_POST['valorBusqueda'];
$dato=strtolower($dato);
$dato='%'.$dato.'%';

$ObtenerProductos = $conexion->prepare("SELECT * from products WHERE ( (lower(name) LIKE :dato) OR (lower(code) LIKE :dato) )  AND stock>0  ORDER BY name ASC");
$ObtenerProductos->bindParam(':dato',$dato);
$ObtenerProductos->execute();

$result = $ObtenerProductos->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
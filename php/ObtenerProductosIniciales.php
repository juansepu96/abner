<?php

require_once "pdo.php";

$GetProductos = $conexion->prepare("SELECT * from products ORDER BY name ASC");
$GetProductos->execute();

$result = $GetProductos->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
<?php

require_once "pdo.php";

$dato=$_POST['valorBusqueda'];
$dato=strtolower($dato);
$dato='%'.$dato.'%';

$ObtenerUsuarios = $conexion->prepare("SELECT * from users WHERE ( (lower(name) LIKE :dato) OR (lower(username) LIKE :dato) ) ORDER BY name ASC");
$ObtenerUsuarios->bindParam(':dato',$dato);
$ObtenerUsuarios->execute();

$result = $ObtenerUsuarios->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
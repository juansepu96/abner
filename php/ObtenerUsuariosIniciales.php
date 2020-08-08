<?php

require_once "pdo.php";

$ObtenerUsuarios = $conexion->prepare("SELECT * from users ORDER BY name ASC");
$ObtenerUsuarios->execute();

$result = $ObtenerUsuarios->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
<?php

require_once "PDO.php";

$dato=$_POST['valorBusqueda'];

$ObtenerUsuario = $conexion->prepare("SELECT * from users WHERE ID=:dato");
$ObtenerUsuario->bindParam(':dato',$dato);
$ObtenerUsuario->execute();

$result = $ObtenerUsuario->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
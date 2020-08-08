<?php

require_once "PDO.php";

$dato = $_POST['valorBusqueda'];

$ObtenerClientes = $conexion->prepare("SELECT * from products WHERE ID=:dato");
$ObtenerClientes -> bindParam(':dato',$dato);
$ObtenerClientes -> execute();

$result = $ObtenerClientes->fetchAll(\PDO::FETCH_ASSOC);


print_r (json_encode($result));


?>
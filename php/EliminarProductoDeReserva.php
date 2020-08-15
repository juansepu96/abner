<?php

require_once "pdo.php";

$dato=$_POST['valorBusqueda'];

$EliminarProducto = $conexion->prepare("DELETE FROM bookings_detail WHERE ID=:dato");
$EliminarProducto->bindParam(':dato',$dato);
if($EliminarProducto->execute()){
    echo "OK";
}else{
    echo "NO";
}

?>
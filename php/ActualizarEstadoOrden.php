<?php

require_once "PDO.php";

$datos = $_POST['valorBusqueda'];
$datos=json_decode($datos);

$ActualizarEstadoOrden = $conexion->prepare("UPDATE sales SET state=:state WHERE ID=:id");
$ActualizarEstadoOrden -> bindParam(':id',$datos[0]);
$ActualizarEstadoOrden -> bindParam(':state',$datos[1]);
if($ActualizarEstadoOrden -> execute()){
    echo "OK";
}else{
    echo "NO";
}


?>
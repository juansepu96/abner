<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];
$datos=json_decode($datos);

$ActualizarProducto = $conexion->prepare("UPDATE products SET code=:code,name=:name,price_p=:price_p,price_s=:price_s,stock=:stock WHERE ID=:id");
$ActualizarProducto -> bindParam(':id',$datos[0]);
$ActualizarProducto -> bindParam(':code',$datos[1]);
$ActualizarProducto -> bindParam(':name',$datos[2]);
$ActualizarProducto -> bindParam(':price_p',$datos[3]);
$ActualizarProducto -> bindParam(':price_s',$datos[4]);
$ActualizarProducto -> bindParam(':stock',$datos[5]);
if($ActualizarProducto -> execute()){
    echo "OK";
}else{
    echo "NO";
}


?>
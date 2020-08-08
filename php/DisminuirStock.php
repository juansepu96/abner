<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];

$DisminuirStock = $conexion->prepare("UPDATE products SET stock=stock-1 WHERE ID=:id");
$DisminuirStock -> bindParam(':id',$datos);
if($DisminuirStock -> execute()){
    echo "OK";
}else{
    echo "NO";
}


?>
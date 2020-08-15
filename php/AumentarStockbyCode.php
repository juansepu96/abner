<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];

$AumentarStock = $conexion->prepare("UPDATE products SET stock=stock+1 WHERE code=:id");
$AumentarStock -> bindParam(':id',$datos);
if($AumentarStock -> execute()){
    echo "OK";
}else{
    echo "NO";
}


?>
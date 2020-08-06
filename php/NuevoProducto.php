<?php

require_once "PDO.php";

$datos = $_POST['valorBusqueda'];
$datos=json_decode($datos);


$NewProduct = $conexion->prepare("INSERT INTO products (code,name,price_p,price_s,stock) VALUES (:code,:name,:price_p,:price_s,:stock)");
$NewProduct -> bindParam(':code',$datos[0]);
$NewProduct -> bindParam(':name',$datos[1]);
$NewProduct -> bindParam(':price_p',$datos[2]);
$NewProduct -> bindParam(':price_s',$datos[3]);
$NewProduct -> bindParam(':stock',$datos[4]);
if($NewProduct -> execute()){
    echo "OK";
}else{
    echo "NO";
}


?>
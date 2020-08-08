<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];
$datos=json_decode($datos);


$NuevoUsuario = $conexion->prepare("INSERT INTO users (name,username,password,profile,status) VALUES (:name,:username,:password,:profile,:status)");
$NuevoUsuario -> bindParam(':name',$datos[0]);
$NuevoUsuario -> bindParam(':username',$datos[1]);
$NuevoUsuario -> bindParam(':password',$datos[2]);
$NuevoUsuario -> bindParam(':profile',$datos[3]);
$NuevoUsuario -> bindParam(':status',$datos[4]);
if($NuevoUsuario -> execute()){
    echo "OK";
}else{
    echo "NO";
}


?>
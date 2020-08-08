<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];
$datos=json_decode($datos);

$ActualizarUsuario = $conexion->prepare("UPDATE users SET name=:name,username=:username,password=:password,profile=:profile,status=:status WHERE ID=:id");
$ActualizarUsuario -> bindParam(':id',$datos[0]);
$ActualizarUsuario -> bindParam(':name',$datos[1]);
$ActualizarUsuario -> bindParam(':username',$datos[2]);
$ActualizarUsuario -> bindParam(':password',$datos[3]);
$ActualizarUsuario -> bindParam(':profile',$datos[4]);
$ActualizarUsuario -> bindParam(':status',$datos[5]);
if($ActualizarUsuario -> execute()){
    echo "OK";
}else{
    echo "NO";
}


?>
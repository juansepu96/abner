<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];

$datos = explode("@#",$datos);

$IniciarSesion = $conexion->prepare("SELECT * from users WHERE username=:user AND password=:password AND status='ACTIVO'");
$IniciarSesion -> bindParam(':user',$datos[0]);
$IniciarSesion -> bindParam(':password',$datos[1]);
$IniciarSesion -> execute();
$hay=$IniciarSesion->RowCount();

if($hay>0){
    foreach ($IniciarSesion as $Account){
        $_SESSION['name']=$Account['name'];        
        $profile=$Account['profile'];
        $_SESSION['rol']=$profile;
    }
    echo $profile;
}else{
    echo "NO";
}


?>
<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];


$date=date("Y-m-d");
$time=date("H:i:s");
$saler=$_SESSION['name'];

$rta=null;

$InsertarEncabezado = $conexion->prepare("INSERT INTO bookings (date,time,total,saler) VALUES (:date,:time,:total,:saler)");
$InsertarEncabezado -> bindParam(':date',$date);
$InsertarEncabezado -> bindParam(':time',$time);
$InsertarEncabezado -> bindParam(':total',$datos);
$InsertarEncabezado -> bindParam(':saler',$saler);
if($InsertarEncabezado -> execute()){
    $ObtenerUltimoEncabezado = $conexion->query("SELECT * from bookings ORDER BY ID DESC LIMIT 1");
    foreach($ObtenerUltimoEncabezado as $Encabezado){
        $rta=$Encabezado['ID'];
    }
};

echo $rta;


?>
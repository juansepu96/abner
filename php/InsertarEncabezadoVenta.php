<?php

require_once "pdo.php";

$datos = $_POST['valorBusqueda'];
$datos=json_decode($datos);

$date=date("Y-m-d");
$time=date("H:i:s");
$saler=$_SESSION['name'];

$rta=null;

$InsertarEncabezado = $conexion->prepare("INSERT INTO sales (date,time,total,total_cash,total_mp,total_card,saler) VALUES (:date,:time,:total,:total_cash,:total_mp,:total_card,:saler)");
$InsertarEncabezado -> bindParam(':date',$date);
$InsertarEncabezado -> bindParam(':time',$time);
$InsertarEncabezado -> bindParam(':total',$datos[0]);
$InsertarEncabezado -> bindParam(':total_cash',$datos[1]);
$InsertarEncabezado -> bindParam(':total_mp',$datos[2]);
$InsertarEncabezado -> bindParam(':total_card',$datos[3]);
$InsertarEncabezado -> bindParam(':saler',$saler);
if($InsertarEncabezado -> execute()){
    $ObtenerUltimoEncabezado = $conexion->query("SELECT * from sales ORDER BY ID DESC LIMIT 1");
    foreach($ObtenerUltimoEncabezado as $Encabezado){
        $rta=$Encabezado['ID'];
    }
};

echo $rta;


?>
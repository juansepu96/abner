<?php

date_default_timezone_set('America/Argentina/Buenos_Aires');
require_once "pdo.php";

$datos=$_POST['valorBusqueda'];
$datos=json_decode($datos);

$desde=$datos[0];
$hasta=$datos[1];


$total=0;
$costo=0;
$comisiones = 0;

$ObtenerVentas=$conexion->prepare("SELECT * FROM sales WHERE date BETWEEN :fecha1 AND :fecha2");
$ObtenerVentas -> bindParam (':fecha1',$desde);
$ObtenerVentas -> bindParam (':fecha2',$hasta);
$ObtenerVentas -> execute();


foreach ($ObtenerVentas as $Venta){
    $ObtenerDetalles=$conexion->prepare("SELECT SUM(price_p) as costo FROM sales_detail WHERE sale_ID = :dato");
    $ObtenerDetalles->bindParam(':dato',$Venta['ID']);
    $ObtenerDetalles->execute();
    foreach ($ObtenerDetalles as $Detail){
        $costo=$costo+floatval($Detail['costo']);
    }
    $total=$total+floatval($Venta['total']);
    $comisiones = $comisiones + floatval($Venta['reseller']);
}

$resultado = (object) [
    "total" => $total,
    'costo' => $costo,
    'comisiones' => $comisiones,
];


print_r (json_encode($resultado));


?>
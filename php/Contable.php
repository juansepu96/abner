<?php

date_default_timezone_set('America/Argentina/Buenos_Aires');
require_once "pdo.php";

$datos=$_POST['valorBusqueda'];
$datos=json_decode($datos);

$desde=$datos[0];
$hasta=$datos[1];

$resultados=array();

$total=0;
$efe=0;
$mp=0;
$tar=0;

$ObtenerVentas=$conexion->prepare("SELECT * FROM sales WHERE date BETWEEN :fecha1 AND :fecha2");
$ObtenerVentas -> bindParam (':fecha1',$desde);
$ObtenerVentas -> bindParam (':fecha2',$hasta);
$ObtenerVentas -> execute();


foreach ($ObtenerVentas as $Venta){
    $total=$total+floatval($Venta['total']);
    $efe=$efe+floatval($Venta['total_cash']);
    $mp=$mp+floatval($Venta['total_mp']);
    $tar=$tar+floatval($Venta['total_card']);
}

$efectivo = (object) [
    "cuenta" => "EFECTIVO",
    'saldo' => $efe,
];

$mp = (object) [
    'cuenta' => "MERCADO PAGO",
    'saldo' => $mp
];

$tarjeta = (object) [
    'cuenta' => "TARJETA",
    'saldo' => $tar,
];

array_push($resultados,$efectivo,$mp,$tarjeta);

print_r (json_encode($resultados));


?>
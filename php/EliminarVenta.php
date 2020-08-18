<?php

require_once "pdo.php";

$dato=$_POST['valorBusqueda'];

$EliminarEncabezadoVenta = $conexion -> prepare ("DELETE from sales WHERE ID=:id");
$EliminarEncabezadoVenta -> bindParam(':id',$dato);
$EliminarEncabezadoVenta -> execute();

$EliminarDetallesProductos = $conexion -> prepare ("SELECT * FROM sales_detail WHERE sale_ID=:id");
$EliminarDetallesProductos -> bindParam(':id',$dato);
$EliminarDetallesProductos -> execute();

foreach ($EliminarDetallesProductos as $Detalle){
    //Aumentamos el Stock
    $AumentarStock = $conexion->prepare("UPDATE products SET stock=stock+1 WHERE code=:id");
    $AumentarStock -> bindParam(':id',$Detalle['code']);
    $AumentarStock -> execute();
    //Lo borramos
    $EliminarProducto = $conexion -> prepare ("DELETE from sales_detail WHERE ID=:producto");
    $EliminarProducto -> bindParam(':producto',$Detalle['ID']);
    $EliminarProducto -> execute();
}


?>
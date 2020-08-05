<?php

session_start();

date_default_timezone_set('America/Argentina/Buenos_Aires');


try {
	$conexion = new PDO('mysql:host=localhost;dbname=abner','root','');


}catch(PDOException $e){
		echo "Error" . $e->getMessage();

}

?>
$(document).ready(function() {
    $.post("./php/ObtenerRol.php")
    .then(function(rol) {
        if(rol==="admin"){
            $("#contenedor").load('./menuAdmin.html');
        }
        if(rol==="vendedor"){
            $("#contenedor").load('./menuVendedor.html');
        }
        if(rol==="revendedor"){
            $("#contenedor").load('./menuRevendedor.html');
        }
        
    });    
});
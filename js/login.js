function Acceder(){
    user = $("#user").val();
    pass = $("#password").val();
    datos = user+"@#"+pass;
    $.post("./php/Acceder.php",{valorBusqueda:datos})
    .then(function(rta) {
        if(rta != "NO"){ 
            if(rta==="admin"){
                window.location.replace("ventas.html");
            }
            if(rta==="vendedor"){
                window.location.replace("ventas.html");
            }
            if(rta==="revendedor"){
                window.location.replace("stock2.html");
            }
        }else{
            cuteToast({
                type: "error", // or 'info', 'error', 'warning' 
                message: "ERROR AL INICIAR SESION",
                timer: 3000
              })
        }
    });
}
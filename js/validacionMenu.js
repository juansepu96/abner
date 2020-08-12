$(document).ready(function() {
    $.post("./php/ObtenerRol.php")
    .then(function(rol) {
        if(rol==="admin"){
            $("#menu_admin").show();
        }
        if(rol==="vendedor"){
            $("#menu_vendedor").show();
        }
        if(rol==="revendedor"){
            $("#menu_revendedor").show();
        }
        
    });  
    
    $('.sidenav').sidenav();

});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });

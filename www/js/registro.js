function esEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

var cadMunicipios='<option value="0">Elija un municipio</option>';

function cargaMunicipios() {
    
    if($("#idEstado").val().trim() > 0) {
        $.ajax({
            url:"http://chai.lealtadprimero.com.mx/servicio/index.php",
            type: 'POST',
            data: {
                funcion:'municipios',
                idEstado:$("#idEstado").val().trim()
            },
            success:function(resp) { 
                resp          = JSON.parse(resp);
                cadMunicipios = '<option value="0">Elija un municipio</option>';
                
                jQuery.each(resp, function(i, val) {
                  cadMunicipios+='<option value="'+val.id+'">'+val.nombre+'</option>';
                });
                
                $("#idMunicipio").html(cadMunicipios);
            }
        });
    }
    else {
        $("#idMunicipio").html(cadMunicipios);
    }
}

var cadEstados='<option value="0">Elija un estado</option>';

$(document).ready(function(){
    $.ajax({
        url:"http://chai.lealtadprimero.com.mx/servicio/index.php",
        type: 'POST',
        data: {
            funcion:'estados'
        },
        success:function(resp) { 
            resp=JSON.parse(resp);
            
            jQuery.each(resp, function(i, val) {
              cadEstados+='<option value="'+val.id+'">'+val.nombre+'</option>';
            });
            
            $("#idEstado").html(cadEstados);
        }
    });
});
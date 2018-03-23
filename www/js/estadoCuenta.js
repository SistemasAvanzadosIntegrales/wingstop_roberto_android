$(document).ready(function() {
    
    var registro = JSON.parse(localStorage.getItem('pughpharm'));
        
    $("#lblPuntos2").html(registro.puntos+" pts.");
    
    $.ajax({
        url:ruta_generica,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion       : 'estadoCuenta',
            numeroTarjeta : localStorage['tarjeta'],
            idCliente     : cliente
        },
        success:function(resp) {
            jQuery.each(resp, function(i, val) {
                
                if( val.tipo == 'SumarPuntos' )
                    $("#tablaEstadoCuenta").append('<tr><th>'+val.fecha+'</th><th>$'+val.monto+'</th><th>'+val.saldoAnterior+' pts</th><th>'+val.saldoActual+' pts</th><th>'+val.obtenidos+' pts</th>');
                else
                    $("#tablaEstadoCuenta").append('<tr><th>'+val.fecha+'</th><th style="color:#f00;">- $'+val.monto+'</th><th>'+val.saldoAnterior+' pts</th><th>'+val.saldoActual+' pts</th><th>0 pts</th>');
                
                var punts    = JSON.parse(localStorage.getItem('pughpharm'));
                punts.puntos = parseInt(val.saldoActual);
                
                localStorage.setItem('pughpharm', JSON.stringify(punts));
                $("#lblPuntos2").html("<div class='normal'>"+val.saldoActual+"</div><div class='minus'>pts.</div>");
            });
            
            puntos_consumidos();
        }
    }); 
});

/**
 * puntos_consumidos
 **/
function puntos_consumidos() {

    $.ajax({
        url:ruta_generica,
        type: 'POST',
        data: {
            funcion       : 'puntosUsados',
            numeroTarjeta : localStorage['tarjeta'],
            idCliente     : cliente
        },
        success: function(resp) { 
            var aux = JSON.parse(resp);
            $('#p_cons').html((aux.puntos+"") == "null" ? "0" : aux.puntos+" pts.");
        },
        error: function (resp) {
            alert("error en puntos usado"+JSON.stringify(resp));
        }
    }); 
}
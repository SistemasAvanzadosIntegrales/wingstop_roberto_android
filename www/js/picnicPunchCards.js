$(document).ready(function(){
    $.ajax({
        method: 'POST',
        url: ruta_generica,
        data: {
            funcion:'transaccionesPendientesAPicnic',
            idCliente: cliente,
            numeroTarjeta: localStorage['tarjeta'],
            playerId: localStorage.getItem('player_id')
        },
        processData: true,
        dataType: "json",
        success: function(data) {
            obtenerPerforacionesLealtad();
        },
        error: function (data){
            //alert("error picnipendientes "+JSON.stringify(data));
        }
    });
});

function obtenerPerforacionesLealtad() {
    
    $.ajax({
        method: 'POST',
        url: ruta_generica,
        data: {
            funcion:'damePerforaciones',
            idCliente:cliente,
            numeroTarjeta:localStorage['tarjeta']
        },
        processData: true,
        dataType: "json",
        success: function(data) {
            for(var i=1;i<=parseInt(data.mensaje);i++) {
                $("#slot"+i).attr('src', 'https://a5f8e58372715ad8da92-946fca8d31c7ab353cb4968b59b10204.ssl.cf1.rackcdn.com/2262536f08131599f960793987440ae4-20170228T180318Z.png');
            }
        },error: function (data){
            alert("error "+JSON.stringify(data));
        }
    });
}
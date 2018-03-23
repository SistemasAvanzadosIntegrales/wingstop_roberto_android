var contador = 1;
 
$(document).ready(function(){
	$('#menus').click(function(e){
        e.stopPropagation();
        
		if (contador == 1) {
			$('nav').animate({
				left: '0'
			});
			
            contador = 0;
            
            $(".modal-background").removeClass('hidden');
		} 
        else {
			contador = 1;
			$('nav').animate({
				left: '-100%'
			});
            
             $(".modal-background").addClass('hidden');
		}
	});
});
 
function afuera() {
	contador = 1;
    $('nav').animate({
        left: '-100%'
    });

    $(".modal-background").addClass('hidden');
}

generar_menu("menu");

/**
 * generar_menu
 **/
function generar_menu(id) {
    $("#" + id).append(
        '<nav class="text-center" style="left: -100%">' + 
            '<div class="col-12 no-padding float-left" style="background: #0d6c3f;">' +
                '<div class="col-12 float-left salir" onclick="javascript:salir();">'+
                'Salir &nbsp;<i class="fa fa-window-close-o"></i>'+
                '</div>' +
                '<div class="col-4 float-left mt-2 text-left mb-2 no-pr" onclick="openFilePicker()"><img id="usr" src="img/user.png"></div>' +
                '<div class="col-8 no-pr float-left text-left"><label id="lblNombreMenu"></label>' +
                '<label id="lblPuntos"></label></div>' +
            '</div>' +

            '<div class="col-12 float-left mt-2 menu-items"><a href="tarjetaQR.html"><div class="col-2 no-padding float-left"><img src="img/wingstopid.png" /></div><div class="col-10 text-left float-left link">Mi Wingstop ID</div></a></div>' +
        
            '<div class="col-12 float-left mt-2 menu-items"><a href="sucursales.html"><div class="col-2 no-padding float-left"><img src="img/sucursales.png" /></div><div class="col-10 text-left float-left link">Sucursales</div></a></div>' +
        
            '<div class="col-12 float-left mt-2 menu-items"><div class="col-2 no-padding float-left"><img src="img/experiencias.png" /></div><div class="col-10 text-left float-left link"><a href="misPunchcards.html">Experiencias Wingstop</a></div></div>' +
        
            '<div class="col-12 float-left mt-2 menu-items"><a href="todasLasPromociones.html"><div class="col-2 no-padding float-left"><img src="img/promos.png" /></div><div class="col-10 text-left float-left link">Promos y Cupones</div></a></div>' +
        
            '<div class="col-12 float-left mt-2 menu-items"><a href="ordena.html"><div class="col-2 no-padding float-left"><img src="img/ordena.png" /></div><div class="col-10 text-left float-left link">Ordena aquí</div></a></div>' +
        
            '<div class="col-12 float-left mt-2 menu-items"><a href="misDatos.html"><div class="col-2 no-padding float-left"><img src="img/datos.png" /></div><div class="col-10 text-left float-left link">Datos personales</div></a></div>' +
        
            '<div class="col-12 float-left mt-2 menu-items"><a href="estadoCuenta.html"><div class="col-2 no-padding float-left"><img src="img/estado.png" /></div><div class="col-10 text-left float-left link">Estado de cuenta</div></a></div>' +

            '<div class="float-left col-12"><hr/></div>' +
            
            '<div class="float-left col-12"><h2 class="text-center amigos">¡Invita a tus amigos!</h2></div>' +
        
             '<div class="col-4 offset-4 float-left text-center facebook"><a href="http://www.facebook.com/WingStopMex/"><img src="img/facebook.png" /></a></div>'+
            
            '<div class="col-12 float-left text-right acerca mt-3"><a href="acercaDe.html">  Acerca de esta app</a></div>'+
		'</nav>'
    );
}

var ruta_generica = "http://admin.lealtadprimero.com.mx/servicio/index.php";
var cliente       = '2';

/**
 * Document Ready
 **/
$( document ).ready(function() {
    
    if(localStorage.getItem('pughpharm') !== null) {
        refrescar();
    }
    
    ver_cliente();
});

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : refrescar
 **/
function refrescar() {

    var registro = JSON.parse(localStorage.getItem('pughpharm'));
    
    try {
        $("#lblNombreMenu").html(registro.nombre);
        $("#lblPuntos").html("Tienes "+registro.puntos+" puntos.");
    }
    catch(er) {
        console.log(er);
    }   
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : ver_cliente
 **/
function ver_cliente() {
    
    var configApp = JSON.parse(localStorage.getItem('configuracionApp'));
    
    if( configApp == null ) {
        
        $.ajax({
            method: 'POST',
            url: ruta_generica,
            data: {
                funcion:'configuracion',
                idCliente: cliente  
            },
            processData: true,
            dataType: 'JSON',
            success: function(data) {
                localStorage.setItem("configuracionApp", JSON.stringify(data));
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown); 
            }
        });
    }
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : ingresar
 **/
function ingresar() {
    
    if( $("#numero_tarjeta" ).val().trim() == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir tu usuario').show();
    }
    else if( $("#contrasena").val().trim() == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir tu contraseña').show();
    }
    else {
        $("#alertaLogin").html("").hide();
        
        $.ajax({
            url: ruta_generica,
            type: 'POST',
            dataType: 'JSON',
            data: {
                funcion       : 'ingreso',
                idCliente     : cliente,
                numeroTarjeta : $("#numero_tarjeta").val().trim(),
                password      : $("#contrasena").val().trim(),
            },
            success:function(resp) {
                
                if( resp.error == '' ) {
                    localStorage.setItem('seLogueo', '1');
                    localStorage.setItem('tarjeta', resp.numeroTarjeta);
                    pughpharm.login(resp.nombre, resp.email, resp.puntos, resp.puntosPorPeso, resp.codigo);
                }
                else {
                    $("#alertaLogin").html(resp.error).show();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown); 
            }
        });
    }
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : recuperarContrasena
 **/
function recuperarContrasena() {
    
    if( $("#email").val().trim() == '' ) {
        $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes escribir tu email').show();
    }
    else {
        $("#alertaLogin").html("").hide();
            
        $.ajax({
            url: ruta_generica,
            type: 'POST',
            dataType: 'JSON',
            data: {
                funcion   : 'recuperarContrasena',
                idCliente : cliente,
                email     : $("#email").val().trim()},
            success:function(resp) { 
                
                if( resp.error == '' ) {
                    
                    $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Su contraseña ha sido ha enviada por correo electrónico.').show();
                    
                    location.href = "usuarioLealtad.html";
                }
                else {
                    $("#alertaLogin").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Error: '+resp.error).show();
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown); 
            }
        });
    }
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : extraerPromociones
 **/
function extraerPromociones(ut_pc) {
    
    if( localStorage.getItem('pughpharm') !== null ) {
        var registro = JSON.parse(localStorage.getItem('pughpharm'));
        
        $("#lblNombre").html(registro.nombre);
        $("#lblPuntos").html(registro.puntos+" Puntos");
    }
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion         : 'cuponesQrSimple',
            idCliente       : cliente,
            numeroTarjeta   : localStorage['tarjeta'],
            utilizadoPicnic : ut_pc},
        success:function(resp) {
            
            try {
                if( resp[0].error == '' ) {
                    $('#no_cat').html('');
                    for( var x = 0; x < resp.length; x++ ) {
                        var promocion = resp[x];
                        var cad = '<a><div class="imgCatego2"><img onclick="modal(\'CL|'+promocion.codigoQR+'\')" src="'+promocion.imagen+'"><div  class="sombra"><img src="img/imgSombraHorizontal.png"/></div></div></a>';
                        $("#contenedorPromociones").append(cad);
                    }
                }
            }
            catch(Err) {
                console.log(Err);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : obtenerDatosPersonales
 *  @desc     : función para obtener los datos personales del usuarios
 **/
function obtenerDatosPersonales() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion       : 'perfil',
            idCliente     : cliente,
            numeroTarjeta : localStorage['tarjeta']
        },
        success:function(resp) {
            
            if ( resp.nacimiento != '0000-00-00' ) {
                $('#txtCumple').prop('disabled', 'disabled');
            }
            
            if( resp.error == '' ) {
                $("#txtTarjeta").html(localStorage['tarjeta']);    
                $("#txtNombre").html(resp.nombre);
                $("#txtSexo").val(resp.sexo);
                $("#txtCumple").val(resp.nacimiento);
                $("#txtCorreo").val(resp.email); 
                $("#txtTelefono").val(resp.telefonoTrabajo); 
                $("#txtEstado").val(resp.idEstado); 
                $("#txtColonia").val(resp.colonia); 
                $("#txtMunicipio").val(resp.idMunicipio);
                $("#txtCp").val(resp.cp);
                $("#txtpass").val(resp.password);  
                $("#txtTelefono2").val(resp.telefonoHogar);
                
                $.ajax({
                    url: ruta_generica,
                    type: 'POST',
                    dataType: 'JSON',
                    data: {
                        funcion   : 'municipios',
                        idCliente : cliente,
                        idEstado  : resp.idEstado
                    },
                    success:function(re) {
                        
                        var d = document.getElementById('txtMunicipio');
                        
                        while( d.hasChildNodes() )
                            d.removeChild(d.firstChild);
                        
                        for( var i = 0; i < re.length; i++ ) {
                            if( re[i].id == resp.idMunicipio ){
                                $('#txtMunicipio').append('<option value="'+re[i].id+'">'+re[i].nombre+'</option>')
                            }
                        }
                    },
                    error: function(re){
                        console.log(re);
                    }
                });
            }
            else {
                console.log("error:" + resp.error);
            }    
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : salir
 *  @desc     : función para hacer logout de la plataforma
 **/
function salir() {
    localStorage.removeItem("cliente");
    pughpharm.deleteToken();
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : pre_registro
 *  @desc     : función para hacer un preregistro
 **/
function pre_registro() {
    
    if( !$("#politicas")[0].checked ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Antes tienes que estar de acuerdo con las políticas de privacidad.').show();
        
        return null;
    }
    
    if( $('#nombre').val() == "" || $('#email').val() == "" || $('#sexo').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Verifique que todos los campos estén llenos').show();
        
        return null;
    }
    
    var dia   = $('#fecha_dia').val();
    var mes   = $('#fecha_mes').val();
    var anio  = $('#fecha_ano').val();
    var fecha = dia+'/'+mes+'/'+anio;
    
    if ( !isDate(fecha) ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Fecha no valida').show();
        
        return null;
    }
    else {
        $.ajax({
            method: 'POST',
            url: ruta_generica,
            dataType: 'JSON',
            data: {
                funcion         : 'preregistroSinQr',
                idCliente       : cliente,
                nombre          : $('#nombre').val(),
                email           : $('#email').val(),
                sexo            : $('#sexo').val(),
                fechaNacimiento : fecha
            },
            success: function(data) {
                if( data.error != '' ) {
                    $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;'+data.error+'.').show();
                }
                else {
                    document.getElementById('light1').style.display = 'block';
                    document.getElementById('fade').style.display   = 'block';
                }
            },
            error: function (data) {
                $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Error en el pre-registro '+JSON.stringify(data)).show();
            }
        });
    }
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : guardar_datos
 **/
function guardar_datos() {
   
    if( !$('#politicas').is(':checked') ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes aceptar las politicas de privacidad para continuar').show();
    }
    else if( $('#txtSexo').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes seleccionar el sexo').show();
    }/*
    else if( $('#txtCumple').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes completar la fecha de nacimiento').show();
    }*/
    else if( $('#txtCorreo').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes completar el correo').show();
    }
    else if( $('#txtTelefono').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes completar el celular').show();
    }
    else if( $('#txtpass').val() == "" ) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes completar la contraseña').show();
    }
    else if( $('#txtpass2').val() != "" && $('#txtpass').val() != $('#txtpass2').val()) {
        $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;La contraseña no coincide').show();
    }
    else {
        $.ajax({
            url: ruta_generica,
            type: 'POST',
            dataType: 'JSON',
            data: {
                funcion         : 'actualiza',
                idCliente       : cliente,
                password        : $('#txtpass').val(),
                numeroTarjeta   : $('#txtTarjeta').text().trim(),
                nombre          : $('#txtNombre').text().trim(),
                sexo            : $('#txtSexo').val(),
                email           : $('#txtCorreo').val(),
                colonia         : $('#txtColonia').val(),
                idEstado        : $('#txtEstado').val(),
                idMunicipio     : $('#txtMunicipio').val(),
                cp              : $('#txtCp').val(),
                nacimiento      : $('#txtCumple').val(),
                telefonoTrabajo : $('#txtTelefono').val(),
                telefonoHogar   : $('#txtTelefono2').val(),
            },
            success: function(re) {
                
                localStorage['verifica'] = 2;
                
                $.ajax({
                    url: ruta_generica,
                    type: 'POST',
                    data: {
                        funcion       :'ingreso',
                        idCliente     : cliente,
                        numeroTarjeta : $('#txtTarjeta').text().trim(), 
                        password      : $('#txtpass').val().trim()
                    },
                    success:function(resp) {
                        
                        resp = JSON.parse(resp);
                        
                        if ( resp.error == '' ) {
                            pughpharm.login(resp.nombre, resp.email, resp.puntos);
                            window.location = "todasLasPromociones.html"
                        }
                        else {
                            $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Error: '+resp.error).show();
                        }
                    }
                });     
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) { 
                console.log("Status: " + textStatus); 
                console.log("Error: " + errorThrown); 
            }
        });
    }     
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : estados
 **/
function estados() {
    
    $.ajax({
        url:ruta_generica,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion   : 'estados',
            idCliente : cliente
        },
        success:function(re) {
            for(var i = 0; i < re.length; i++ ){
                $('#txtEstado').append('<option value="'+re[i].id+'">'+re[i].nombre+'</option>')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : municipios
 **/
function municipios() {
    
    var est = $('#txtEstado').val();
    
    $.ajax({
        url:ruta_generica,
        type: 'POST',
        dataType: 'JSON',
        data: {
            funcion:  'municipios',
            idCliente:cliente,
            idEstado: est
        },
        success:function(re){
              
            var d = document.getElementById('txtMunicipio');
               
            while( d.hasChildNodes() )
                d.removeChild(d.firstChild);
           
            for( var i = 0; i < re.length; i++ ) {
                $('#txtMunicipio').append('<option value="'+re[i].id+'">'+re[i].nombre+'</option>')
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : municipios
 **/
function soloNumeros(e) {
	var key = window.Event ? e.which : e.keyCode
	return (key >= 48 && key <= 57)
}

/**
 *  @author   : Avansys
 *  @date     : 08/11/2017
 *  @function : isDate
 **/
function isDate(txtDate) {
    
    var currVal = txtDate;
    
    if( currVal == '' )
        return false;
    
    var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/; //Declare Regex
    var dtArray       = currVal.match(rxDatePattern); // is format OK?
    
    if (dtArray == null)
        return false;
    
    var dtDay   = dtArray[1];
	var dtMonth = dtArray[3];
    var dtYear  = dtArray[5]; 
    
    if (dtMonth < 1 || dtMonth > 12)
        return false;
    else if (dtDay < 1 || dtDay> 31) 
        return false;
    else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) 
        return false;
    else if (dtMonth == 2) {    
        var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
        
        if (dtDay> 29 || (dtDay ==29 && !isleap)) 
            return false;
    }
    
    return true;
}

/**
 * Wingstop Komanda módulo de ordena
 * @Author:      Roberto Ramirez
 * @Contact:     roberto_ramirez@avansys.com.mx
 * @Copyright:   Avansys
 * @Description: API utilizada para la gestión del módulo "Ordena" para Wingstop México.
 **/

var imageDefault  = "<img src='/img/square.png' />";
var imageDefault2 = "<img class='img-responsive' src='/img/square.png' />";

if( localStorage.getItem("shopping") || localStorage.getItem("promotions") ) {
    $("#shopping-cart").show();
    
    var number_shopping   = localStorage.getItem("shopping") != null ? JSON.parse(localStorage.getItem("shopping")).length : '';
    var number_promotions = localStorage.getItem("promotionsAll") != null ? JSON.parse(localStorage.getItem("promotionsAll")).length: '';
    $( "#number-cart" ).html(number_shopping + number_promotions);
}
else {
    $("#shopping-cart").hide();
    $( "#number-cart" ).html('');
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 02/10/2017
 * @function: getCategorys
 * @version:  1
 **/
function getCategorys() {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getCategorys'
        },
        success:function(data){
            $.each(data, function(i, item) {
                $( "#menu-categorias ul" ).append( "<li class='col-12' onclick='goPlates("+item.Grupo+");' style='cursor: pointer;'><figure>"+(item.Imagen ? item.Imagen : imageDefault)+"</figure><div class='categorias-descripcion'><article><p class='descripcion'>"+item.Nombre+"</p></article></div><div class='btn-siguiente text-right'><a href='#' onclick='goPlates("+item.Grupo+");'><i class='fa fa-chevron-right'></i></a></div></li>" );
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 02/10/2017
 * @function: getPlates
 * @version:  1
 **/
function getPlates(category) {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion  : 'getPlates',
            category : category,
        },
        success:function(data){
            $.each(data, function(i, item) {
                $( "#menu-categorias ul" ).append( "<li class='col-12' onclick=\"goPlate('"+item.Consecutivo+"');\" style='cursor: pointer;'><figure>"+(item.Imagen ? item.Imagen : imageDefault)+"</figure><div class='categorias-descripcion'><article><p class='descripcion'>"+item.Nombre+"</p></article></div><div class='btn-siguiente text-right'><a href='#' onclick=\"goPlate('"+item.Consecutivo+"');\"><i class='fa fa-chevron-right'></i></a></div></li>" );
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 03/10/2017
 * @function: getAddons
 * @version:  1
 **/
function getAddons(plate) {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getAddons',
            plate     : plate,
            idCliente : cliente
        },
        success:function(data){
            
            if ( data.length ) {
                
                //Hide h3 for count pieces
                $( "#plate-addons-count").addClass('hide');
                
                //Imagen
                $("#plate-img").append(data[0].Imagen ? data[0].Imagen : imageDefault2);

                //Title
                $("#plate-title").append(data[0].Nombre+'<br/>$'+data[0].Precio+'.00 Pesos M.N.');
                
                //Addons
                $.each(data, function(i, item) {
                    $("#plate-addons").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-check-input" type="checkbox" name="addon'+i+'" value="'+item.consecutivoComplemento+'" id="addon'+i+'">'+item.nombreComplemento+'</label></section>');
                });
                
                //Add max complements value
                $( "#addons-message-max" ).html(data[0].maximoProducto);

                $("#plate-addons input[type='checkbox']").change(function() {
                    var sort      = $("#plate-addons input:checked").length;
                    var inputHow  = $(this).attr('id');
                    var nameLabel = $(this).parent('label').text();

                    if ( sort == data[0].maximoProducto ) {
                        $("#plate-addons input:checkbox:not(:checked)").prop( "disabled", true );
                    }
                    else {
                        $("#plate-addons input:checkbox").prop( "disabled", false );
                    }
                    
                    //Add value select complements
                    var numberOfChecked = $('input:checkbox:checked').length;
                    $( "#addons-message-how").html(numberOfChecked);
                    
                    if (numberOfChecked > 0 && data[0].Cantidad > 0) {
                        $( "#plate-addons-count").removeClass('hide');
                    }
                    else {
                        $( "#plate-addons-count").addClass('hide');
                    }

                    //Flujo para complementos de más de una cantidad.
                    if ( data[0].Cantidad > 0 ) {
                        $( "#plate-addons-count").show();
                        $( "#addons-message-count").html(data[0].Cantidad);
                        
                        if ( $(this).is( ":checked" ) ) {
                            $("#plate-addons-count").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-control-text" type="number" name="count-'+inputHow+'" value="" id="count-'+inputHow+'">'+nameLabel+'</label></section>');
                        }
                        else {
                            $("#count-"+inputHow+"").parent().parent().remove();
                        }

                        //Add average-max
                        $("#average-max").val(data[0].Cantidad);
                    }
                });
            }
            else {
                $("#light #plate-addons-count").remove();
                $("#light h3").remove();
                $("#light hr").remove();
                $("#plate-img").append(imageDefault2);
                $("#plate-title").append('Sin información');
                $( "#end" ).attr('onclick', 'addProduct(1, 0);');
                $( "#add" ).attr('onclick', 'addProduct(0, 0);');
                $( "#addons-message" ).remove();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 03/10/2017
 * @function: getBranches
 * @version:  1
 **/
function getBranches() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        data: {
            funcion   : 'getBranches'
        },
        success:function(resp){

            //Convertir a objetos los datos json
            resp = JSON.parse(resp);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 03/10/2017
 * @function: getLastPlate
 * @version:  1
 **/
function getLastPlate() {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getLastPlate',
            tarjeta : localStorage.getItem('tarjeta')
        },
        success:function(data) {
            $.each(data, function(i, item) {
                $( "<tr><th>"+item.Fecha+"</th><th>"+item.Nombre+"</th><th>$"+item.Precio+".00</th><th><a href='#' onclick=\"goPlate('"+item.Consecutivo+"');\" class='btn-default'>Pedir</a></th></tr>" ).insertAfter( "#tablaEstadoCuenta .headers" );
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("funcion: getLastPlate()");
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 03/10/2017
 * @function: goPlates
 * @version:  1
 **/
function goPlates(category) {
    
    //Insertando valor de categoria
    localStorage.setItem('category', category);
    
    //Redirigiendo a platillos.
    window.location = "ordenaProducto.html"
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 05/10/2017
 * @function: goPlate
 * @version:  1
 **/
function goPlate(plate) {
    
    //Insertando valor de categoria
    localStorage.setItem('plate', plate);
    
    //Redirigiendo a platillos.
    window.location = "ordenaPlatillo.html";
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 23/10/2017
 * @function: goPromotion
 * @version:  1
 **/
function goPromotion(promotion, plate) {
    
    //Insertando valor de categoria
    localStorage.setItem('promotion', promotion);
    
    //Redirigiendo a platillos.
    window.location = "ordenaPromocion.html";
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: goOrder
 * @version:  1
 **/
function goOrder() {
    //Redirigiendo a platillos.
    window.location = "ordenaOrdenes.html";
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 04/10/2017
 * @function: addCategoriasCombo
 * @version:  1
 **/
function addCategoriasCombo() {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getCategorys'
        },
        success:function(data){
            //Agregando opciones al combobox de categorias
            $.each(data, function (i, item) {
                if ( localStorage.getItem('category') == item.Grupo ) {
                    $('#categoria').append($('<option>', {
                        value: item.Grupo,
                        text : item.Nombre,
                        selected: "selected"
                    }));
                }
                else {
                    $('#categoria').append($('<option>', {
                        value: item.Grupo,
                        text : item.Nombre
                    }));
                }
            });
            
            //Evento onchange
            $('#categoria').on('change', function() {
                goPlates(this.value);
            })
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 09/10/2017
 * @function: addProduct
 * @version:  1
 **/
function addProduct(cont, noComplements) {
    
    if (noComplements) {
        
        //Checkbox
        var sort = $("#plate-addons input:checked").length;

        if ( sort == 0 ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir algún complemento').show();
            return '';
        }

        //Inputs text
        var countAverage = 0;
        var maxAverage   = $( "#average-max" ).val();
        var bandera      = false;

        $( "input[id*='count-addon']" ).each(function( i, item ) {
            if( this.value == 0 ) {
                $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;La cantidad del complemento no puede ser 0 o estar vacío').show();
                bandera = true;
                return '';
            }
            else {
                countAverage += parseInt(this.value);
                bandera = false;
            }
        });

        if (bandera) {
            return '';
        }

        if ( maxAverage != countAverage ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debe de coincidir la cantidad máxima de: '+maxAverage+'').show();
            return '';
        }
    }
    
    //Declaration arrays
    var data     = new Array();
    var producto = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("shopping") )
        data = JSON.parse(localStorage.getItem("shopping"));
    
    //Add plate consecutivo id
    producto.push(localStorage.getItem("plate"));
    
    //Add complements
    $("input[id*='addon']:checked").each(function( i, item ) {
        var addonCount = $( "#count-"+this.id+"" ).val();
        var addon = [this.value, addonCount];
        
        producto.push(addon);
    });
    
    //Add producto
    data.push(producto);
    
    localStorage.setItem('shopping', JSON.stringify(data));
    
    if( cont ) {
        window.location = "ordenaEntrega.html";
    }
    else {
        window.location = "ordena.html";
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 09/10/2017
 * @function: getBranchs
 * @version:  1
 **/
function getBranchs() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getBranchs',
            idCliente : cliente,
        },
        success:function(data) {
            
            //Set value branch
            
            if ( localStorage.getItem('branch') ) {
                var sucursal = JSON.parse(localStorage.getItem('branch'));
                
                //Add branchs options
                $.each(data, function (i, item) {
                    $('#sucursales optgroup#'+item.id+'').append($('<option>', {
                        value: item.Sucursal,
                        text : item.Nombre
                    }));
                });
                
                $( "#sucursales" ).val( sucursal.id );
            }
            else {
                //Add branchs options
                $.each(data, function (i, item) {
                    $('#sucursales optgroup#'+item.id+'').append($('<option>', {
                        value: item.Sucursal,
                        text : item.Nombre
                    }));
                });
            }
            
            //Set value collect
            /*
            if ( localStorage.getItem('collect') ) {
                var getCome  = JSON.parse(localStorage.getItem('collect'));
                $( "#collect" ).val( getCome.id );
            }
            */
            
            //Set value date
            if ( localStorage.getItem('collect_date') ) {
                $( "#collect_date" ).val( localStorage.getItem('collect_date') );
            }
            
            //Set value time
            if ( localStorage.getItem('collect_time') ) {
                $( "#collect_time" ).val( localStorage.getItem('collect_time') );
            }
            
            //Evento onchange
            $('#sucursales').on('change', function() {
                localStorage.setItem('branch', JSON.stringify({
                    'id'     : this.value,
                    'Nombre' : $(this).find("option:selected").text()
                }));
            });
            
            $('#branchSave').on('click', function() {
                
                var dateCollet = $('#collect_date').val()+" "+$('#collect_time').val();
                var unixtime   = new Date(dateCollet).getTime() / 1000;
                var now        = new Date();
                var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds());
                var timestamp  = (startOfDay / 1000) + 2700; //Add 45 minutes
                
                if( $( "#sucursales" ).val() == "" ) {
                    $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir alguna sucursal').show();
                }
                else if( $('#collect_date').val() == "" ) {
                    $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir la fecha').show();
                }
                else if( $('#collect_time').val() == "" ) {
                    $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir un horario').show();
                }
                else if ( timestamp > unixtime ) {
                    $("#alertaRegistro").html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debe haber un tiempo de 45 minutos como minimo').show();
                }
                else {
                    localStorage.setItem('collect_date', $( "#collect_date" ).val());
                    localStorage.setItem('collect_time', $( "#collect_time" ).val());

                    window.location = "ordenaConfirma.html";
                }
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 09/10/2017
 * @function: addPaymethod
 * @version:  1
 **/
function addPaymethod(method) {
    localStorage.setItem('payMethod', JSON.stringify({
        'id'     : method,
        'Nombre' : method == 1 ? 'Paypal' : 'MercadoPago'
    }));
    
    window.location = "ordenaConfirma.html";
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 09/10/2017
 * @function: setShoppingSummary
 * @version:  1
 **/
function setShoppingSummary() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getPlateInfo',
            summary   : localStorage.getItem('shopping'),
            promotion : localStorage.getItem('promotionsAll')
        },
        success: function(resp) {
            
            if ( resp.html == '' ) {
                $( '<tr><td colspan="4">Sin productos</td></tr>' ).insertAfter( "#tablaEstadoCuenta tr:last" );
                localStorage.removeItem('shopping');
                localStorage.removeItem('promotions');
            }
            else {
                $( resp.html ).insertAfter( "#tablaEstadoCuenta tr:last" );
            }
            
            if ( resp.total == '' ) {
                $("#average").remove();
                $("#average-modal").remove();
                $("#realizaPago").remove();
                $("#ordenaComentarios").remove();
                $("#send-pedido").remove();
                $("#deliver").remove();
                $("#shopping-cart").remove();
            }
            else {
                //Average payment
                $("#average").append("El total de tu pedido es de: $"+resp.total+".00 pesos");
                $("#average-modal").append("$"+resp.total+".00 pesos");
                localStorage.setItem('importe', resp.total);
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown);
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 11/10/2017
 * @function: deleteRow
 * @version:  1
 **/
function deleteRow(id, consecutivo) {
    
    $( "#light3" ).hide();
    $( "#fade" ).hide();
    
    //Declaration arrays
    var data = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("shopping") )
        data = JSON.parse(localStorage.getItem("shopping"));
    
    //Buy shopping cart with the current dish to find matches and deleted
    if ( data.length ) {
        var result;
        for( var i = 0, len = data.length; i < len; i++ ) {
            if( data[i][0] === consecutivo ) {
                result = i;
                break;
            }
            else {
                result = 'undefined';
            }
        }
        
        if ( result != 'undefined' ) {
            data.splice(result, 1);
        }
    }
    
    localStorage.setItem('shopping', JSON.stringify(data));
    
    //Delete info
    $( "#deliver" ).html('');
    //$( "#payment" ).html('');
    $( "#average" ).html('');
    $( "#average-modal" ).html('');
    $( "#tablaEstadoCuenta" ).find("tr:gt(0)").remove();
    
    setShoppingSummary();
    
    var number_shopping   = localStorage.getItem("shopping") != null ? JSON.parse(localStorage.getItem("shopping")).length : 0;
    var number_promotions = localStorage.getItem("promotionsAll") != null ? JSON.parse(localStorage.getItem("promotionsAll")).length: 0;
    $( "#number-cart" ).html(number_shopping + number_promotions);
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 11/10/2017
 * @function: setPedido
 * @version:  1
 **/
function setPedido(idToken) {
    
    var comentarios = $( "#comentarios" ).val();
    var promocion   = $( "#promocion" ).val();
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        //dataType: "json",
        data: {
            funcion      : 'setPedido',
            summary      : localStorage.getItem('shopping'),
            promotions   : localStorage.getItem('promotionsAll'),
            comentarios  : comentarios,
            promocion    : promocion,
            sucursal     : localStorage.getItem('branch'),
            category     : localStorage.getItem('category'),
            category     : localStorage.getItem('category'),
            collect      : localStorage.getItem('collect'),
            collect_date : localStorage.getItem('collect_date'),
            collect_time : localStorage.getItem('collect_time'),
            payMethod    : localStorage.getItem('payMethod'),
            tarjeta      : localStorage.getItem('tarjeta'),
            importe      : localStorage.getItem('importe'),
            userData     : localStorage.getItem('pughpharm'),
            dataPaypal   : localStorage.getItem('paymentData'),
            token        : localStorage.getItem('tokenPaypal'),
            idToken      : idToken
        },
        success: function(resp) {
            localStorage.setItem('historyPayment', resp);
            localStorage.removeItem('shopping');
            localStorage.removeItem('promotionsAll');
            localStorage.removeItem('promotions');
            localStorage.removeItem('collect_date');
            localStorage.removeItem('collect_time');
            localStorage.removeItem('importe');
            localStorage.removeItem('plate');
            localStorage.removeItem('branch');
            localStorage.removeItem('category');
            
            window.location = "ordenaCompletado.html";  //redirect
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Function: setPedido()");
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function getTransactions() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getTransactions',
            tarjeta : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            $( resp.html ).insertAfter( "#tablaEstadoCuenta tr:last" );
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }  
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function addFavorite() {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion     : 'addFavorite',
            consecutivo : localStorage.getItem('plate'),
            tarjeta     : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            
            $( "#favorites" ).html('<a href="#" onclick="removeFavorite();" class="btn btn-danger btn-block"><i class="fa fa-times"></i> Remover de favoritos');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function removeFavorite() {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion     : 'removeFavorite',
            consecutivo : localStorage.getItem('plate'),
            tarjeta     : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            $( "#favorites" ).html('<a href="#" onclick="addFavorite();" class="btn btn-favoritos btn-block"><i class="fa fa-star"></i> Agregar a favoritos');
            
            //$( "#check1" ).removeAttr('checked');
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }  
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function setFavorite() {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion     : 'setFavorite',
            consecutivo : localStorage.getItem('plate'),
            tarjeta     : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            
            if( resp == 1 ) { 
                $( "#favorites" ).html('<a href="#" onclick="removeFavorite();" class="btn btn-danger btn-block"><i class="fa fa-times"></i> Remover de favoritos');
                
                //$( "#check1" ).attr('checked', 'checked');
            }
            else {
                $( "#favorites" ).html('<a href="#" onclick="addFavorite();" class="btn btn-favoritos btn-block"><i class="fa fa-star"></i> Agregar a favoritos');

                //$( "#check1" ).removeAttr('checked');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }  
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getFavorites
 * @version:  1
 **/
function getFavorites() {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion     : 'getFavorites',
            consecutivo : localStorage.getItem('plate'),
            tarjeta     : localStorage.getItem('tarjeta')
        },
        success:function(data) {
            
            if ( data.length == 0 ) {
                $( "#menu-categorias ul" ).append( "<li class='col-12 text-center'>Ningún producto en favoritos</li>" );
            }
            else {
                $.each(data, function(i, item) {
                    $( "#menu-categorias ul" ).append( "<li class='col-12' onclick=\"goPlate('"+item.Consecutivo+"');\" style='cursor: pointer;'><figure>"+(item.Imagen ? item.Imagen : imageDefault)+"</figure><div class='categorias-descripcion'><article><p class='descripcion'>"+item.Nombre+"</p></article></div><div class='btn-siguiente text-right'><a href='#'><i class='fa fa-chevron-right'></i></a></div></li>" );
                });
            }
            
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }  
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function getHistoryPlates() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getHistoryPlates',
            tarjeta : localStorage.getItem('tarjeta')
        },
        success: function(resp) {
            
            if( resp != '') {  
                $( resp ).insertAfter( "#tablaEstadoCuenta tr:last" );
            }
            else {
                $( "#text-history" ).html('No hay platillos por mostrar')
                $( "#button-history" ).remove();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }  
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getPromotions
 * @version:  1
 **/
function getPromotions() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getPromotions'
        },
        success:function(data){
            $.each(data, function(i, item) {
                $( "#menu-categorias ul" ).append( "<li class='col-12' onclick=\"goPromotion('"+item.Promocion+"', '"+item.Promocion+"');\" style='cursor: pointer;'><figure>"+imageDefault+"</figure><div class='categorias-descripcion'><article><p class='descripcion'>"+item.Nombre+"</p></article></div><div class='btn-siguiente text-right'><a href='#'><i class='fa fa-chevron-right'></i></a></div></li>" );
            });
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: getTransactions
 * @version:  1
 **/
function getOrderMyBranch() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion  : 'getOrderMyBranch',
            sucursal : '1',
            comercio : cliente
        },
        success: function(resp) {
            console.log(resp);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("function: getOrderMyBranch()");
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 12/10/2017
 * @function: setAnswerOrder
 * @version:  1
 **/
function setAnswerOrder() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        //dataType: "json",
        data: {
            funcion  : 'setAnswerOrder',
            sucursal : '1',
            pedido   : '3',
            status   : '13,1|6,2',
            comments : 'Un pedido esta en proceso',
            comercio : cliente
        },
        success: function(resp) {
            console.log(resp);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("function: setAnswerOrder()");
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown); 
        }
    })
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 23/10/2017
 * @function: getPromotion
 * @version:  1
 **/
function getPromotion() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getPromotion',
            promotion : localStorage.getItem('promotion'),
            idCliente : cliente
        },
        success:function(data){
            
            localStorage.setItem('promoLength', (data.length - 1));
            
            //Imagen
            $("#plate-img").append(imageDefault2);
            
            //Title
            $("#plate-title").append(data[localStorage.getItem('promoIndex')].Nombre+'<br/>$'+data[localStorage.getItem('promoIndex')].Precio+'.00 Pesos M.N.');
            
            $("#plate-description").append(data[localStorage.getItem('promoIndex')].nombreProducto);
            
            //Agregar complementos
            getAddonsPromotion(data[localStorage.getItem('promoIndex')].Consecutivo);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("function: getPromotion()");
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 26/10/2017
 * @function: getAddonsPromotion
 * @version:  1
 **/
function getAddonsPromotion(plate) {
    
    localStorage.setItem('promotion_plate', plate);
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getAddons',
            plate     : plate,
            idCliente : cliente
        },
        success:function(data){
            
            if ( data.length ) {
                
                $( "#plate-addons-count").hide();
                
                //Addons
                $.each(data, function(i, item) {
                    $("#plate-addons").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-check-input" type="checkbox" name="addon'+i+'" value="'+item.consecutivoComplemento+'" id="addon'+i+'">'+item.nombreComplemento+'</label></section>');
                });
                
                //Add max complements value
                $( "#addons-message-max" ).html(data[0].maximoProducto);
                
                $("#plate-addons input[type='checkbox']").change(function() {
                    var sort      = $("#plate-addons input:checked").length;
                    var inputHow  = $(this).attr('id');
                    var nameLabel = $(this).parent('label').text();

                    if ( sort == data[0].maximoProducto ) {
                        $("#plate-addons input:checkbox:not(:checked)").prop( "disabled", true );
                    }
                    else {
                        $("#plate-addons input:checkbox").prop( "disabled", false );
                    }
                    
                    //Add value select complements
                    var numberOfChecked = $('input:checkbox:checked').length;
                    $( "#addons-message-how").html(numberOfChecked);
                    
                    if (numberOfChecked > 0 && data[0].Cantidad > 0) {
                        $( "#plate-addons-count").removeClass('hide');
                    }
                    else {
                        $( "#plate-addons-count").addClass('hide');
                    }

                    //Flujo para complementos de más de una cantidad.
                    if ( data[0].Cantidad > 0 ) {
                        $( "#plate-addons-count").show();
                        $( "#addons-message-count").html(data[0].Cantidad);
                        
                        if ( $(this).is( ":checked" ) ) {
                            $("#plate-addons-count").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-control-text" type="number" name="count-'+inputHow+'" value="" id="count-'+inputHow+'">'+nameLabel+'</label></section>');
                        }
                        else {
                            $("#count-"+inputHow+"").parent().parent().remove();
                        }

                        //Add average-max
                        $("#average-max").val(data[0].Cantidad);
                    }
                    else {
                        $( "#plate-addons-count").hide();
                    }
                });
            }
            else {
                $( "#continue-promotion" ).attr('onclick', 'addPromotion(1);');
                $( "#addons-message" ).remove();
            }
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 26/10/2017
 * @function: addPromotion
 * @version:  1
 **/
function addPromotion(noComplements) {
    
    if (!noComplements) {
        
        //Checkbox
        var sort = $("#plate-addons input:checked").length;

        if ( sort == 0 ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir algún complemento').show();
            return '';
        }

        //Inputs text
        var countAverage = 0;
        var maxAverage   = $( "#average-max" ).val();
        var bandera      = false;

        $( "input[id*='count-addon']" ).each(function( i, item ) {
            if( this.value == 0 ) {
                $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;La cantidad del complemento no puede ser 0 o estar vacío').show();
                bandera = true;
                return '';
            }
            else {
                countAverage += parseInt(this.value);
                bandera = false;
            }
        });

        if (bandera) {
            return '';
        }

        if ( maxAverage != countAverage ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debe de coincidir la cantidad máxima de: '+maxAverage+'').show();
            return '';
        }
    }
    
    //Declaration arrays
    var data       = new Array();
    var producto   = new Array();
    var promotions = new Array();
    var promotion  = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("promotions") )
        data = JSON.parse(localStorage.getItem("promotions"));
    
    //Add plate consecutivo id
    producto.push(localStorage.getItem("promotion_plate"));
    
    //Add complements
    $("input[id*='addon']:checked").each(function( i, item ) {
        var addonCount = $( "#count-"+this.id+"" ).val();
        var addon = [this.value, addonCount];
        
        producto.push(addon);
    });
    
    //Add producto
    data.push(producto);
    
    localStorage.setItem('promotions', JSON.stringify(data));
    
    //Flujo multiobjeto
    if( localStorage.getItem('promoIndex') == localStorage.getItem('promoLength') ) {
        
        //Get promotions car is exists.
        if( localStorage.getItem("promotionsAll") )
            promotion = JSON.parse(localStorage.getItem("promotionsAll"));
        
        //Add promotion id
        var promotions = [localStorage.getItem("promotion"), data];
        
        promotion.push(promotions);
        
        localStorage.setItem('promotionsAll', JSON.stringify(promotion));
        
        //Redirect
        window.location = "ordenaEntrega.html";
    }
    else {
        var promoIndex = parseInt(localStorage.getItem('promoIndex')) + 1;
        localStorage.setItem('promoIndex', promoIndex);
        goPromotion(localStorage.getItem('promotion'));
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 11/10/2017
 * @function: deleteRow
 * @version:  1
 **/
function deleteRowPromo(id, promo) {
    
    $( "#light4" ).hide();
    $( "#fade" ).hide();
    
    //Declaration arrays
    var data = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("promotionsAll") )
        data = JSON.parse(localStorage.getItem("promotionsAll"));
    
    //Buy shopping cart with the current dish to find matches and deleted
    if ( data.length ) {
        var result;
        for( var i = 0, len = data.length; i < len; i++ ) {
            if( data[i][0] === promo ) {
                result = i;
                break;
            }
            else {
                result = 'undefined';
            }
        }
        
        if ( result != 'undefined' ) {
            data.splice(result, 1);
        }
    }
    
    localStorage.setItem('promotionsAll', JSON.stringify(data));
    
    //Delete info
    $( "#deliver" ).html('');
    //$( "#payment" ).html('');
    $( "#average" ).html('');
    $( "#average-modal" ).html('');
    $( "#tablaEstadoCuenta" ).find("tr:gt(0)").remove();
    
    setShoppingSummary();
    
    var number_shopping   = localStorage.getItem("shopping") != null ? JSON.parse(localStorage.getItem("shopping")).length : 0;
    var number_promotions = localStorage.getItem("promotionsAll") != null ? JSON.parse(localStorage.getItem("promotionsAll")).length: 0;
    $( "#number-cart" ).html(number_shopping + number_promotions);
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: orderMasive
 * @version:  1
 **/
function orderMasive() {
    
    var checked = $("#tablaEstadoCuenta input:checkbox:checked");
    
    if ( checked.length ) {
        var orders  = new Array();
        
        $.each(checked, function(i, item) {
            orders.push(this.value);
        });
        
        localStorage.setItem('orders', JSON.stringify(orders));
        
        window.location = "ordenaOrdenes.html";
    }
    else {
        $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Tienes que elegir alguna orden').show();
        return '';
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: getOrder
 * @version:  1
 **/
function getOrder() {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getOrder',
            orders    : localStorage.getItem('orders'),
            idCliente : cliente
        },
        success:function(data){
            
            localStorage.setItem('orderLength', (data.length - 1));
            
            //Imagen
            $("#plate-img").append(imageDefault2);
            
            //Title
            $("#plate-title").append(data[localStorage.getItem('orderIndex')].Nombre+'<br/>$'+data[localStorage.getItem('orderIndex')].Precio+'.00 Pesos M.N.');
            
            //Agregar complementos
            getAddonsOrders(data[localStorage.getItem('orderIndex')].Consecutivo);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("function: getOrder()");
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: getAddonsOrders
 * @version:  1
 **/
function getAddonsOrders(plate) {
    
    localStorage.setItem('order_plate', plate);
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getAddons',
            plate     : plate,
            idCliente : cliente
        },
        success:function(data){
            
            if ( data.length ) {
                
                //Addons
                $.each(data, function(i, item) {
                    $("#plate-addons").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-check-input" type="checkbox" name="addon'+i+'" value="'+item.consecutivoComplemento+'" id="addon'+i+'">'+item.nombreComplemento+'</label></section>');
                });
                
                //Add max complements value
                $( "#addons-message-max" ).html(data[0].maximoProducto);
                
                $("#plate-addons input[type='checkbox']").change(function() {
                    var sort      = $("#plate-addons input:checked").length;
                    var inputHow  = $(this).attr('id');
                    var nameLabel = $(this).parent('label').text();

                    if ( sort == data[0].maximoProducto ) {
                        $("#plate-addons input:checkbox:not(:checked)").prop( "disabled", true );
                    }
                    else {
                        $("#plate-addons input:checkbox").prop( "disabled", false );
                    }
                    
                    //Add value select complements
                    var numberOfChecked = $('input:checkbox:checked').length;
                    $( "#addons-message-how").html(numberOfChecked);
                    
                    if (numberOfChecked > 0 && data[0].Cantidad > 0) {
                        $( "#plate-addons-count").removeClass('hide');
                    }
                    else {
                        $( "#plate-addons-count").addClass('hide');
                    }
                    
                    //Flujo para complementos de más de una cantidad.
                    if ( data[0].Cantidad > 0 ) {
                        $( "#plate-addons-count").show();
                        $( "#addons-message-count").html(data[0].Cantidad);
                        
                        if ( $(this).is( ":checked" ) ) {
                            $("#plate-addons-count").append('<section class="col-6 float-left no-pl"><label class="form-check-label"><input class="form-control-text" type="number" name="count-'+inputHow+'" value="" id="count-'+inputHow+'">'+nameLabel+'</label></section>');
                        }
                        else {
                            $("#count-"+inputHow+"").parent().parent().remove();
                        }

                        //Add average-max
                        $("#average-max").val(data[0].Cantidad);
                    }
                    else {
                        $( "#plate-addons-count").hide();
                    }
                });
            }
            else {
                $( "#continue-order" ).attr('onclick', 'addOrder(1);');
                $( "#addons-message" ).remove();
            }
            
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 26/10/2017
 * @function: addPromotion
 * @version:  1
 **/
function addOrder(noComplements) {
    
    if (!noComplements) {
        
        //Checkbox
        var sort = $("#plate-addons input:checked").length;

        if ( sort == 0 ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debes de elegir algún complemento').show();
            return '';
        }

        //Inputs text
        var countAverage = 0;
        var maxAverage   = $( "#average-max" ).val();
        var bandera      = false;

        $( "input[id*='count-addon']" ).each(function( i, item ) {
            if( this.value == 0 ) {
                $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;La cantidad del complemento no puede ser 0 o estar vacío').show();
                bandera = true;
                return '';
            }
            else {
                countAverage += parseInt(this.value);
                bandera = false;
            }
        });

        if (bandera) {
            return '';
        }

        if ( maxAverage != countAverage ) {
            $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Debe de coincidir la cantidad máxima de: '+maxAverage+'').show();
            return '';
        }
    }
    
    //Declaration arrays
    var data       = new Array();
    var producto   = new Array();
    var promotions = new Array();
    var promotion  = new Array();
    
    //Get shopping car is exists.
    if( localStorage.getItem("shopping") )
        data = JSON.parse(localStorage.getItem("shopping"));
    
    //Add plate consecutivo id
    producto.push(localStorage.getItem("order_plate"));
    
    //Add complements
    $("input[id*='addon']:checked").each(function( i, item ) {
        var addonCount = $( "#count-"+this.id+"" ).val();
        var addon = [this.value, addonCount];
        
        producto.push(addon);
    });
    
    //Add producto
    data.push(producto);
    
    localStorage.setItem('shopping', JSON.stringify(data));
    
    //Flujo multiobjeto
    if( localStorage.getItem('orderIndex') == localStorage.getItem('orderLength') ) {
        //Redirect
        window.location = "ordenaEntrega.html";
    }
    else {
        var orderIndex = parseInt(localStorage.getItem('orderIndex')) + 1;
        localStorage.setItem('orderIndex', orderIndex);
        goOrder();
    }
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: PaymentPaypal
 * @version:  1
 **/
function PaymentPaypal(pay) {
    
    // var env = 'production';
    var env = 'sandbox';
    
    var client = {
        sandbox:    'AVjidpyq3AChF8N-XVSZWruvzR458hl_WwHrSUmtQf7ngpCHUWA17lNnUb89WCTdfXUYsKxCINhaiuj5',
        production: 'ASOuYaPFJfF02GiT8CsoPDsol_yO_rObixTr9jBcPBrtfFvvrLkO9EcBMPxiALfipoYFbmiNB_oaYlwh'
    }
    
    paypal.rest.payment.create(env, client, {
        payment: {
            transactions: [{
                amount: { total: pay, currency: 'MXN' }
            }],
            redirect_urls: {
                return_url: 'http://admin.lealtadprimero.com.mx/servicio/paypal.php?tarjeta='+localStorage.getItem('tarjeta'),
                cancel_url: 'cordova-app://cancel-url',
            }
        }
    }).then(function(token) {
        setToken(token);
        localStorage.setItem('tokenPaypal', token);
        var ref = cordova.InAppBrowser.open('https://www.sandbox.paypal.com/checkoutnow?token=' + token, '_blank', 'location=yes');
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 30/10/2017
 * @function: PaymentPaypal
 * @version:  1
 **/
function corroborarPedido(token) {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion   : 'getConfirmOrder',
            token     : localStorage.getItem('tokenPaypal'),
            tarjeta   : localStorage.getItem('tarjeta'),
        },
        success:function(data){
            
            if ( data.id ) {
                setPedido(data.id);
                localStorage.setItem('tokenPaypal', '');
            }
            else {
                $( "#alertaRegistro" ).html('<i class="fa fa-warning fa-lg"></i>&nbsp;Ocurrio un problema con su pago, vuelva a realizar la compra o intente de nuevo').show();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Function: corroborarPedido()"); 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 31/10/2017
 * @function: setToken
 * @version:  1
 **/
function setToken(token) {
    
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        //dataType: "json",
        data: {
            funcion   : 'setToken',
            token     : token,
            tarjeta   : localStorage.getItem('tarjeta'),
        },
        success:function(data){
            console.log(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Function: setToken()"); 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

/**
 * @author:   Roberto Ramirez
 * @contact:  roberto_ramirez@avansys.com.mx
 * @creation: 31/10/2017
 * @function: getPaymentData
 * @version:  1
 **/
function getPaymentData(order) {
    $.ajax({
        url: ruta_generica,
        type: 'POST',
        dataType: "json",
        data: {
            funcion : 'getPaymentData',
            tarjeta : localStorage.getItem('tarjeta'),
            order   : localStorage.getItem("historyPayment")
        },
        success:function(data){
            
            $( '#folio' ).html(data.Numero);
            $( '#id' ).html(data.PayerID);
            $( '#state' ).html(data.paymentId);
            $( '#cart' ).html(data.token);
            $( '#create_time' ).html(data.update_at);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
            console.log("Function: getPaymentData()"); 
            console.log("Status: " + textStatus); 
            console.log("Error: " + errorThrown); 
        }
    });
}

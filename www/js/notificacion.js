/*var dispositivo = (navigator.userAgent.match(/iPhone/i)) == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : "null";
var token;

//function notificar_dispositivo(){
    //FCMPlugin.getToken(function(tok){
    //    alert(tok);
    //    token=tok;
    //});
//}//function

//alert("Inicio");

/*
function notificar_dispositivo() {
    
    //alert("llego");
    token='inicio';
    
    var push = PushNotification.init({
        "android": { "senderID": "558908248494" },
        "ios": { "alert": "true", "badge": "true", "sound": "true" }, 
        "windows": {}
    });
    
    //alert("termino");
    
    push.on('registration', function(data){
        //alert("Bien");
        token = data.registrationId;
        alert('558908248494');
        alert(token);
        /*$.ajax({
            method: 'POST',
            url: ruta + 'push',
            data: {
                push : data.registrationId,
                id: 1
            },
            processData: true,
            dataType: "json",
            success: function (data) 
            {
                if(data.vinculado !== undefined)
                {
                   // window.location = "categoriaProductos.html";
                   // ingresar();
                }
                else
                    tn.deleteToken();
            },
            error: function (data)
            {
                alert(JSON.stringify(data));
                tn.deleteToken();
            }
        });*//*
    });

    push.on('notification', function(data) {
        //alert("Llego");
        /*myApp.addNotification({
            title: "Toma Nota",
            message: data.message
        });
        data.sound;*//*
    });

    push.on('error', function(e) {
        alert("Estamos tratando de contactarte, por favor comunicate con nosotros");
    });
}//function

*/

/*
$(document).ready(function() {
alert("Dos")
pushNotification = window.plugins.pushNotification;
alert("tres");
if (device.platform=='android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
    pushNotification.register(successHandler, errorHandler, {"senderID":"319024422700","ecb":"onNotification"});
    alert("Cuatro")
    // required!
}else{
    alert("Cinco")
     pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});    // required!
}
alert("6");
});//function
                  
function successHandler (result) {
	                //$("#app-status-ul").append('<li>success:'+ result +'</li>');
    token=result;
    alert(token);
}//function
*/
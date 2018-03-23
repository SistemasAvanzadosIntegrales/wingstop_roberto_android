/*jslint sloppy:true, browser:true, devel:true, white:true, vars:true, eqeq:true, plusplus:true */
/*global $:false, intel:false*/
/** 
 * This function runs once the page is loaded, but intel is not yet active 
 */

/**
 * Prevent Default Scrolling 
 */
var onDeviceReady = function() {                        // called when Cordova is ready
   if( window.Cordova && navigator.splashscreen ) {   // Cordova API detected
        navigator.splashscreen.hide() ;               // hide splash screen
    }
};

document.addEventListener("deviceready", onDeviceReady, false);

//Event listener for camera
document.addEventListener("intel.xdk.camera.picture.add", onSuccess); 
document.addEventListener("intel.xdk.camera.picture.busy", onSuccess); 
document.addEventListener("intel.xdk.camera.picture.cancel", onSuccess);

var picturecount = 0;

function onSuccess(imageURI) {
    var pic1 = document.getElementById("usr");
    var changebutton = document.getElementById("buttonid");    
        
    pic1.src = imageURI; 
    localStorage.setItem("imagen", JSON.stringify({'ruta':imageURI}));
    $('nav').animate({
        left: '0'
    });
	
    contador = 0;
}

/**
 * onSuccess2
 **/
function onSuccess2(imageURI) {
    var pic1 = document.getElementById("usr");
    var changebutton = document.getElementById("buttonid");    
        
    pic1.src = imageURI; 
    localStorage.setItem("imagen", JSON.stringify({'ruta':imageURI}));
    $('nav').animate({
        left: '0'
    });
}

/**
 * onFail
 **/
function onFail(message) {
  // alert("Picture failure: " + message);
}

/**
 * takepicture
 **/
function takepicture() {
    navigator.camera.getPicture(onSuccess, onFail, { 
        quality: 50, 
        destinationType: 
        Camera.DestinationType.FILE_URI, 
        saveToPhotoAlbum: true 
    });
}

function importLibrary() {
    
}

/**
 * Config de cam
 **/
function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    }
    
    return options;
}

function openFilePicker() {

    var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    var options = setOptions(srcType);
    
    navigator.camera.getPicture(function cameraSuccess(imageUri) {
        onSuccess2(imageUri);
    }, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");

    }, options);
}

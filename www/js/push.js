// Add to index.js or the first page that loads with your app.
// For Intel XDK and please add this to your app.js.
    
document.addEventListener('deviceready', function () {
    // Enable to debug issues.
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    
    var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
    
    window.plugins.OneSignal
        .startInit("7abfa51d-2448-45a1-9cdb-0c206841b828")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();
    
    // Call syncHashedEmail anywhere in your app if you have the user's email.
    // This improves the effectiveness of OneSignal's "best-time" notification scheduling feature.
    // window.plugins.OneSignal.syncHashedEmail(userEmail);
}, false);
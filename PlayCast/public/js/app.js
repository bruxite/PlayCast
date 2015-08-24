//(function(angular) {
    'use script';
    
    //angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'NerdCtrl', 'NerdService', 'GeekCtrl', 'GeekService']);

var app = angular.module("playCast", [
        "ngSanitize",
        'ngFileUpload',    
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.poster"

    ]);

    
//}())(window.angular);
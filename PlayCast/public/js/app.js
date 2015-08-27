//(function(angular) {
    'use script';
    
    //angular.module('sampleApp', ['ngRoute', 'appRoutes', 'MainCtrl', 'NerdCtrl', 'NerdService', 'GeekCtrl', 'GeekService']);

var app = angular.module("playCast", [
        "ngSanitize",
        'ngFileUpload',    
        "com.2fdevs.videogular",
        "com.2fdevs.videogular.plugins.controls",
        "com.2fdevs.videogular.plugins.overlayplay",
        "com.2fdevs.videogular.plugins.buffering",
        "com.2fdevs.videogular.plugins.poster"

    ]);

app.directive('scrollOnClick', function () {
    return {
        restrict: 'A',
        link: function (scope, $elm) {
            $elm.on('click', function () {
                $("GameDiv").animate({ scrollTop: $elm.offset().top }, "slow");
            });
        }
    }
});
    
//}())(window.angular);
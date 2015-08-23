//(function() {
    
    //angular.module("playCast.gamesView", []).controller("gamesViewController",
    
    app.controller("playsViewController",
    ["$scope", "$window","$http", "$location","$sce",
        function ($scope, $window, $http, $location, $sce) {
            $scope.play = null;
            $scope.videogularConfig = {
                theme: "/lib/videogular-themes-default/videogular.css"
            }

            var urlParts = $location.absUrl().split("/");
            
            var gameId = urlParts[urlParts.length - 2];
            var playId = urlParts[urlParts.length - 1];

            var playApiUrl = "/api/plays/" + gameId + "/" + playId;
            console.log(playApiUrl);

            $http.get(playApiUrl)
                .then(function (result) {
                        console.log("results...");
                        console.log(result);
                        $scope.play = result.data;
                        $scope.play.sources = [
                            { src: $sce.trustAsResourceUrl($scope.play.videoUrl), type: $scope.play.videoType }
                        ];
                        $scope.play.tracks = [];
                        console.log($scope.play);
                    }, function(err) {
                        alert(err);
                    }
            );

           
        }
]);
//})();
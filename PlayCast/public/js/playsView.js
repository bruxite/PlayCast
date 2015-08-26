//(function() {

'use script';

//angular.module("playCast.gamesView", []).controller("gamesViewController",

app.controller("playsViewController",
    ["$scope", "$window", "$http", "$location", "$sce",
    function ($scope, $window, $http, $location, $sce) {
        $scope.play = null;
        $scope.game = null;
        $scope.gameId = "";
        //var createBlankPlay = function () {
        //    console.log("createBlankPlay called");
        //    return {
        //        seriesNumber: 1,
        //        seriesTeam: 1,
        //        playNumber: 1,
        //        playDown: "First Down",
        //        playResult: "X yards",
        //    };
        //}
        //$scope.newPlay = createBlankPlay();
        
        $scope.videogularConfig = {
            theme: "/lib/videogular-themes-default/videogular.css"
        }
        
        $scope.getPlay = function () {
            
            console.log("getPlay called");
            
            var urlParts = $location.absUrl().split("/");
            
            var gameId = urlParts[urlParts.length - 2];
            var playId = urlParts[urlParts.length - 1];
            $scope.gameId = gameId;

            var playApiUrl = "/api/plays/" + gameId + "/" + playId;
            console.log(playApiUrl);
            
            $http.get(playApiUrl)
                .then(function (result) {
                    console.log("results...");
                    console.log(result);
                    $scope.game = result.data;
                    console.log('$scope.game');
                    console.log($scope.game);
                    $scope.play = $scope.game.plays.filter(function (play) {
                        return play._id == playId;
                    }).pop();
                    console.log('play');
                    console.log($scope.play);
                    $scope.play.sources = [
                        { src: $sce.trustAsResourceUrl($scope.play.videoUrl), type: $scope.play.videoType }
                    ];
                    $scope.play.tracks = [];
                    console.log($scope.play);
                }, function (err) {
                    alert(err);
                }
            );
        }
        
        //$scope.savePlay = function (newPlay) {
        //    console.log("inside save Play");
        //    var gameId = newPlay.gameId;
        //    console.log(gameId);
        //    $http.post("/api/plays/add/"+ gameId, newPlay)
        //        .then(function (result) {
        //            console.log("received result from api/plays/add");
        //            console.log(result.data);
        //            $scope.plays.push(result.data);
        //            $scope.newPlay = createBlankPlay();
        //    }),
        //        function (err) {
        //            console.log("received errors from api/plays/add");
                
        //            console.log(err);
        //            alert(err);
        //    };
        //}

        
        

           
    }
]);
//})();
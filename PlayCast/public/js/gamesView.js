//(function() {
'use script';

//angular.module('NerdCtrl', []).controller('NerdController', function ($scope) {
app.controller("gamesViewController", [
    "$scope", "$window", "$http", "$location", "$sce", "Upload",
    function ($scope, $window, $http, $location, $sce, Upload) {
        $scope.game = null;
        $scope.games = [];
        
        $scope.videogularConfig = {
            theme: "/lib/videogular-themes-default/videogular.css"
        }

        var createBlankGame = function () {
            return {
                date: new Date(),
                opponent: "",
                location: "",
                plays: [],
                isDeleted: false
            };
        }
        $scope.newGame = createBlankGame();
        
        var createBlankPlay = function () {
            console.log("createBlankPlay called");
            return {
                seriesNumber: 1,
                seriesTeam: 1,
                playNumber: 1,
                playDown: 1,
                playYards: 0,
                playPenalty: false,
                playComments: "",
                gameId: ""
            };
        }
        $scope.newPlay = createBlankPlay();
        
        
        $scope.getGames = function () {
            $http.get("/api/games")
                .then(function (result) {
                console.log(result);
                $scope.games = result.data;
            }), function (err) {
                console.log(err);
                alert(err);
            };
        }
        
        $scope.getGame = function () {
            console.log("inside $scope.getGame");
            var leftHashUrl = $location.absUrl().split("#");
            var urlParts = leftHashUrl[0].split("/");
            
            var gameId = urlParts[urlParts.length - 1];
            
            $http.get("/api/games/" + gameId)
                .then(function (result) {
                console.log("received results from getGame API");
                console.log(result.data);
                $scope.newPlay.gameId = result.data._id;
                $scope.game = result.data;
            }), function (err) {
                console.log(err);
                alert(err);
            };
        }
        
        $scope.saveGame = function (newGame) {
            console.log("calling save game api");
            console.log(newGame);
            $http.post("/api/games/add", newGame)
                    .then(function(result) {
                        console.log(result);
                        $scope.games.push(result.data);
                        $scope.newGame = createBlankGame();
                    }),
                function(err) {
                    console.log(err);
                    alert(err);
                };
        }
        
        
        $scope.savePlay = function (file) {
            console.log("inside save Play");
            console.log($scope.newPlay.gameId);
            console.log(file);
            if (file) {
                Upload.upload({
                    url: '/api/plays/add/' + $scope.newPlay.gameId, 
                    fields: {
                        seriesNumber: $scope.newPlay.seriesNumber,
                        seriesTeam: $scope.newPlay.seriesTeam,
                        playNumber: $scope.newPlay.playNumber,
                        playDown: $scope.newPlay.playDown,
                        playYards: $scope.newPlay.playYards,
                        playPenalty: $scope.newPlay.playPenalty,
                        playComments: $scope.newPlay.playComments,
                        gameId: $scope.newPlay.gameId
                    }, file: file
                }).progress(function (event) {
                    var progressPercentage = parseInt(100.0 * event.loaded / event.total);
                    console.log('progress: ' + progressPercentage + '% ' + event.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + JSON.stringify(data));
                    $scope.games.push(data);
                    $scope.newGame = createBlankGame();
                    $scope.$apply();
                });
            }
        }
        

    }
]);



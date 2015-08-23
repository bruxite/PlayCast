//(function() {
    'use script';

    //angular.module('NerdCtrl', []).controller('NerdController', function ($scope) {
    app.controller("gamesViewController", ["$scope", "$window","$http", "$location","$sce",
        function ($scope, $window, $http, $location, $sce) {
            $scope.game = null;
            $scope.games = [];
            $scope.newGame = {
                date: new Date(),
                opponent: "",
                location: "",
                plays: [],
                isDeleted: false
            };

            $scope.getGames = function() {
                $http.get("/api/games")
                .then(function (result) {
                    console.log(result);
                    $scope.games = result.data;
                }), function(err) {
                    console.log(err);
                    alert(err);
                };
            }
            

            }
    ]);

//(function() {
'use script';

//angular.module('NerdCtrl', []).controller('NerdController', function ($scope) {
app.controller("gamesViewController", [
    "$scope", "$window", "$http", "$location", "$sce", "Upload",
    function ($scope, $window, $http, $location, $sce, Upload) {
        $scope.game = null;
        $scope.games = [];
        $scope.sources = [
            { src: '', type: '' }
        ];
        $scope.tracks = [];
                    
        $scope.videogularConfig = {
            tracks: [
                {
                    src: "/default.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    default: ""
                }
            ],
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
                number: 1,
                team: 'Home',
                down: 'First Down',
                yardsToGo: 10,
                yardsGained: 0,
                penalty: false,
                comments: "",
                gameId: "",
                playId: ""
            };
        }

        if ($scope.newPlay == null) {
            $scope.newPlay = createBlankPlay();
        }

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
                    var lastPlay = result.data.plays[result.data.plays.length - 1];
                    console.log('lastPlay');
                    if(lastPlay){
                        console.log(lastPlay);
                        console.log('modifying newGame');
                        //console.log('yardsToGo ' + (lastPlay.yardsToGo));
                       // console.log('yardsGained ' + (lastPlay.yardsGained));
                       // console.log('remaining yards ' + (lastPlay.yardsToGo - lastPlay.yardsGained));
                        $scope.newPlay = {
                            number: lastPlay.number + 1,
                            team: lastPlay.team,
                            down: 'First Down',//TODO - design down advancement logic
                            yardsToGo: (lastPlay.yardsToGo - lastPlay.yardsGained) < 1 ? 10 : lastPlay.yardsToGo - lastPlay.yardsGained,
                            yardsGained: 0,
                            penalty: false,
                            comments: ""
                        }
                        $scope.videogularConfig.sources = [
                            { src: $sce.trustAsResourceUrl(lastPlay.videoUrl), type: lastPlay.videoType }
                        ];
                    }
                    $scope.newPlay.gameId = result.data._id;
                    
                    console.log('$scope.newPlay');
                    console.log($scope.newPlay);
                    
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
            
            var url = "";
            if ($scope.newPlay.playId == '') {
                url = '/api/plays/add/' + $scope.newPlay.gameId;
            } else {
                url = '/api/plays/edit/' + $scope.newPlay.playId;
            }
            console.log(url);
            console.log($scope.newPlay.playId);


            if (file) {
                Upload.upload({
                    url: url,
                    fields: {
                        number: $scope.newPlay.number,
                        team: $scope.newPlay.team,
                        down: $scope.newPlay.down,
                        yardsToGo: $scope.newPlay.yardsToGo,
                        yardsGained: $scope.newPlay.yardsGained,
                        penalty: $scope.newPlay.penalty,
                        comments: $scope.newPlay.comments,
                        gameId: $scope.newPlay.gameId,
                        playId: $scope.newPlay.playId
                    },
                    file: file
                }).progress(function(event) {
                    var progressPercentage = parseInt(100.0 * event.loaded / event.total);
                    console.log('progress: ' + progressPercentage + '% ' + event.config.file.name);
                }).success(function(data, status, headers, config) {
                    console.log('file ' + config.file.name + ' uploaded. Response: ' + JSON.stringify(data));
                    $scope.game.plays.push(data);
                    $scope.newPlay.number = Number(data.number) + 1;
                    $scope.newPlay.team = data.team;
                    $scope.newPlay.down = 'First Down'; //TODO - design down advancement logic
                    $scope.newPlay.yardsToGo = (data.yardsToGo - data.yardsGained) < 1 ? 10 : data.yardsToGo - data.yardsGained;
                    $scope.newPlay.yardsGained = 0;
                    $scope.newPlay.penalty = false,
                        $scope.newPlay.comments = "";

                    console.log('$scope.newPlay');
                    console.log($scope.newPlay);

                    //$scope.$apply();
                });
            } else {
                var fields = {
                    number: $scope.newPlay.number,
                    team: $scope.newPlay.team,
                    down: $scope.newPlay.down,
                    yardsToGo: $scope.newPlay.yardsToGo,
                    yardsGained: $scope.newPlay.yardsGained,
                    penalty: $scope.newPlay.penalty,
                    comments: $scope.newPlay.comments,
                    gameId: $scope.newPlay.gameId,
                    playId: $scope.newPlay.playId
                }
                console.log('saving without file');
                $http.post('/api/plays/addNoVideo/' + $scope.newPlay.gameId, fields)
                    .then(function (result) {
                    console.log(result);
                    $scope.games.plays.push(result.data);
                    $scope.newPlay.number = Number(data.number) + 1;
                    $scope.newPlay.team = data.team;
                    $scope.newPlay.down = 'First Down'; //TODO - design down advancement logic
                    $scope.newPlay.yardsToGo = (data.yardsToGo - data.yardsGained) < 1 ? 10 : data.yardsToGo - data.yardsGained;
                    $scope.newPlay.yardsGained = 0;
                    $scope.newPlay.penalty = false,
                    $scope.newPlay.comments = "";
                }),
                function (err) {
                    console.log(err);
                    alert(err);
                };
                
            }

        }

        $scope.setPlayViewer = function (play) {
            console.log('setPlayViewer');
            console.log(play);
            $scope.videogularConfig.sources = [
                { src: $sce.trustAsResourceUrl(play.videoUrl), type: play.videoType }
            ];
        }
        
        $scope.editPlay = function (play, gameId) {
            console.log('editPlay');
            console.log(play);
            $scope.newPlay = play;
            $scope.newPlay.gameId = gameId;
            $scope.newPlay.playId = play._id;
        }

    }
]);



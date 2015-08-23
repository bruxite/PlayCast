(function(gamesController) {

    var data = require("../data");
    var game = require('../models/game');

    gamesController.init = function (app){
        
        app.get('/api/games', function (req, res, next) {
            
            data.getGames( function (err, games) {
                if (err) {
                    res.send(500, err);
                } else if (games) {
                    res.set("Content-Type", "application/json");
                    res.send(games);
                } else {
                    res.send(404, "No games not found");
                }
            });

        });

        app.get('/api/games/:gameId', function (req, res, next) {
            var gameId = req.params.gameId;
            
            data.getGame(gameId, function (err, game) {
                if (err) {
                    res.send(500, err);
                } else if (game) {
                    res.set("Content-Type", "application/json");
                    res.send(game);
                } else {
                    res.send(404, "Game not found");
                }
            });

        });

        app.post("/api/games/add", function(req, res) {

            var gameId = req.params.gameId;

            var game = new Game();
            game.date = req.body.date,
            game.opponent = req.body.opponent;
            game.location = req.body.location;
            game.plays = [];
            game.isDeleted = false;
            game.createdOn = new Date();
                
            data.addGameApi(game, req, function(err, savedGame) {
                if (err) {
                    res.send(500, err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(game);
                }
            });
        });

    };
})(module.exports);
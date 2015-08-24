(function(gamesController) {

    var data = require("../data");
    var Game = require('../models/game');

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
            console.log("inside get games api / getGame");
            data.getGame(gameId, function (err, game) {
                console.log("received results from data.getGame");
            
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

        app.post("/api/games/add", function(req, res, next) {
            console.log("in api to add game");

            var game = new Game({
                date: req.body.date,
                opponent: req.body.opponent,
                location: req.body.location,
                plays: [],
                isDeleted: false,
                createdOn: new Date()
            });
                
            data.addGame(game, function(err, savedGame) {
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
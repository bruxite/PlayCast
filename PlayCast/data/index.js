(function(data) {

    var seedData = require("./seedData");
    var database = require("./database");
    var path = require('path');
    var fs = require('fs');

    var Game = require('../models/game');
    
    data.getGames = function(next) { 
        Game.find(function(err, games) {
            if (err) {
                console.log("Game.Find Error: " + err);
                next(err, null);
            } else {
                next(null, games);
            }
        });
    };

    data.getGame = function (gameId, next) {
        Game.findOne({ _id: gameId }, function (err, game) {
            if (err) {
                console.log("Game.Find Error: " + err);
                next(err, null);
            } else if (!game) {
                console.log('Game ' + gameId + ' not found!');
                err = "Game not found.";
                next(err, null);
            } else {
                var uploadPath = 'uploads/' + gameId;
                fs.exists(uploadPath, function (exists) {
                    if (exists == false) {
                        fs.mkdir(uploadPath, 0755, function (err) {
                            console.log("making upload directory");
                            if (err) {
                                console.log("Error creating folder: " + err);
                            }
                        });
                    }
                });
                
                next(null, game);
            }
        });
    };

    data.addPlay = function(fields, req, next) {
        console.log("inside data.add play");
        
        var gameId = fields.gameId;
        var play = {
            number: fields.number,
            team: fields.team,
            down: fields.down,
            yardsToGo: fields.yardsToGo,
            yardsGained: fields.playYards,
            penalty: fields.penalty,
            comments: fields.comments,
            videoType: fields.videoType,
            videoUrl: fields.videoUrl,
            createdOn: new Date()
        };

        console.log('gameId');
        console.log(gameId);
        console.log('play');
        console.log(play);
        
        Game.update(
            { "_id": gameId },
            {
                "$push": {
                    "plays": play //{
                        //seriesNumber: fields.seriesNumber,
                        //seriesTeam: fields.seriesTeam,
                        //playNumber: fields.playNumber,
                        //playDown: fields.playDown,
                        //playYards: fields.playYards,
                        //playPenalty: fields.playPenalty,
                        //playComments: fields.playComments,
                        //videoUrl: fields.videoUrl,
                        //videoType: fields.videoType,
                        //createdOn: new Date()
                    //}
                }
            },
            { safe: true, upsert: true },
            function(err, result) {
                if (err) {
                    // If it failed, return error
                    console.log(err);
                    next(err, null);
                } else {
                    console.log('game.update');
                    console.log(result);
                    next(null, play);
                }
            }
        );
    };

    function seedDatabase() {
        
        Game.count({}, function (err, count) {
            if (err) {
                console.log("Error occurred seeding the data: " + err);
            } else {
                console.log("Current count of games: " + count);
                if (count == 0) {
                    console.log('Seeding the database...');
                    seedData.initialGames.forEach(function(game) {
                        game.save(function (err) {
                            if (err) {
                                console.log("Error saving game: " + game.opponent);
                            } else {
                                console.log('Game saved successfully!');
                            } 
                        });
                    });
                } else {
                    console.log('Database already seeded...');
                }
            }  
        });
    }

    seedDatabase();

})(module.exports);
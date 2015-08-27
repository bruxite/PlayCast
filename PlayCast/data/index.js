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
    
    data.addGame = function (game, req, next) {
        console.log("inside data.addGame");
        console.log(game);
        
        game.save(function (err) {
                if (err) {
                    // If it failed, return error
                    console.log(err);
                    next(err, null);
                } else {
                    console.log('game.save complete');
                    console.log(game);
                    next(null, game);
                }
            }
        );
    };

    data.addPlay = function(fields, req, next) {
        console.log("inside data.add play");
        
        var gameId = fields.gameId;
        var play = {
            number: fields.number,
            team: fields.team,
            down: fields.down,
            yardsToGo: fields.yardsToGo,
            yardsGained: fields.yardsGained,
            penalty: fields.penalty,
            comments: fields.comments,
            videoUrl: fields.videoUrl,
            videoType: fields.videoType,
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
                    "plays": { 
                        number: fields.number,
                        team: fields.team,
                        down: fields.down,
                        yardsToGo: fields.yardsToGo,
                        yardsGained: fields.yardsGained,
                        penalty: fields.penalty,
                        comments: fields.comments,
                        videoUrl: fields.videoUrl,
                        videoType: fields.videoType,
                        createdOn: new Date()
                    }
                }
            },
            { safe: true, upsert: true },
            function(err, result) {
                if (err) {
                    // If it failed, return error
                    console.log(err);
                    next(err, null);
                } else {
                    console.log('game.update result');
                    console.log(result);
                    next(null, play);
                }
            }
        );
    };
    
    data.updatePlay = function (fields, req, next) {
        console.log("inside data.Update play");
        
        var gameId = fields.gameId;
        var playId = fields.playId;
        console.log('playId');
        console.log(playId);
        var play = {
            number: fields.number,
            team: fields.team,
            down: fields.down,
            yardsToGo: fields.yardsToGo,
            yardsGained: fields.yardsGained,
            penalty: fields.penalty,
            comments: fields.comments,
            videoUrl: fields.videoUrl,
            videoType: fields.videoType,
            createdOn: new Date()
        };
        
        console.log('gameId');
        console.log(gameId);
        console.log('play');
        console.log(play);
        
//query =
//'fanclubs.fanclub_id': fanclub_id

//fan_update =
//'fanclubs.$.fanclub_name': fanclub_data.fanclub_name

//Fan.update query, fan_update, (err, numAffected) ->
//console.log err
//console.log numAffected
        
               

        //Game.update(
        //    { "plays._id": playId },
        //    {
        //        "$push": {
        //            "plays.$.play": {
        //                number: fields.number,
        //                team: fields.team,
        //                down: fields.down,
        //                yardsToGo: fields.yardsToGo,
        //                yardsGained: fields.yardsGained,
        //                penalty: fields.penalty,
        //                comments: fields.comments,
        //                videoUrl: fields.videoUrl,
        //                videoType: fields.videoType,
        //                createdOn: new Date()
        //            }
        //        }
        //    },
        //    { safe: true, upsert: true },
            
            Game.findOneAndUpdate(
                { "_id": gameId, "plays._id": playId },
    {
                    "$set": {
                        "plays.$": {
                            number: fields.number,
                            team: fields.team,
                            down: fields.down,
                            yardsToGo: fields.yardsToGo,
                            yardsGained: fields.yardsGained,
                            penalty: fields.penalty,
                            comments: fields.comments,
                            videoUrl: fields.videoUrl,
                            videoType: fields.videoType,
                            createdOn: new Date()
                        }
                    }
                },
            function (err, result) {
                if (err) {
                    // If it failed, return error
                    console.log(err);
                    next(err, null);
                } else {
                    console.log('game.update result');
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
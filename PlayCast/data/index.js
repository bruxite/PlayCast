(function(data) {

    var seedData = require("./seedData");
    var database = require("./database");
    var fs = require("fs");
    var path = require('path');

    var Game = require('../models/game');
    var Play = require('../models/play');

    //data.getGames = function(next) {
    //    next(null, seedData.initialGames);
    //};
    
    //return all games
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
    
    data.addGame = function (newGame, next) {
        console.log("in data.addGame");
        console.log(newGame);

        Game.find({ opponent: newGame.opponent, date: newGame.date }, function(err, foundGame) {
            if (err) {
                console.log("Game Add error on checking for existing game: " + err);
                next(err, null);
            } else if (foundGame._id != undefined) {
                console.log("Game Add found existing game: " + foundGame._id);
                next(null, foundGame);
            } else {
                newGame.save(function(err, savedGame) {
                    if (err) {
                        console.log("Game Add error on checking for existing game: " + err);
                        next(err, null);
                    } else {
                        next(null, savedGame);
                    }
                });
            }   
        });
    };

    
    data.getPlay = function(gameId, playId, next) {
        console.log("game id: " + gameId);
        console.log("play id: " + playId);

        Game.findOne({ _id: gameId }, function (err, game) {
            if (err) {
                console.log("Game.Find Error: " + err);
                next(err, null);
            } else if (!game) {
                console.log('Game ' + gameId + ' not found!');
                err = "Game not found.";
                next(err, null);
            } else {
                console.log('Found game ' + gameId + ' .');
                //console.log(game);

                var play = game.plays.id(playId);
                console.log(play);
                next(null, play);
            }
        });
    }

    data.addPlay = function(gameId, play, req, next) {
        console.log("inside data.addPlay");
        console.log(req.file);
        if (!req.file) {
            next("req.file was not found.", null);
        } else {
            fs.exists(req.file.path, function (exists) {
                if (exists) {
                    console.log("req.file found on filesystem.");
                    
                } else {
                    console.log("req.file did not exist on filesystem.");
                    next("req.file did not exist on filesystem.", null);
                }
            });
        }
        console.log("gameId: " + req.body.gameId);
        console.log("oldVideoUrlPath: " + req.file.path);
        console.log("filename: " + req.file.filename);
        
        var playVideo = "uploads\\" + req.body.gameId + "\\" + req.file.filename.replace("/","");
        console.log("newVideoUrlPath: " + playVideo);
        
        fs.rename(req.file.path, playVideo, function (err) {
            if (err) {
                next("Error occurred in rename: " + err);
            }
            console.log('Renamed complete');

            playVideo = "/" + playVideo.replace("\\\\", "/");
            console.log("replacedNewVideoUrlPath: " + playVideo);
        
            Game.update(
                { "_id": req.body.gameId },
            {
                    "$push": {
                        "plays": play
                    }
                },
            { safe: true, upsert: true },
            function (err, game) {
                    if (err) {
                        // If it failed, return error
                        console.log(err);
                        next(err, null);
                    } else {
                        next(null, game);
                    }
                }
            );
        });
    };
    
    //data.addPlayApi = function (gameId, play, req, next) {
        
    //    //console.log(req.file);
    //    if (!req.file) {
    //        next("req.file was not found.", null);
    //    } else {
    //        fs.exists(req.file.path, function (exists) {
    //            if (exists) {
    //                console.log("req.file found on filesystem.");
                    
    //            } else {
    //                console.log("req.file did not exist on filesystem.");
    //                next("req.file did not exist on filesystem.", null);
    //            }
    //        });
    //    }
    //    console.log("gameId: " + gameId);
    //    console.log("oldVideoUrlPath: " + req.file.path);
    //    console.log("filename: " + req.file.filename);
        
    //    var playVideo = "uploads\\" + gameId + "\\" + req.file.filename.replace("/", "");
    //    console.log("newVideoUrlPath: " + playVideo);
        
    //    fs.rename(req.file.path, playVideo, function (err) {
    //        if (err) {
    //            next("Error occurred in rename: " + err);
    //        }
    //        console.log('Renamed complete');
            
    //        playVideo = "/" + playVideo.replace("\\\\", "/");
    //        console.log("replacedNewVideoUrlPath: " + playVideo);
            
    //        game.update(
    //            { "_id": gameId },
    //        {
    //                "$push": {
    //                    "plays": play
    //                }
    //            },
    //        { safe: true, upsert: true },
    //        function (err, game) {
    //                if (err) {
    //                    // If it failed, return error
    //                    console.log(err);
    //                    next(err, null);
    //                } else {
    //                    next(null, game);
    //                }
    //            }
    //        );
    //    });
    //};

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
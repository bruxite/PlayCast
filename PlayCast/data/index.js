(function(data) {

    var seedData = require("./seedData");
    var database = require("./database");
    var fs = require("fs");
    var path = require('path');

    var game = require('../models/game');

    //data.getGames = function(next) {
    //    next(null, seedData.initialGames);
    //};
    
    //return all games
    data.getGames = function(next) {
        game.find(function(err, games) {
            if (err) {
                console.log("Game.Find Error: " + err);
                next(err, null);
            } else {
                next(null, games);
            }
        });
    };

    data.getGame = function (gameId, next) {
        console.log("game id: " + gameId);
        game.findOne({ _id: gameId }, function (err, game) {
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

                var uploadPath = 'uploads/' + gameId;
                console.log('upload path: ' + uploadPath);
                fs.exists(uploadPath, function (exists) {
                    console.log('game upload folder exists: ' + exists.toString());
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
        console.log(game);

        game.find({ opponent: game.opponent, date: game.date }, function(err, game) {
            if (err) {
                Console.log("Game Add error on checking for existing game: " + err);
                next(err, null);
            } else {
                game.add(function(err, gameSaved) {
                    if (err) {
                        Console.log("Game Add error on checking for existing game: " + err);
                        next(err, null);
                    } else {
                        next(null, gameSaved);
                    }
                });
            }   
        });
    };

    
    data.getPlay = function(gameId, playId, next) {
        console.log("game id: " + gameId);
        console.log("play id: " + playId);

        game.findOne({ _id: gameId }, function (err, game) {
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

    data.addPlay = function(req, next) {
        //console.log(req.file);
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
        
            game.update(
                { "_id": req.body.gameId },
            {
                    "$push": {
                        "plays": {
                            seriesNumber: req.body.seriesNumber,
                            seriesTeam: req.body.seriesTeam,
                            playNumber: req.body.playNumber,
                            down: req.body.playDown,
                            result: req.body.playResult,
                            videoUrl: playVideo,
                            videoType: req.file.mimetype,
                            createdOn: new Date()
                        }
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
    
    data.addPlayApi = function (gameId, play, req, next) {
        
        //console.log(req.file);
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
        console.log("gameId: " + gameId);
        console.log("oldVideoUrlPath: " + req.file.path);
        console.log("filename: " + req.file.filename);
        
        var playVideo = "uploads\\" + gameId + "\\" + req.file.filename.replace("/", "");
        console.log("newVideoUrlPath: " + playVideo);
        
        fs.rename(req.file.path, playVideo, function (err) {
            if (err) {
                next("Error occurred in rename: " + err);
            }
            console.log('Renamed complete');
            
            playVideo = "/" + playVideo.replace("\\\\", "/");
            console.log("replacedNewVideoUrlPath: " + playVideo);
            
            game.update(
                { "_id": gameId },
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

    function seedDatabase() {
        
        game.count({}, function (err, count) {
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
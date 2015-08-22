(function(data) {

    var seedData = require("./seedData");
    var database = require("./database");
    
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
                console.log(game);
                next(null, game);
            }
        });
    };

    data.addPlay = function(req, next) {
        var playVideo = "";
        //if (req.files) {
        //    fs.exists(req.files.playVideo.path, function (exists) {
        //        if (exists) {
        //            playVideo = "/" + req.files.playVideo.path.replace("\\", "/");
        //        } else {
        //            console.log("Well, there is no magic for those who don’t believe in it!");
        //        }
        //    });
        //}
        console.log("inside add play");
        console.log(req);
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
                        videoUrl: "/" + req.files.playVideo.path.replace("\\", "/"),
                        createdOn: new Date()
                    }
                }
            },
            { safe: true, upsert: true },
            function(err, game) {
                if (err) {
                    // If it failed, return error
                    console.log(err);
                    next(err, null);
                } else {
                    next(null, game);
                }
            }
        );
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
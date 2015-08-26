(function (playsController) {
    
    var data = require("../data");
    var formidable = require('formidable');
    var path = require('path');
    var fs = require('fs');
    
    var Game = require('../models/game');
   // var Play = require('../models/play');
    
    var multer = require('multer');
    var upload = multer({
        dest: 'uploads/',
        rename: function (fieldname, filename) {
            return filename.replace(/\W+/g, '-').toLowerCase();
        },
        onFileUploadStart: function (file) {
            console.log(file.name + ' is starting ...');
        },
        onFileUploadComplete: function (file, req, res) {
            console.log(file.name + ' uploading is ended ...');
            console.log("File name : " + file.name + "\n" + "FilePath: " + file.path);
        },
        onError: function (error, next) {
            console.log("File uploading error: => " + error);
            next(error);
        },
        onFileSizeLimit: function (file) {
            console.log('Failed: ', file.originalname + " in path: " + file.path);
            fs.unlink('../tmpUploads/' + file.path); // delete the partially written file
        }
    });

    playsController.init = function (app) {
        
        app.get("/plays/:gameId/:playId", function (req, res) { 
            res.render("play", { title: "Play | PlayCast" });
        });
        
        app.get('/api/plays/:gameId/:playId', function (req, res, next) {
            console.log('inside api.getGame');
            var gameId = req.params.gameId;
            console.log('gameId');
            console.log(gameId);
            var playId = req.params.playId;
            console.log('playId');
            console.log(playId);
            

            data.getGame(gameId, function (err, game) {
                if (err) {
                    res.send(500, err);
                } else if (game) {
                    console.log('game');
                    console.log(game);
                    res.set("Content-Type", "application/json");
                    res.send(game);
                } else {
                    res.send(404, "Play not found");
                }
            });

        });
        
        app.post("/api/plays/add/:gameId", function (req, res, next) {
            console.log("inside api add play");

            var form = new formidable.IncomingForm();
            form.parse(req, function (err, fields, files) {
                var file = files.file;
                var gameId = fields.gameId;
                fields.videoType = file.type;
                console.log(file);
                console.log(file.path);
                console.log(file.type);
                console.log(fields);
                
                var tempPath = file.path;
                console.log('tempPath');
                console.log(tempPath);
                var savePath = 'uploads/' + gameId + '/'
                console.log('savePath');
                console.log(savePath);
                
                var targetPath = path.resolve(savePath + file.name);
                fs.rename(tempPath, targetPath, function(err) {
                    if (err) {
                        throw err;
                    }
                    //logger.debug(file.name + " upload complete for game: " + fields.gameId);
                    //next({ path: savePath + file.name });
                    fields.videoUrl = "/" + savePath + file.name;
                    
                    console.log('fields');
                    console.log(fields);
                    data.addPlay(fields, req, function (err, play) {
                        if (err) {
                            res.send(500, err);
                        } else {
                            console.log('received result from data.addPlay');
                            console.log(play);
                            res.set("Content-Type", "application/json");
                            res.send(play);
                        }
                    });

                });
            });

            //var gameId = req.params.gameId;
            //console.log(gameId);
            
            //console.log("req.body");
            //console.log(req.body);
            //console.log("req.file");
            //console.log(req.file);

            
            
            
        });

    };
})(module.exports);
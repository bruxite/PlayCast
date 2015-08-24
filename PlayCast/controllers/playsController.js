(function (playsController) {
    
    var data = require("../data");
    var Game = require('../models/game');
    var Play = require('../models/play');
    
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
            var gameId = req.params.gameId;
            var playId = req.params.playId;
            
            data.getPlay(gameId, playId, function (err, play) {
                if (err) {
                    res.send(500, err);
                } else if (play) {
                    res.set("Content-Type", "application/json");
                    res.send(play);
                } else {
                    res.send(404, "Play not found");
                }
            });

        });
        
        app.post("/api/plays/add/:gameId", fields, upload.single('playVideo'), function (req, res) {
            console.log("inside api add play");
            var gameId = req.params.gameId;
            console.log(gameId);
            
            console.log("req.body");
            console.log(req.body);
            console.log("req.file");
            console.log(req.file);

            var play = new Play({
                seriesNumber: req.body.seriesNumber,
                seriesTeam: req.body.seriesTeam,
                playNumber: req.body.playNumber,
                down: req.body.playDown,
                result: req.body.playResult,
                videoType: req.file.mimetype,
                createdOn: new Date()
            });
            
            data.addPlay(gameId, play, req, function (err, game) {
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
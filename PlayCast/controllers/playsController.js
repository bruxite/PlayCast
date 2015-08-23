(function(playsController) {

    var data = require("../data");
    var game = require('../models/game');

    playsController.init = function (app){
        
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

        app.post("/api/plays/:gameId", function(req, res) {

            var gameId = req.params.gameId;

            var play = new PlaySchema();
            play.seriesNumber = req.body.seriesNumber;
            play.seriesTeam = req.body.seriesTeam;
            play.playNumber = req.body.playNumber;
            play.down = req.body.playDown;
            play.result = req.body.playResult;
            play.videoUrl = playVideo;
            play.videoType = req.file.mimetype;
            play.createdOn = new Date();

            data.addPlayApi(gameId, play, req, function(err, game) {
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
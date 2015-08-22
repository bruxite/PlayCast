(function(homeController) {
    homeController.init = function(app) {

        var data = require("../data");

        //Home Page
        app.get("/", function (req, res) {
            data.getGames(function(err, games) {
                res.render("index", { title: "Games | PlayCast", error: err, games: games});
            });
        });

        //Game Page
        app.get('/game/:id', function (req, res, next) {
            var gameId = req.params.id;

            data.getGame(gameId, function(err, game) {
                res.render('game', {
                    title: 'Game ' + game.opponent,
                    "game": game
                });
            });

        });

        app.post('/play/add', function (req, res, next) {
            console.log(req.body);
            data.addPlay(req, function (err, game) {
                res.render('game', {
                    title: 'Game ' + game.opponent,
                    "game": game
                });
            });

        });


    };

})(module.exports);
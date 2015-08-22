(function(homeController) {
    homeController.init = function(app) {

        var data = require("../data");

        //Home Page
        app.get("/", function (req, res) {
            data.getGames(function(err, games) {
                res.render("index", { title: "Games | PlayCast", error: err, games: games});
            });
        });
    };

})(module.exports);
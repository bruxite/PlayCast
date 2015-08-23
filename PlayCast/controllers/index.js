(function(controllers) {
    
    var homeController = require("./homeController");
    var gamesController = require("./gamesController");
    var playsController = require("./playsController");

    controllers.init = function(app) {
        homeController.init(app);
        gamesController.init(app);
        playsController.init(app);
    };
})(module.exports);
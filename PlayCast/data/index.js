(function(data) {

    var seedData = require("./seedData");

    data.getGames = function(next) {
        next(null, seedData.initialGames);
    };

})(module.exports);
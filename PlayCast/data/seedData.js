(function (seedData) {
    
    var game = require('../models/game');

    seedData.initialGames = [
        new game({
            date: new Date("2015", "08", "26"),
            opponent: "Some School",
            location: "Home",
            createdOn: new Date()

        }),
        new game({
            date: new Date("2015", "08", "31"),
            opponent: "Zeeland West",
            location: "Away",
            createdOn: new Date()

        })
    ];

})(module.exports);
(function(database) {

    var mongo = require('mongodb');
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://localhost:27017/PlayCast');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        // connected to the DB
    });

})(module.exports);
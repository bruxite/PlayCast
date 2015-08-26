// grab the things we need
var mongoose = require('mongoose');

//var PlaySchema = new mongoose.Schema({
//    seriesNumber: Number,
//    seriesTeam: String,
//    playNumber: Number,
//    playDown: Number,
//    playYards: Number,
//    playPenalty: Boolean,
//    playComments: String,
//    videoUrl: String,
//    videoType: String,
//    createdOn: Date
//});

// the schema is useless so far
// we need to create a model using it
// make this available to our users in our Node applications
//var PlayModel = mongoose.model('Play', PlaySchema);

// create a schema
var GameSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    opponent: { type: String, required: true },
    location: { type: String, required: true },
    plays: [{
            seriesNumber: Number,
            seriesTeam: String,
            playNumber: Number,
            playDown: Number,
            playYards: Number,
            playPenalty: Boolean,
            playComments: String,
            videoUrl: String,
            videoType: String,
            createdOn: Date
        }],
    isDeleted: {type: Boolean, default: false},
    createdOn: Date
});

// the schema is useless so far
// we need to create a model using it
// make this available to our users in our Node applications
module.exports = mongoose.model('Game', GameSchema);
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlaySchema = new Schema({
    seriesNumber: Number,
    seriesTeam: String,
    playNumber: Number,
    down: { type: String, required: true },
    result: String,
    videoUrl: String,
    createdOn: Date
});

// create a schema
var GameSchema = new Schema({
    date: { type: Date, required: true, unique: true },
    opponent: { type: String, required: true },
    location: { type: String, required: true },
    plays: [PlaySchema],
    isDeleted: {type: Boolean, default: false},
    createdOn: Date
});

// the schema is useless so far
// we need to create a model using it
var Game = mongoose.model('Game', GameSchema);

// make this available to our users in our Node applications
module.exports = Game;
// grab the things we need
var mongoose = require('mongoose');

var playSchema = new mongoose.Schema({
    number: Number,
    team: String,
    down: Number,
    yardsToGo: Number,
    yardsGained: Number,
    penalty: Boolean,
    comments: String,
    videoUrl: String,
    videoType: String,
    createdOn: Date
});

var gameSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    opponent: { type: String, required: true },
    location: { type: String, required: true },
    plays: [playSchema],
    isDeleted: { type: Boolean, default: false },
    createdOn: Date
});

var Game = mongoose.model('Game', gameSchema);

module.exports = Game;
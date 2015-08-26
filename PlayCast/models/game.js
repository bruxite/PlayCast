// grab the things we need
var mongoose = require('mongoose');

var playSchema = new mongoose.Schema({
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
// grab the things we need
var mongoose = require('mongoose');
var play = require('./play');

// create a schema
var gameSchema = new mongoose.Schema({
    date: { type: Date, required: true, unique: true },
    opponent: { type: String, required: true },
    location: { type: String, required: true },
    plays: [play],
    isDeleted: {type: Boolean, default: false},
    createdOn: Date
});

// the schema is useless so far
// we need to create a model using it
// make this available to our users in our Node applications
module.exports = mongoose.model('Game', gameSchema);
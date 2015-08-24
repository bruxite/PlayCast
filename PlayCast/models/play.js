// grab the things we need
var mongoose = require('mongoose');

var playSchema = new mongoose.Schema({
    seriesNumber: Number,
    seriesTeam: String,
    playNumber: Number,
    down: { type: String, required: true },
    result: String,
    videoUrl: String,
    videoType: String,
    createdOn: Date
});

// the schema is useless so far
// we need to create a model using it
// make this available to our users in our Node applications
module.exports = mongoose.model('Play', playSchema);
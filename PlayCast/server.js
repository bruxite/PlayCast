var http = require('http');
var port = process.env.port || 3000;

var express = require('express');
var app = express();
var controllers = require("./controllers");

var multer = require('multer');
var fs = require("fs"); 

app.set("view engine", "vash");

//app.engine('vash.html', require('vash').__express);

app.use(express.static(__dirname + "/public"));
app.use('/uploads', express.static('uploads'));

//Map the routes
controllers.init(app);

//app.use(multer({
//    dest: './uploads/',
//    rename: function (fieldname, filename) {
//        return filename.replace(/\W+/g, '-').toLowerCase();
//    },
//    onFileUploadStart: function (file) {
//        console.log(file.name + ' is starting ...');
//    },
//    onFileUploadComplete: function (file, req, res) {
//        console.log(file.name + ' uploading is ended ...');
//        console.log("File name : " + file.name + "\n" + "FilePath: " + file.path);
//    },
//    onError: function (error, next) {
//        console.log("File uploading error: => " + error);
//        next(error);
//    },
//    onFileSizeLimit: function (file) {
//        console.log('Failed: ', file.originalname + " in path: " + file.path);
//        fs.unlink('../tmpUploads/' + file.path); // delete the partially written file
//    }

//}));


var server = http.createServer(app);

server.listen(port);
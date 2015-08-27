var http = require('http');
var port = process.env.port || 80;

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var flash = require("connect-flash");

var multer = require('multer');
var fs = require("fs");

var controllers = require("./controllers");

var app = express();

app.set("view engine", "vash");

// Opt into service
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));
app.use('/uploads', express.static('uploads'));

//var upload = multer({ dest: './uploads/' });
//var upload = multer({ dest: './uploads/' });
//app.use(multer({ dest: './uploads/' }));
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
//    })
//);

//Map the routes
controllers.init(app);


//module.exports = app;

var server = http.createServer(app);

server.listen(port);
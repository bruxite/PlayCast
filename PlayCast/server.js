var http = require('http');
var port = process.env.port || 3000;

var express = require('express');
var app = express();
var controllers = require("./controllers");

app.set("view engine", "vash");


app.use(express.static(__dirname + "/public"));

//Map the routes
controllers.init(app);



//app.get("/api/users", function(req, res) {
//    res.set("Content-Type", "application/json");
//    res.send({ hello: "world", brux: "cool", isAlive: true });
//});

var server = http.createServer(app);

server.listen(port);
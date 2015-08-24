(function(homeController) {
    homeController.init = function(app) {

        var data = require("../data");
        var multer = require('multer');
        var upload = multer({
            dest: 'uploads/',
            rename: function (fieldname, filename) {
                return filename.replace(/\W+/g, '-').toLowerCase();
            },
            onFileUploadStart: function (file) {
                console.log(file.name + ' is starting ...');
            },
            onFileUploadComplete: function (file, req, res) {
                console.log(file.name + ' uploading is ended ...');
                console.log("File name : " + file.name + "\n" + "FilePath: " + file.path);
            },
            onError: function (error, next) {
                console.log("File uploading error: => " + error);
                next(error);
            },
            onFileSizeLimit: function (file) {
                console.log('Failed: ', file.originalname + " in path: " + file.path);
                fs.unlink('../tmpUploads/' + file.path); // delete the partially written file
            }
        });
        
       //Home Page
        app.get("/", function (req, res) {
            console.log("rendering index page");
            res.render("index", { title: "Games | PlayCast" });
        });

        //Game Page
        app.get('/game/:id', function (req, res, next) {
            
            res.render('game', { title: 'Game | PlayCast' });

            //data.getGame(gameId, function(err, game) {
            //    if (game) {
            //        res.render('game', {
            //            title: 'Game ' + game.opponent,
            //            "game": game
            //        });
            //    } else {
            //        res.render("index", { title: "Games | PlayCast", error: err });
            //    }


            //});

        });

        app.post('/play/add', upload.single('playVideo'), function (req, res) {

                var gameId = req.body.gameId;
                console.log("gameId: " + req.body.gameId);
            
                upload.rename = 
                console.log(req.body);
                data.addPlay(req, function (err, game) {
                    if (err) {
                        console.log(err);
                        data.getGame(gameId, function (errGetGame, game) {
                            if (errGetGame) {
                                res.render('index', {
                                    title: "Games | PlayCast",
                                    error: err
                                });
                            } else {
                                res.render('game', {
                                    title: 'Game ' + game.opponent,
                                    error: err,
                                    "game": game
                                });
                            }
                        
                        });
                    } else {
                        console.log(game);
                        res.redirect('/game/' + game._id);
                    }

                
                });

        });


    };

})(module.exports);
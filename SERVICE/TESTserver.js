//port to use
var port = 8865;

// Importing the required modules
var express = require('express');
var bodyparser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var sharp = require('sharp');

var upload = multer({ dest: './images' })

// Initialize the express object
var app = express();

app.set('port', port);

// Use body-parser to parse incoming data
app.use(bodyparser.urlencoded({ extended: true }))

sharp('bear.jpg')
    .resize(200, 200)
    .toBuffer()
    .then(data => {
        fs.writeFileSync('newThumbnail.png', data);
    })
    .catch(err => {
        console.log(err);
    });


//-------------------SERVER SECTION--------------------------------------------------------------//
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log("Server Running!")
    console.log('Express started on flip1.engr.oregonstate.edu:' + app.get('port') + ' OR localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});



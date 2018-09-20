// Initialize variables
var express = require('express');
var app = express();
var port = 4300;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/rd_only_pa_pg.html');
    }
);

app.get('/style.css', function(req, res) {
    res.sendFile(__dirname + '/style.css');
    }
);

app.listen(port, function() {
    console.log("My Node.js server is listening for requests for the PA READ-ONLY PAGE on port: " + port);
   }
);
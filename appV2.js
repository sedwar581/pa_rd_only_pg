/* 
  - Processing Amplifier (PA) Read-Only Page
  - For use in control rooms of the CNN networks;
    this file contains the server script for 
    the read only PA page. 
  - Author: Steven Edwards
  - Page Started: September 2018
*/

// Initialize variables
var express = require('express');
var app = express();
var port = 4302;

app.get('/Read-Only-PA-Page', function(req, res) {
    res.type('text/html');
    res.sendFile(__dirname + '/rd_only_pa_pgV2.html');
    }
);

app.get('/style.css', function(req, res) {
    res.type('text/css');
    res.sendFile(__dirname + '/style.css');
    }
);

app.get('/scripts/ro_scriptV2.js', function(req, res) {
    res.type('application/javascript');
    res.sendFile(__dirname + '/scripts/ro_scriptV2.js');
    }
);

app.get('/pa_data', function(req, res) {
    res.type('text/plain');
    res.sendFile(__dirname + '/quartz_res.txt');
    }
);

app.listen(port, function() {
    console.log("My Node.js server is listening for requests for the PA READ-ONLY PAGE on port: " + port);
   }
);
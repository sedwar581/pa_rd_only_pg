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
    res.type('html');
    res.sendFile('/html/rd_only_pa_pgV2.html', {root: __dirname + '/..'});
});

app.get('/style.css', function(req, res) {
    res.type('text/css');
    res.sendFile('/css/Green_White_papg.css', {root: __dirname + '/..'});
    //res.sendFile(__dirname + '/css/Yellow_Green_papg.css');
    //res.sendFile(__dirname + '/css/White_Green_papg.css');
});

app.get('/graphics/VALID_TS', function(req, res) {
    res.type('image/gif');
    res.sendFile('/graphics/VALID_TS_loop_23fps_480px.gif', {root: __dirname + '/..'});
});

app.get('/ro_scriptV2.js', function(req, res) {
    res.type('application/javascript');
    res.sendFile('/ro_scriptV2.js', {root: __dirname});
});

app.get('/pa_data', function(req, res) {
    res.type('text/plain');
    res.sendFile('/data/quartz_res.txt', {root: __dirname + '/..'});
});

app.listen(port, function() {
    console.log("My Node.js server is listening for requests for the PA READ-ONLY PAGE on port: " + port);
});
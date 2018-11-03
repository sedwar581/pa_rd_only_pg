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
var port = 4353;
var index_path = "/DEV-PAPG-v2";

app.get(index_path, function(req, res) {
    res.type('html');
    res.sendFile('/html/rd_only_pa_pgV2.html', {root: __dirname + '/..'});
});

//app.use(express.static(__dirname + '/../public'));

app.get('/style.css', function(req, res) {
    res.type('text/css');  
    //res.sendFile('/css/White_Yellow_On_Black_papg.css', {root: __dirname + '/..'});
    //res.sendFile('/css/White_On_Green_papg.css', {root: __dirname + '/..'});
    res.sendFile('/css/Green_On_Yellow_papg.css', {root: __dirname + '/..'});
    //res.sendFile('/css/Green_On_White_papg.css', {root: __dirname + '/..'});
    //res.sendFile('/css/Green_White_On_Black_papg.css', {root: __dirname + '/..'});
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
    console.log("My Node.js server is listening for requests for the DEV PA READ-ONLY PAGE on port: " + port + " at path: " + index_path);
});

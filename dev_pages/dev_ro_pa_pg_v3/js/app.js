/* 
  - Processing Amplifier (PA) Read-Only Page
  - For use in control rooms of the CNN networks;
    this file contains the server script for 
    the read only PA page. 
  - Author: Steven Edwards
  - Page Started: September 2018
*/

// Initialize variables
require('dotenv').config(); // nodemon js/app.js must be issued from the directory where the .env file is located in order for the dotenv package to read the correct information
const express = require('express');
const app = express();
const port = 5302;
const shell = require('shelljs');
const { execFile } = require('child_process');
const exec = require('child_process').exec;

execFile('/bash/clearpa.sh');

// // Database related config. info.
// const mongoose = require('mongoose');
// mongoose.connect(process.env.PADB_URI, { useNewUrlParser: true });
// const pa_Db = mongoose.connection;
// var pa_assignment_Schema = mongoose.Schema({
//     pa_number: String,
//     source: String,
//     entry_time: Date,
//     requester: String
// });
// const Assignment = mongoose.model('Assignment', pa_assignment_Schema);

app.get('/DEV_Read-Only-PA-Page', function(req, res) {
    res.type('html');
    res.sendFile('/html/rd_only_pa_pg.html', {root: __dirname + '/..'});
});

app.get('/style.css', function(req, res) {
    res.type('text/css');  
    res.sendFile('/css/Green_On_Yellow_papg.css', {root: __dirname + '/..'});
    //res.sendFile('/css/Green_White_On_Black_papg.css', {root: __dirname + '/..'});
});

app.get('/ro_script.js', function(req, res) {
    res.type('application/javascript');
    res.sendFile('/ro_script.js', {root: __dirname});
});

app.get('/pa_data', function(req, res) {
    res.type('text/plain');
    res.sendFile('/dev_data/quartz_res.json', {root: __dirname + '/../..'});
    //res.sendFile('/dev_data/quartz_res_copy.json', {root: __dirname + '/../..'});
    //res.sendFile('/dev_data/quartz_res_null.json', {root: __dirname + '/../..'});    
});

// app.get('/exec_script', function(req, res) {
//     //shell.echo(shell.pwd());
//     var childProc = execFile('/bash/clearpa.sh');
// });

app.listen(port, function() {
    console.log("My Node.js server is listening for requests for the /DEV_Read-Only-PA-Page on port: " + port);
});

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
const shellX = require('shell-exec');   // not required
const {exec} = require('child_process'); // REQUIRED!!!! September 11 2019
var app = express();
var port = 4302;


app.get('/', function(req, res) {
    res.redirect('/Read-Only-PA-Page'); // redirecting to the URL below
})

app.get('/Read-Only-PA-Page', function(req, res) {
    res.type('html');
    res.sendFile('/html/rd_only_pa_pg.html', {root: __dirname + '/..'});
});

app.get('/style.css', function(req, res) {
    res.type('text/css');  
    //res.sendFile('/css/White_Yellow_On_Black_papg.css', {root: __dirname + '/..'});
    //res.sendFile('/css/White_On_Green_papg.css', {root: __dirname + '/..'});
    //res.sendFile('/css/Green_On_Yellow_papg.css', {root: __dirname + '/..'});
    //res.sendFile('/css/Green_On_White_papg.css', {root: __dirname + '/..'});
    res.sendFile('/css/Green_White_On_Black_papg.css', {root: __dirname + '/..'});
});

app.get('/ro_script.js', function(req, res) {
    res.type('application/javascript');
    res.sendFile('/ro_script.js', {root: __dirname});
});

app.get('/pa_data', function(req, res) {
    res.type('text/plain');
    res.sendFile('/data/quartz_res.json', {root: __dirname + '/..'});
    //res.sendFile('/data/quartz_res_nulls.json', {root: __dirname + '/..'});
});

app.listen(port, function() {
    console.log("My Node.js server is listening for requests for the PA READ-ONLY PAGE on port: " + port);
});


/* 
    for writing JSON file for the 'PA dashboard'

*/
setInterval(function() {
    console.log(`running: getPAsCurl() from Steven's app.js`)
    getPAsCurl();
}, 3000) // 3 seconds


/* 
    using Node 'exec' to run cURL on linux
*/
let getPAsCurl = function() {

    exec(` curl -X GET --header 'Accept: application/json' --header 'Authorization: Basic Y25uaWNlbnRyYWw6Y25uaXRhcGU='  'http://quartz-prod2.turner.com/a/destinations' -o "/var/www/html/node/udemy/dev_folder/edwards/pa_dashboard/prod_read_only_pa_page/data/quartz_res.json" `
        , function(err, stdout, stderror) {
            if(err) {
                console.log(err);
            }

            console.log(stdout);
        });
}
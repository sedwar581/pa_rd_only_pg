/* 
  - Processing Amplifier (PA) Read-Only Page
  - For use in control rooms of the CNN networks;
    this file contains the script used to affect 
    change on the read only PA page. 
  - Author: Steven Edwards
  - Page Started: September 2018
*/

var add_space_regEx = /\B(?=\d)/;
var data_polling_interval = 5000;
    
function activatePAPanel(panel_id) {    
    /* This function changes the opacity of the corresponding PA panel on the page
       by removing the class of the td element for the PA
       INPUT: panel_id (string)
    */
    document.getElementById(panel_id).classList.remove("noSRC");
}


function animateNewSrc(panel_id, ending_opct) {
    console.log(document.getElementById(panel_id));
    var starting_pos = ending_opct;
    var panel = document.getElementById(panel_id);
    console.log(panel.style);
    var faded_down = false;
    var int_ID = setInterval(function() {
        if ( starting_pos < 0 ) {
            starting_pos = 0;
            faded_down = true;
        } else if ( faded_down === true && starting_pos >= 0 && starting_pos < ending_opct ) {
            starting_pos += 0.1;
            panel.style.opacity = starting_pos;
        } else if ( faded_down === true && starting_pos > ending_opct ) {
            clearInterval(int_ID);
        } else if ( faded_down === false ) {
            starting_pos -= 0.1;
            panel.style.opacity = starting_pos;
        }
    }, 80);
}


function deactivatePAPanel(panel_id) {    
    /* This function changes the opacity of the corresponding PA panel on the page
       by changing the class of the td element for the PA
       INPUT: panel_id (string)
    */
    document.getElementById(panel_id).setAttribute('class', "noSRC");
}


function normalizeClientString (inc_str) {
    /* Takes the incoming client string and converts it to a 'normalized' version e.g. 'h control' would 
       get changed to 'H-CTRL'
       INPUT: inc_str
       OUTPUT: new_str
    */
    if ( typeof inc_str === 'string' ) {  // makes string lowercase and removes hyphens and spaces
        var min_client = inc_str.toLowerCase().replace(/[-,\s]/g, '');
    } else { // turn clients with null values into empty strings
        var min_client = "";
    }
    if ( !min_client.startsWith('acc') && ( min_client == 'a' || min_client.startsWith('ac') || min_client.startsWith('1a') ) ) {
        new_str = 'A-CTRL';
    } else if ( min_client == 'b' || min_client.startsWith('bc') || min_client.startsWith('1b') ) {
        new_str = 'B-CTRL';
    } else if ( min_client == 'c' || min_client.startsWith('cc') || min_client.startsWith('ct') ) {
        new_str = 'C-CTRL';
    } else if ( min_client == 'd' || min_client.startsWith('dc') || min_client.startsWith('dt') ) {
        new_str = 'D-CTRL';
    } else if ( min_client.startsWith('f') ) {
        new_str = 'F-CTRL';
    } else if ( min_client.startsWith('g') ) {
        new_str = 'G-CTRL';
    } else if ( min_client.startsWith('mex') || min_client.startsWith('hc') || min_client.startsWith('hx') || min_client.startsWith('hd') || min_client.startsWith('h') || min_client.includes('cnne') || min_client.includes('esp') ) {
        new_str = 'H-CTRL';
    } else if ( min_client.startsWith('ic') || min_client.startsWith('id') ) {
        new_str = 'I-CTRL';
    } else if ( min_client.includes('.com') || min_client.includes('dotcom') || min_client.includes('digitalvideo') ) {
        new_str = 'CNN.com';
    } else if ( min_client.startsWith('sats') || min_client.includes('sat') ) {
        new_str = 'SATS';
    } else if ( min_client.startsWith('atm') ) {
        new_str = 'ATL TPM BRIDGE';
    } else if ( min_client.startsWith('9tm') ) {
        new_str = 'DC TPM BRIDGE';
    } else if ( min_client.startsWith('tm') ) {
        new_str = 'NY TPM BRIDGE';
    } else if ( min_client.includes('london') || min_client.startsWith('4') ) {
        new_str = 'LDN';
    } else if ( min_client.includes('angeles') || min_client.startsWith('la') ) {
        new_str = 'LA';
    } else if ( min_client.includes('domesticnewsroom') || min_client.includes('domnewsroom') || min_client.includes('nesro') ) {
        new_str = 'DOM. NEWSRM';
    } else if ( min_client.includes('intlnewsroom') || min_client.includes('cnninewsroom') ) {
        new_str = 'INTL. NEWSRM';
    } else if ( min_client.includes('test') || min_client.includes('bts') || min_client.includes('eng') || min_client.includes('engineering') ) {
        new_str = 'BTS ENG.';
    } else if ( min_client.includes('hk') || min_client.includes('hongkong') || min_client.startsWith('8') ) {
        new_str = 'HK';
    } else if ( min_client.includes('9a') || min_client.includes('dca') ) {
        new_str = 'DC A-CTRL';
    } else if ( min_client.includes('9b') || min_client.includes('dcb') ) {
        new_str = 'DC B-CTRL';
    } else if ( min_client.includes('41') || min_client.includes('ny41') ) {
        new_str = 'NY CTRL-41';
    } else if ( min_client.includes('51') || min_client.includes('ny51') ) {
        new_str = 'NY CTRL-51';
    } else if ( min_client.includes('71') || min_client.includes('ny71') ) {
        new_str = 'NY CTRL-71';
    } else if ( min_client.includes('72') || min_client.includes('ny72') ) {
        new_str = 'NY CTRL-72';
    } else if ( min_client.includes('epic') ) {
        new_str = 'EPIC';
    } else if ( min_client.includes('newsource') ) {
        new_str = 'NS';
    } else if ( min_client.startsWith('acc') || min_client.includes('affiliate') || min_client.includes('aff') || min_client.includes('fili') || min_client.includes('ffilat')) {
        new_str = 'AFF. DESK';
    } else {
        new_str = 'OTHER';
    }
    return new_str;                       
}


function getExternalData() {
    setInterval(function() {
        var url = "http://opsvm3.turner.com:3000/api/pas";
        var new_req = new XMLHttpRequest();
        
        new_req.addEventListener("load", function() {
            var pa_response  = JSON.parse(this.response);
            updatePage(pa_response);
        });
        //new_req.open('GET', url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
        new_req.open('GET', url);
        new_req.send();
        console.log("***** NEW DATA REQUEST *****"); 
    }, data_polling_interval);
}


function updatePage(pa_arr) {
    pa_arr.forEach(function(elem) {
        var src_span = document.querySelector("td[id = pa" + elem.panumber + "] span[class = 'src']");
        var client_span = document.querySelector("td[id = pa" + elem.panumber + "] span[id = 'client']");
        var old_src = src_span.innerText;
        var new_src = ( elem.source == null ) ? elem.source : elem.source.replace(/[-,\s]/g, '').toUpperCase().replace(add_space_regEx, " ");        

        if ( elem.source == null && old_src !== "---" ) {
            animateNewSrc("pa" + elem.panumber, 0.3);
            setTimeout(function () {
                src_span.innerHTML = "---";
                client_span.innerHTML = "---";
                deactivatePAPanel("pa" + elem.panumber);
            }, 300);
            
        } else if ( elem.source != null && ( new_src != old_src ) ) {
            animateNewSrc("pa" + elem.panumber, 1);
            setTimeout(function () {
                src_span.innerHTML = elem.source.replace(/[-,\s]/g, '').toUpperCase().replace(add_space_regEx, " ");
                client_span.innerHTML = normalizeClientString (elem.client);
                activatePAPanel("pa" + elem.panumber);
            }, 1100);
        }
    });
}
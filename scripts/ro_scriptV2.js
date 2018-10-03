/* 
  - Processing Amplifier (PA) Read-Only Page
  - For use in control rooms of the CNN networks;
    this file contains the script used to affect 
    change on the read only PA page. 
  - Author: Steven Edwards
  - Page Started: September 2018
*/

var add_space_regEx = /\B(?=\d)/;
var data_polling_interval = 65000;
var reload_page_delay = 864000000; // reload the webpage every 10 days.
var PA_list = ["PA 1", "PA 2", "PA 3", "PA 4", "PA 8", "PA 9", "PA 13", "PA 14", "PA 15", "PA 16", "PA 17", "PA 18", "PA 42", "PA 43", "PA 44", "PA 45", "PA 46"];
    
function activatePAPanel(panel_id) {    
    /* This function changes the opacity of the corresponding PA panel on the page
       by removing the class of the td element for the PA
       INPUT: panel_id (string)
    */
    document.getElementById(panel_id).classList.remove("noSRC");
}


function animateNewSrc(panel_id, ending_opact) {
    /* This function is used to animate the changing of a table panel's
       source from one value to another.
       INPUT: panel_id (string)
              ending_opact (real number between 0 and 1)
    */
    var starting_pos = ending_opact;
    var panel = document.getElementById(panel_id);
    var faded_down = false;
    var int_ID = setInterval(function() {
        if ( starting_pos < 0 ) {
            starting_pos = 0;
            faded_down = true;
        } else if ( faded_down === true && starting_pos >= 0 && starting_pos < ending_opact ) {
            starting_pos += 0.1;
            panel.style.opacity = starting_pos;
        } else if ( faded_down === true && starting_pos > ending_opact ) {
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


function drawTableElements() {
    /* This function places the table rows and cells
       and cell content elements of the table used to 
       display the PA information
    */
    // Initialize variables
    var num_cells_per_row = 5;
    var num_tab_rows = Math.ceil((PA_list.length / num_cells_per_row));
    var table = document.getElementById("pa_table"); 

    for (var row_ct = 0; row_ct < num_tab_rows; row_ct++) {
        var PA_sub_arr = null;
        // this if block was added to draw a table of 3 rows of 4 cells and one row of 5 cells; PAs 42 - 46.
        if ( row_ct < (num_tab_rows - 1) ) {
            num_cells_per_row = 4;
            PA_sub_arr = PA_list.slice((row_ct * num_cells_per_row), ((row_ct * num_cells_per_row) + num_cells_per_row));
        } else if ( row_ct == (num_tab_rows - 1) ){
            num_cells_per_row = 5;
            PA_sub_arr = PA_list.slice(((row_ct * num_cells_per_row) - 3), (((row_ct * num_cells_per_row) + num_cells_per_row) - 3));
        }
        var new_row = document.createElement('tr');
        table.appendChild(new_row);
        PA_sub_arr.forEach(function(elem, pa_ind) {
            // Initialize table element variables
            var new_cell = document.createElement('td');
            var new_src_p = document.createElement('p');
            var new_output_p = document.createElement('p');
            var new_src_span = document.createElement('span');
            var new_hdout_span = document.createElement('span');
            var new_sdout_span = document.createElement('span');
            var new_client_span = document.createElement('span');
            var sdout_str = ( elem.slice(3).length == 1 ) ? ("PA 100" + elem.slice(3)) : ("PA 10" + elem.slice(3));

            new_cell.setAttribute('id', elem);
            new_cell.setAttribute('class', "noSRC");
            new_src_p.setAttribute('class', "paIO");
            new_src_span.setAttribute('class', "src");
            new_output_p.setAttribute('class', "paIO");
            new_hdout_span.setAttribute('class', "hdsd");
            new_sdout_span.setAttribute('class', "hdsd");
            new_client_span.setAttribute('id', "client");
            new_client_span.setAttribute('class', "hdsd");
            new_src_p.appendChild(document.createTextNode("SRC:"))
            new_src_p.appendChild(new_src_span);
            new_cell.appendChild(new_src_p);
            new_output_p.appendChild(document.createTextNode("HD OUT:"));
            new_hdout_span.appendChild(document.createTextNode(elem));
            new_output_p.appendChild(new_hdout_span);
            new_output_p.appendChild(document.createElement('br'));
            new_output_p.appendChild(document.createTextNode("SD OUT:"));
            new_sdout_span.appendChild(document.createTextNode(sdout_str));
            new_output_p.appendChild(new_sdout_span);
            new_output_p.appendChild(document.createElement('br'));
            new_output_p.appendChild(document.createTextNode("CLIENT:"));
            new_output_p.appendChild(new_client_span);
            new_cell.appendChild(new_output_p);
            new_row.appendChild(new_cell);
        });
    }
    console.log("CALLING getNewData()");
    getNewData();
    console.log("CALLING refreshData()");
    refreshData();
    console.log("CALLING reloadPage()");
    reloadPage();
}


function getNewData() {
    /* This function is used to acquire the PA data from the Quartz 
       microservice that is stored in a local file that is served at /pa_data 
    */
    var file_contents_arr = null;
    var qfile_xhr_obj = new XMLHttpRequest();
        
    qfile_xhr_obj.onreadystatechange = function() {
        if ( qfile_xhr_obj.status == 200 && qfile_xhr_obj.readyState == 4 ) {
            file_contents_arr = JSON.parse(qfile_xhr_obj.responseText);
            // request new data from the QC PA page in order to acquire the client string
            var pa_pg_url = "http://opsvm3.turner.com:3000/api/pas";
            var new_pa_pg_req = new XMLHttpRequest();
            
            new_pa_pg_req.addEventListener("load", function() {
                var pa_pg_response  = JSON.parse(this.response);
                var trimmed_PA_obj_list = [];
                /* attempt to inject the client property into the 
                   appropriate PA object in file_contents_arr */
                PA_list.forEach(function(pa_str) {
                    var papg_match = pa_pg_response.find(function(papg_elem) {
                        return ( pa_str.slice(3) == papg_elem.panumber );
                    });
                    var qfile_match = file_contents_arr.find(function(qfile_elem) {
                        return ( pa_str == qfile_elem.globalName );
                    });
                    if (papg_match != undefined) {
                        trimmed_PA_obj_list.push({globalName:pa_str, source:qfile_match.source.globalName, client:( papg_match.client == null ) ? "---" : papg_match.client});
                    } else {
                        trimmed_PA_obj_list.push({globalName:pa_str, source:qfile_match.source.globalName, client:"---"});
                    }
                });
                //console.log(pa_pg_response);
                //console.log(file_contents_arr);
                //console.log(trimmed_PA_obj_list);
                updatePage(trimmed_PA_obj_list);
            });
            new_pa_pg_req.open('GET', pa_pg_url);
            new_pa_pg_req.send();
        } else if ( qfile_xhr_obj.status == 404 && qfile_xhr_obj.readyState == 4 ) { // the file does not exist
            updatePage(null);
        }
    };
    qfile_xhr_obj.open('GET', "/pa_data");
    qfile_xhr_obj.send();
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
    } else if ( min_client.startsWith('u') ) {
            new_str = 'ABU DHABI';
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
    } else if ( min_client == "" ) {
        new_str = '---';
    } else {
        new_str = 'OTHER';
    }
    return new_str;                       
}


function refreshData() {
    /* This function is used to periodically acquire client data 
       from the BCC/QC PA page and the quartz microservice. 
    */
    setInterval(function() {
        getNewData();
    }, data_polling_interval);
}


function reloadPage() {
    setInterval(function() {
        window.location.reload(true);
    }, reload_page_delay);
}


function updatePage(dest_arr) {
    /* This function reads through the incoming array; tests the destination
       names i.e. globalName against the list of PAs (PA_list) in order to display
       the correct name.  The PA names will be the globalName property of the
       and the source will be the source.globalName property combination
       of the array's elements

       INPUT: dest_arr (array of objects)
    */
    
    //console.log("FILE CONTENTS AS AN ARRAY: " + dest_arr);
    if ( dest_arr == null ) {
        console.log("The file was not found");
    } else {
        dest_arr.forEach(function(curr_elem) {
            var pa = curr_elem.globalName;
            
            if ( PA_list.includes(pa) ) {
                var new_src = curr_elem.source; // new source wrt to the data in the file vs. already on the page.
                var new_client = normalizeClientString(curr_elem.client);                
                var src_span = document.querySelector("td[id = '" + pa + "'] span[class = 'src']");
                var client_span = document.querySelector("td[id = '" + pa + "'] span[id = 'client']");
                var old_src = src_span.innerText;
                //var valid_img = document.createElement('img');
                //console.log(pa + " -- NEW SRC: " + new_src);
                //console.log("         OLD_SRC: " + old_src);
                
                if ( new_src.slice(0, 2) == "TS" && ( new_src != old_src ) ) {
                    animateNewSrc(pa, 0.3);
                    setTimeout(function () {
                        src_span.innerHTML = new_src;
                        client_span.innerHTML = "---";
                        //valid_img.setAttribute('src', "/graphics/VALID_TS");
                        //valid_img.setAttribute('class', "valid_loop")
                        //src_span.parentElement.appendChild(valid_img);
                        deactivatePAPanel(pa);
                    }, 300);
                } else if ( new_src != old_src ) {
                    animateNewSrc(pa, 1);
                    setTimeout(function () {
                        src_span.innerHTML = new_src;
                        client_span.innerHTML = new_client;
                        activatePAPanel(pa);
                    }, 1000);
                }
            }
        });
    }
}
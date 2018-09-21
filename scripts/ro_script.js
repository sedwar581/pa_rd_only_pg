/* scripts used to affect change on the read only PA page. */

var add_space_regEx = /\B(?=\d)/;
var test_arr = [
    {"_id":"581fd6e9d566f306883f1acb","panumber":13,"__v":0,"source":"PC 822","client":"los angeles","note":"1pm","initial":"MC","createdAt":"2018-09-20T16:18:57.598Z"},
    {"_id":"58038380121bd41e404f16c9","panumber":2,"__v":0,"initial":null,"note":null,"client":null,"source":null,"createdAt":"2018-09-15T01:01:25.466Z"},
    {"_id":"581e770e607a332d46c55973","panumber":18,"__v":0,"source":"RX 509","client":"H","note":"? added this to the sheet but no sure when it was put in a PA","initial":"MC","createdAt":"2018-09-20T16:21:39.642Z"},
    {"_id":"5803be3d743ac42922af2fdb","panumber":4,"__v":0,"initial":"MC","note":"1pm","client":"affiliates","source":"RX 653","createdAt":"2018-09-20T16:22:24.546Z"},
    {"_id":"5803be41743ac42922af2fdc","panumber":8,"__v":0,"initial":"FT","note":"until 1pm","client":"H control","source":"VP534","createdAt":"2018-09-20T15:45:32.922Z"},
    {"_id":"5803be46743ac42922af2fdd","panumber":9,"__v":0,"initial":null,"note":null,"client":null,"source":null,"createdAt":"2018-09-19T18:06:14.966Z"},
    {"_id":"5807deaf2dbb8235ef53ec4b","panumber":14,"source":"CM 27","initial":"MC","__v":0,"note":"1pm","client":".com","createdAt":"2018-09-20T16:23:25.904Z"},
    {"_id":"5803be4c743ac42922af2fde","panumber":1,"__v":0,"initial":null,"note":null,"client":null,"source":null,"createdAt":"2018-09-20T10:52:24.802Z"},
    {"_id":"5803be56743ac42922af2fdf","panumber":17,"__v":0,"initial":null,"note":null,"client":null,"source":null,"createdAt":"2018-09-20T01:10:56.359Z"},
    {"_id":"5803837c121bd41e404f16c8","panumber":16,"__v":0,"initial":null,"note":null,"client":null,"source":null,"createdAt":"2018-09-20T01:11:11.238Z"},
    {"_id":"581e7675607a332d46c55972","panumber":15,"__v":0,"source":"VP 535","client":"satellites","note":"1pm","initial":"MC","createdAt":"2018-09-20T16:20:42.770Z"},
    {"_id":"58125f6f7fd6f76522b6aa60","panumber":3,"__v":0,"source":null,"client":null,"note":null,"initial":null,"createdAt":"2018-09-16T09:37:11.993Z"}];

    
function activatePAPanel(panel_id) {    
    /* This function changes the opacity of the corresponding PA panel on the page
       by removing the class of the td element for the PA
       INPUT: panel_id (string)
    */
    document.getElementById(panel_id).classList.remove("noSRC");
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
    if ( !min_client.startsWith('acc') && ( min_client.startsWith('ac') || min_client.startsWith('1a') ) ) {
        new_str = 'A-CTRL';
    } else if ( min_client.startsWith('bc') || min_client.startsWith('1b') ) {
        new_str = 'B-CTRL';
    } else if ( min_client.startsWith('cc') || min_client.startsWith('ct') ) {
        new_str = 'C-CTRL';
    } else if ( min_client.startsWith('dc') || min_client.startsWith('dt') ) {
        new_str = 'D-CTRL';
    } else if ( min_client.startsWith('f') ) {
        new_str = 'F-CTRL';
    } else if ( min_client.startsWith('g') ) {
        new_str = 'G-CTRL';
    } else if ( min_client.startsWith('hc') || min_client.startsWith('hx') || min_client.startsWith('hd') || min_client.startsWith('h') || min_client.includes('cnne') || min_client.includes('esp') ) {
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


function deactivatePAPanel(panel_id) {    
    /* This function changes the opacity of the corresponding PA panel on the page
       by changing the class of the td element for the PA
       INPUT: panel_id (string)
    */
    document.getElementById(panel_id).setAttribute('class', "noSRC");
}


function reloadPage (wait_time) {
    /* Automatically refresh the page */
    setTimeout("location.reload(true);", wait_time);
}


function getExternalData(url) {
    var new_req = new XMLHttpRequest();

    new_req.addEventListener("load", function() {
        //console.log(this.response);
    });
    new_req.open('GET', url);
    new_req.send();
}

function updatePage() {
    test_arr.forEach(function(elem, ind) {
        var src_span = document.querySelector("td[id = pa" + elem.panumber + "] span[class = 'src']");
        var client_span = document.querySelector("td[id = pa" + elem.panumber + "] span[id = 'client']");

        if ( elem.source == null ) {
            src_span.innerHTML = "---";
            client_span.innerHTML = "---";
            deactivatePAPanel("pa" + elem.panumber);
        } else {
            src_span.innerHTML = elem.source.replace(/[-,\s]/g, '').toUpperCase().replace(add_space_regEx, " ");
            client_span.innerHTML = normalizeClientString (elem.client);
            activatePAPanel("pa" + elem.panumber);
        }
        console.log(src_span);
    });
}
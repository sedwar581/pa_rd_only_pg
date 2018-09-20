/* scripts used to affect change on the read only PA page. */

function activatePAPanel(panel_id) {    
    /* This function changes the opacity of the corresponding PA panel on the page
       INPUT: panel_id - string
    */
    document.getElementById(panel_id).removeAttribute("noSRC");
}


function deactivatePAPanel(panel_id) {    
    /* This function changes the opacity of the corresponding PA panel on the page
       INPUT: panel_id - string
    */
    document.getElementById(panel_id).setAttribute('class', "noSRC");
}
'use strict';

$(document).ready(function(){
    /** Enable tooltips **/
    $('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
    /** Create audio player **/
    Player(songs);
});

'use strict';

$(document).ready(function(){
    /** Enable tooltips **/
    $('[data-toggle="tooltip"]').tooltip();
    /** Create audio player **/
    Player(songs);
});

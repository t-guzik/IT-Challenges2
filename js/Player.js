'use strict';

var Player = function (songs) {
    /** Player state **/
    var playlist = [];
    var playlistButtons = [];
    var currentSongIndex = 0;
    var defaultVolume = 0.5;
    var currentVolume = defaultVolume;
    var currentSongPositionInSeconds = -1;
    var currentSongPosition = {
        minutes : 0,
        seconds : -1
    };
    var songTimeInterval = null;

    /** Constants **/
    var VOLUME_CHANGE = 0.05;

    /** Howls (Howler.js lib)   and playlist buttons creating **/
    for( var i = 0; i < songs.length; i++ ){
        playlist.push(new Howl({
            src : songs[i].src,
            volume : defaultVolume
        }));

        var songButton = document.createElement('div');
        var songButtonTitle = document.createElement('h4');
        songButtonTitle.innerHTML = songs[i].title;
        songButton.appendChild(songButtonTitle);

        var songButtonAuthor = document.createElement('h6');
        songButtonAuthor.innerHTML = songs[i].author;
        songButton.appendChild(songButtonAuthor);

        playlistButtons.push(songButton);
    }

    for(var j = 0; j < playlistButtons.length; j++) {
        $('#playlist-content').append(playlistButtons[j]);
    }

    var togglePlay = function () {
        if(playlist[currentSongIndex].playing()){
            playlist[currentSongIndex].pause();
            clearInterval(songTimeInterval);
        } else {
            playlist[currentSongIndex].play();
            playlistButtons[currentSongIndex].style.color = 'gold';
            songTimeInterval = setInterval(setCurrentSongTime, 1000);
            console.log('Playing: ' + songs[currentSongIndex].title);
        }
    };

    var nextSong = function () {
        /** Stop current song **/
        playlist[currentSongIndex].stop();
        playlistButtons[currentSongIndex].style.color = 'white';

        /** Take next song **/
        currentSongIndex = ( (currentSongIndex + 1) % playlist.length);

        clearCurrentSongTime();
        clearBorders();

        /** Play next song **/
        togglePlay();
    };

    var previousSong = function () {
        /** Stop current song **/
        playlist[currentSongIndex].stop();
        playlistButtons[currentSongIndex].style.color = 'white';

        /** Take previous song **/
        if(currentSongIndex === 0){
            currentSongIndex = playlist.length - 1;
        } else {
            currentSongIndex--;
        }

        clearCurrentSongTime();
        clearBorders();

        /** Play next song **/
        togglePlay();
    };

    /** Add click events **/
    $('#toggle-play-btn').click(togglePlay);
    $('#next-btn').click(nextSong);
    $('#prev-btn').click(previousSong);
    $('#playlist-btn').click(showPlaylist);
    $('#close-btn').click(hidePlaylist);

    $( window ).resize(function() {
        if(window.innerWidth > window.innerHeight){
            $('#player-circle-container')
                .css('margin-top', window.innerHeight/4)
                .css('margin-bottom', window.innerHeight/4)
                .css('width', window.innerHeight/2)
                .css('height', window.innerHeight/2);
            $('#circle-canvas').css('width', window.innerHeight/2).css('height', window.innerHeight/2);
            $('#playlist-container').css('margin-top', window.innerHeight/4);
            $('#song-info-container').css('width', (parseInt(window.innerHeight/2)-120) + 'px').css('height', (parseInt(window.innerHeight/2)-120) + 'px');
        } else {
            $('#player-circle-container')
                .css('margin-top', window.innerWidth/4)
                .css('margin-bottom', window.innerWidth/4)
                .css('width', window.innerWidth/2)
                .css('height', window.innerWidth/2);
            $('#circle-canvas').css('width', window.innerWidth/2).css('height', window.innerWidth/2);
            $('#playlist-container').css('margin-top', window.innerWidth/4);
            $('#song-info-container').css('width', (parseInt(window.innerWidth/2)-120) + 'px').css('height', (parseInt(window.innerWidth/2)-120) + 'px');
        }
    });

    $( window ).bind('mousewheel', function(event) {
        if (event.originalEvent.wheelDelta >= 0) {
            if(currentVolume < 1){
                currentVolume += VOLUME_CHANGE;
                playlist[currentSongIndex].volume(currentVolume);
            }
        }
        else {
            if(currentVolume > 0) {
                currentVolume -= VOLUME_CHANGE;
                playlist[currentSongIndex].volume(currentVolume);
            }
        }
        console.log('Current volume: ' + currentVolume*100 + '%');
    });

    /** ****************************/
    /*********** Display ***********/
    /** ****************************/

    function setCurrentSongTime() {
        currentSongPosition.seconds++;
        currentSongPositionInSeconds = currentSongPosition.minutes * 60 + currentSongPosition.seconds;

        /** Change border style during song **/
        if(currentSongPositionInSeconds > playlist[currentSongIndex].duration()/4){
            $('#player-circle-container').css('border-right', 'solid white 5px ');
        }

        if(currentSongPositionInSeconds > 2*playlist[currentSongIndex].duration()/4){
            $('#player-circle-container').css('border-bottom', 'solid white 5px ');
        }

        if(currentSongPositionInSeconds > 3*playlist[currentSongIndex].duration()/4){
            $('#player-circle-container').css('border-left', 'solid white 5px ');
        }

        if(currentSongPositionInSeconds >= playlist[currentSongIndex].duration()){
            clearBorders();
            currentSongPositionInSeconds = -1;
            currentSongPosition = {
                minutes : 0,
                seconds : 0
            };
            clearInterval(songTimeInterval);
        }

        if(currentSongPosition.seconds === 60){
            currentSongPosition.minutes++;
            currentSongPosition.seconds = 0;
        }

        if(currentSongPosition.minutes <= 9 ){
            $('#song-time-minutes').html('0' + currentSongPosition.minutes);
        } else {
            $('#song-time-minutes').html(currentSongPosition.minutes);
        }

        if(currentSongPosition.seconds <= 9 ){
            $('#song-time-seconds').html('0' + currentSongPosition.seconds);
        } else {
            $('#song-time-seconds').html(currentSongPosition.seconds);
        }
    }

    function clearBorders() {
        $('#player-circle-container').css('border-right', 'solid white 1px');
        $('#player-circle-container').css('border-bottom', 'solid white 1px');
        $('#player-circle-container').css('border-left', 'solid white 1px');
    }

    function clearCurrentSongTime() {
        clearInterval(songTimeInterval);
        currentSongPositionInSeconds = -1;
        currentSongPosition = {
            minutes : 0,
            seconds : -1
        };
        setFullSongInfoOnDisplay();
        setPlayerBackground();
    }

    function setFullSongInfoOnDisplay() {
        setCurrentSongTime();
        $('#song-title').html(songs[currentSongIndex].title);
        $('#song-author').html(songs[currentSongIndex].author);
    }

    function setPlayerBackground() {
        $('body').css('background-image', 'url(' + songs[currentSongIndex].background + ')');
    }

    function showPlaylist() {
        $('#playlist-container').css('display', 'flex');
        $('#player-circle-container').css('display', 'none');
    }

    function hidePlaylist() {
        $('#playlist-container').css('display', 'none');
        $('#player-circle-container').css('display', 'flex');
    }

    /** DISPLAY INIT **/
    setPlayerBackground();
    setFullSongInfoOnDisplay();
    if(window.innerWidth > window.innerHeight){
        $('#player-circle-container')
            .css('margin-top', window.innerHeight/4)
            .css('margin-bottom', window.innerHeight/4)
            .css('width', window.innerHeight/2)
            .css('height', window.innerHeight/2);
        $('#circle-canvas').css('width', window.innerHeight/2).css('height', window.innerHeight/2);
        $('#playlist-container').css('margin-top', window.innerHeight/4);
        $('#song-info-container').css('width', (parseInt(window.innerHeight/2)-120) + 'px').css('height', (parseInt(window.innerHeight/2)-120) + 'px');
    } else {
        $('#player-circle-container')
            .css('margin-top', window.innerWidth/4)
            .css('margin-bottom', window.innerWidth/4)
            .css('width', window.innerWidth/2)
            .css('height', window.innerWidth/2);
        $('#circle-canvas').css('width', window.innerWidth/2).css('height', window.innerWidth/2);
        $('#playlist-container').css('margin-top', window.innerWidth/4);
        $('#song-info-container').css('width', (parseInt(window.innerWidth/2)-120) + 'px').css('height', (parseInt(window.innerWidth/2)-120) + 'px');
    }
};

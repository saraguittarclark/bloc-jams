
// FUNCTIONS

var createSongRow = function(songNumber, songName, songLength) {
	var template = 
	'<tr class="album-view-song-item">'
+'<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
+'<td class="song-item-title">' + songName + '</td>'
+'<td class="song-item-duration">' + songLength + '</td>'
+'</tr>'
	;
	return $(template);
	var $row = $(template);

};	

var setCurrentAlbum = function(album) {
	currentAlbum = album;
	var $albumTitle = $('.album-view-title');
	var $albumArtist =$('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list');

	$albumTitle.text(album.name);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);

	$albumSongList.empty();

	for (var i = 0; i < album.songs.length; i++) {
		var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].timeMS);
		$albumSongList.append($newRow);
	}
};

var updateSeekBarWhileSongPlays = function() {
	if (currentSoundFile) {
		currentSoundFile.bind('timeupdate', function(event){
			var seekBarFillRatio = this.getTime() / this.getDuration();
			var $seekBar = $('.seek-control .seek-bar');
			updateSeekPercentage($seekBar, seekBarFillRatio);
			setCurrentTimeInPlayerBar();
			setTotalTimeInPlayerBar();
		});
	}
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
	var offsetXPercent = seekBarFillRatio * 100;
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);
	var percentageString = offsetXPercent + '%';
	$seekBar.find('.fill').width(percentageString);
	$seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
	var $seekBars = $('.seek-bar');

	$seekBars.click(function(event){
		var offsetX = event.pageX - $(this).offset().left;
		var barWidth = $(this).width;
		var seekBarFillRatio = offsetX / barWidth;
		if ($(this).parent().attr('class') == 'seek-control') {
			seek(seekBarFillRatio * currentSoundFile.getDuration());
		} else {
			setVolume(seekBarFillRatio * 100);
		}

		updateSeekPercentage($(this), seekBarFillRatio);
	});

	$seekBars.find('.thumb').mousedown(function(event){
		var $seekBar = $(this).parent();
		$(document).bind('mousemove.thumb', function(event){
			var offsetX = event.pageX - $seekBar.offset().left;
			var barWidth = $seekBar.width();
			var seekBarFillRatio = offsetX / barWidth;
			if ($seekBar.parent().attr('class') == 'seek-control') {
				seek(seekBarFillRatio * currentSoundFile.getDuration());
			} else {
				setVolume(seekBarFillRatio * 100);
			}

			updateSeekPercentage($seekBar, seekBarFillRatio);
		});

		$(document).bind('mouseup.thumb', function(event){
			$(document).unbind('mousemove.thumb');
			$(document).unbind('mouseup.thumb');
		});
	});
};

var updatePlayerBarSong = function() {
	var currentSong = currentAlbum.songs[currentlyPlayingSongNumber - 1];
	if (currentSong !== undefined) {
		$('.artist-name').text(currentAlbum.artist);
		$('.song-name').text(currentSong.name);
		$('.artist-song-mobile').text(currentSong.name + " - " + currentAlbum.artist);
		$playPauseButton.html(playerBarPauseButton);
	}
	if (currentSoundFile.isPaused()) {
		$playPauseButton.html(playerBarPlayButton);
	}
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

var nextSong = function() {
	// if next song  is forward do x or y
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  	currentSongIndex++;
  	if (currentSongIndex >= currentAlbum.songs.length) {
  		currentSongIndex = 0;
  	} 
	//current song change button back to hover functionality/number 
	var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
	$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);

	//change button play to pause currentSongFromAlbum
	//find song number
	setSong(currentSongIndex + 1); //because index 0 based and songnumber 1 based 
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();

	var $nextSongIndexCell = getSongNumberCell(currentlyPlayingSongNumber);
	$nextSongIndexCell.html(pauseButtonTemplate);

	updatePlayerBarSong();
};

var previousSong = function() {
	//find index current song and previous
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex--;

	if (currentSongIndex < 0) {
		currentSongIndex = currentAlbum.songs.length - 1;
	} 

	//current song change button back to hover functionality/number 
	var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
	$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);

	//change button play to pause currentSongFromAlbum
	//find song number
	setSong(currentSongIndex + 1);
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();

	var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	$previousSongNumberCell.html(pauseButtonTemplate);

	updatePlayerBarSong();
};

var setSong = function(songNumber) {
	if (currentSoundFile) {
		currentSoundFile.stop();
	}
	currentlyPlayingSongNumber = songNumber;
	currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
		formats: ['mp3'],
		preload: true
	});
	setVolume(currentVolume);
};

var seek = function(time) {
	if (currentSoundFile) {
		currentSoundFile.setTime(time);
	}
};

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
};

var togglePlayFromPlayerBar = function() {	
	if (!currentSoundFile) {
		setSong(1);
		getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
		$(this).html(playerBarPauseButton);
		currentSoundFile.play()
		updateSeekBarWhileSongPlays();
		updatePlayerBarSong();
	} else if (currentSoundFile.isPaused()) {
		getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
		$(this).html(playerBarPauseButton);
		currentSoundFile.play();
		updateSeekBarWhileSongPlays();
	} else if (currentSoundFile) {
		getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
		$(this).html(playerBarPlayButton);
		currentSoundFile.pause();
	} 
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var filterTimeCode = function(timeInSeconds) {
	var seconds = parseInt(timeInSeconds);
	// seconds.toFixed(3);
	var minutes = Math.floor(seconds / 60);
	// var minutes = Math.floor(seconds) / 60;
	var filteredTime = minutes + ':' + seconds;
	return filteredTime;
};

var setCurrentTimeInPlayerBar = function(currentTime) {
	currentTime = currentSoundFile.getTime().toFixed(0);
	var minutes = 0;
	while (currentTime > 59) {
		minutes++;
		currentTime -=60;
	}
	if (currentTime < 10) {
		currentTime = '0' + currentTime;
	}
	$('.current-time').html(minutes + ":" + currentTime);
};

 var setTotalTimeInPlayerBar = function(totalTime) {
 	//could be simple lookup
 	totalTime = currentSongFromAlbum.timeMS;
	$('.total-time').html(totalTime);

	//if wanted to be dynamic something like: 
	// var totalTime = Math.floor(currentSoundFile.getDuration());
	// var minutes = (totalTime / 60).toFixed(0);
	// var seconds = minutes * 60;
	// var wholeSeconds = minutes % 60;
	// minutes = Math.floor(minutes);
	// if (seconds < 10) {
	// 	seconds = '0' + seconds;
	// }
	// $('.total-time').html(minutes + ":" + seconds)
};


//VARIABLES

var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumArray = [albumPicasso, albumMarconi, albumCalle13];
var albumIndex = 0; //index of currently displayed album

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>'

var currentAlbum = null;

//set to null before used or if current song is paused
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton = $('.main-controls .play-pause');


//DOCUMENT LOAD - EVENT DELEGATION AND HANDLERS

$(document).ready(function() {
	setCurrentAlbum(albumArray[albumIndex]);

	albumImage.addEventListener('click', function() { 
	albumIndex++;
	if (albumIndex >= albumArray.length) {
		albumIndex = 0;
	} 
	setCurrentAlbum(albumArray[albumIndex]);
	});

	setupSeekBars();

	var clickHandler = function(event) {
		var $songItemNumber = $(this).find('.song-item-number');
		var $songNumber = $songItemNumber.data('song-number');
		if (currentlyPlayingSongNumber !== null) {
			// Revert to song number for currently playing song because user started playing new song
			var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
			$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== $songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing
			setSong($songNumber);
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();

			var $volumeFill = $('.volume .fill');
			var $volumeThumb = $('.volume .thumb');
			$volumeFill.width(currentVolume + '%');
			$volumeThumb.css({left: currentVolume + '%'});


			$songItemNumber.html(pauseButtonTemplate);
			updatePlayerBarSong();
		} else {
			if (currentSoundFile.isPaused()) {
				$songItemNumber.html(pauseButtonTemplate);
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
				updatePlayerBarSong();
			} else {
				$songItemNumber.html(playButtonTemplate);
				currentSoundFile.pause();
				updatePlayerBarSong();
			}
		};
	};

	var onHover = function(event){
		var $songItemNumber = $(this).find('.song-item-number');
		var $songNumber = $songItemNumber.data('song-number');
		if ($songNumber !== currentlyPlayingSongNumber) {
			$songItemNumber.html(playButtonTemplate);
		}
	};

	var offHover = function(event){
		var $songItemNumber = $(this).find('.song-item-number');
		var $songNumber = $songItemNumber.data('song-number');
		if ($songNumber !== currentlyPlayingSongNumber) {
			$songItemNumber.html($songNumber);
		}
	};

	var songEnded = function() {
		if (currentSoundFile.isEnded()) {
			nextSong();
		}
	};

	var $songListContainer = $('.album-view-song-list');
	$songListContainer.on('click', ".album-view-song-item", clickHandler);
	$songListContainer.on("mouseenter", ".album-view-song-item", onHover);
	$songListContainer.on("mouseleave", ".album-view-song-item", offHover);
	
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playPauseButton.click(togglePlayFromPlayerBar);
});



//DOESN'T PLAY THROUGH WHOLE ALBUM! STOPS AFTER PLAYED SONG
//should play next song
//if song is ended, revert pause to number
//squish together previous/next if time
//sound.fadeIn([duration],[callback]) or fadeOut
//sound.mute or unmute - add click event listener to volume character/create button
//is an error on 179 - though works! volume : double value is non-finite
//playback seek bar begins in middle vs at beginning
	
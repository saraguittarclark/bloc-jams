
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
		var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
		$albumSongList.append($newRow);
	}
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

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
};

var togglePlayFromPlayerBar = function() {
	// if (currentSoundFile = null) {
	// 	setSong(1);
	// 	getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
	// 	$(this).html(playerBarPauseButton);
	// 	currentSoundFile.play();
	// };
	
	if (currentSoundFile.isPaused()) {
		getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
		$(this).html(playerBarPauseButton);
		currentSoundFile.play();
	}	else if (currentSoundFile) {
		getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
		$(this).html(playerBarPlayButton);
		currentSoundFile.pause();
	} 
	//behavior on load - play first song in album!
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
};

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

$(document).ready(function() {
	setCurrentAlbum(albumArray[albumIndex]);

	albumImage.addEventListener('click', function() { 
	albumIndex++;
	if (albumIndex >= albumArray.length) {
		albumIndex = 0;
	} 
	setCurrentAlbum(albumArray[albumIndex]);
	});


	var clickHandler = function(event) {
		var $songItemNumber = $(this).find('.song-item-number');
		// console.log($songItemNumber);
		var $songNumber = $songItemNumber.data('song-number');
		// console.log($songNumber);
		if (currentlyPlayingSongNumber !== null) {
			// Revert to song number for currently playing song because user started playing new song
			var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
			$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== $songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing
			setSong($songNumber);
			$songItemNumber.html(pauseButtonTemplate);
			currentSoundFile.play();
			updatePlayerBarSong();
		} else {
			if (currentSoundFile.isPaused()) {
				$songItemNumber.html(pauseButtonTemplate);
				currentSoundFile.play();
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

	var $songListContainer = $('.album-view-song-list');
	$songListContainer.on('click', ".album-view-song-item", clickHandler);
	$songListContainer.on("mouseenter", ".album-view-song-item", onHover);
	$songListContainer.on("mouseleave", ".album-view-song-item", offHover);
	
	$previousButton.click(previousSong);
	$nextButton.click(nextSong);
	$playPauseButton.click(togglePlayFromPlayerBar);
});



//squish together previous/next if time



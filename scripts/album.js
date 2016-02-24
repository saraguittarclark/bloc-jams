
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

	// $row.find('.song-item-number').click(clickHandler);
	// $row.hover(onHover, offHover);

	// return $row;
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
	//removed - 1 from currentlyPlayingSongNumber - doesn't change the console.log in the next/previous songs()
	//when currentSong is undefined w/o name
	if (currentSong !== undefined) {
		$('.artist-name').text(currentAlbum.artist);
		$('.song-name').text(currentSong.name);
		$('.artist-song-mobile').text(currentSong.name + " - " + currentAlbum.artist);
		$('.play-pause').html(playerBarPauseButton);
	} else {
		console.log("currentSong is undefined");
	}
};


var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
}

//next starts at beginning of album, not NEXT song, then on repeat starts at [1] vs. [0]
//if choose a song manually the next goes back to the next song it was supposed to be/not updating
//check the array position BEFORE rest of code?

var nextSong = function() {
	// if next song  is forward do x or y
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  	currentSongIndex++;
  	if (currentSongIndex >= currentAlbum.songs.length) {
  		currentSongIndex = 0;
  	} 
  
	//current song change button back to hover functionality/number 
	var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);

	//change button play to pause currentSongFromAlbum
	//find song number
	setSong(currentSongIndex + 1); //because index 0 based and songnumber 1 based 

	var $nextSongIndexCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	$nextSongIndexCell.html(pauseButtonTemplate);

	updatePlayerBarSong();
}

var previousSong = function() {
	//find index current song and previous
	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
	currentSongIndex--;

	if (currentSongIndex < 0) {
		currentSongIndex = currentAlbum.songs.length - 1;
	} 

	//current song change button back to hover functionality/number 
	var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);

	//change button play to pause currentSongFromAlbum
	//find song number
		setSong(currentSongIndex + 1);

	var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	$previousSongNumberCell.html(pauseButtonTemplate);

	updatePlayerBarSong();
}

//ASSIGNMENT EGADS THIS CHECKPOINT IS SO LONG I HATES IT
//PLAY BUTTON STILL DOESN'T WORK
//takes in just a song number?? what?
var setSong = function(songNumber) {
	currentlyPlayingSongNumber = songNumber;
	currentSongFromAlbum = currentAlbum.songs[currentlyPlayingSongNumber - 1];
}

var getSongNumberCell = function(number) {
	var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
}

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

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPause = $('.main-controls .play-pause');

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
		console.log($songItemNumber);
		var $songNumber = $songItemNumber.data('song-number');
		console.log($songNumber);
		if (currentlyPlayingSongNumber !== null) {
			// Revert to song number for currently playing song because user started playing new song
			var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
			$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== $songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing
			$songItemNumber.html(pauseButtonTemplate);
			setSong($songNumber);
			updatePlayerBarSong();
		} else {
			// Switch from Pause -> Play button to pause currently playing song
			$songItemNumber.html(playButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPlayButton);
			currentlyPlayingSongNumber = null;
			currentSongFromAlbum = null;
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
});



//clickHandler fails to fire on third sequential click of play button in song row
//songCell assignment thing
//squish together previous/next if time



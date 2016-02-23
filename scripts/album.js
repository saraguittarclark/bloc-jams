
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
	$('.artist-name').text(currentAlbum.artist);
	$('.song-name').text(currentSongFromAlbum.name);
	$('.artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
	$('.play-pause').html(playerBarPauseButton);
};

var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
}

var nextSong = function(){
	//find index current song
	// var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

	//current song change button back to hover functionality/number 
	var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
	//define nextsong index
	var nextSongIndex = trackIndex(currentAlbum, currentSongFromAlbum) + 1;
	//next song set with index
	var nextSong = currentAlbum.songs[nextSongIndex];
	if (nextSong === undefined) {
		currentSongFromAlbum = album.songs[0];
	}
	//new current song is next song
	currentSongFromAlbum = nextSong;
	//if next song is undefined/nonexistent, play first song
	//change button play to pause currentSongFromAlbum
	//find song number
	currentlyPlayingSongNumber = nextSongIndex + 1; //because index != song number

	var $nextSongIndexCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	$nextSongIndexCell.html(pauseButtonTemplate);

	updatePlayerBarSong();
}

var previousSong = function() {
	var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
	var previousSongIndex = trackIndex(currentAlbum, currentSongFromAlbum) - 1;
	var previousSong = currentAlbum.songs[previousSongIndex];
	if (previousSong === undefined) {
		previousSongIndex = album.songs.length - 1;
	}
	currentSongFromAlbum = previousSong;
	currentlyPlayingSongNumber = previousSongIndex + 1; //because index != song number
	
	var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	$previousSongNumberCell.html(pauseButtonTemplate);

	updatePlayerBarSong(); 
}

var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumArray = [albumPicasso, albumMarconi, albumCalle13];
var albumIndex = 1; //index of currently displayed album

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>'

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
	setCurrentAlbum(albumArray[albumIndex]);

	albumImage.addEventListener('click', function() { 
	albumIndex++;
	if (albumIndex >= albumArray.length) {
		albumIndex = 0;
	} 
	setCurrentAlbum(albumArray[albumIndex]);
	});

	$previousButton.click(previousSong);
	$nextButton.click(nextSong);

	var clickHandler = function(event) {
		var $songItemNumber = $(this).find('.song-item-number');
		var $songNumber = $songItemNumber.data('song-number');
		if (currentlyPlayingSongNumber !== null) {
			// Revert to song number for currently playing song because user started playing new song
			var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
			$currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== $songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing
			$songItemNumber.html(pauseButtonTemplate);
			currentlyPlayingSongNumber = $songNumber;
			updatePlayerBarSong();
		} else if (currentlyPlayingSongNumber === $songNumber) {
			// Switch from Pause -> Play button to pause currently playing song
			$songItemNumber.html(playButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPlayButton);
			currentlyPlayingSongNumber = null;
			currentSongFromAlbum = null;
		};

		//adding update player to clickhandler

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
	$songListContainer.on("mouseenter", ".album-view-song-item", onHover);
	$songListContainer.on("mouseleave", ".album-view-song-item", offHover);
	$songListContainer.on('click', ".album-view-song-item", clickHandler);
});







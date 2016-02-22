//Example Album 1

var albumPicasso = {
	name: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
		{name: 'Blue', length: '4:26'},
		{name: 'Green', length: '3:14'},
		{name: 'Red', length: '5:01'},
		{name: 'Pink', length: '3:21'},
		{name: 'Magenta', length: '2:15'}
	]
};

//Example Album 2
var albumMarconi = {
	name: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
		{name: 'Hello, Operator', length: '1:01'},
		{name: 'Ring, ring, ring', length: '5:01'},
		{name: 'Fits in your pocket', length: '3:21'},
		{name: 'Can you hear me now?', length: '3:14'},
		{name: 'New phone, who dis?', length: '2:15'}
	]
};

//Example Album 3
var albumCalle13 = {
	name: 'Entren Los Que Quieran',
	artist: 'Calle 13',
	label: 'Alt Hip-Hop',
	year: '2010',
	albumArtUrl: 'assets/images/album_covers/15.png',
	songs: [
		{name: 'Intro', length: '3:17'},
		{name: 'Calma Pueblo', length: '4:09'},
		{name: 'El Baile de los Pobres', length: '3:27'},
		{name: 'La Vuelta al Mundo', length: '3:54'},
		{name: 'La Bala', length: '4:27'},
		{name: 'Vamo a Portarnos Mal', length: '6:07'},
		{name: 'Latinoamerica', length: '4:57'},
		{name: 'Inter - En Annunakilandia', length: '1:04'},
		{name: 'Digo lo que Pienso', length: '5:06'},
		{name: 'Muerte en Hawaii', length: '3:09'},
		{name: 'Todo Se Mueve', length: '3:22'},
		{name: 'El Hormiguero', length: '4:51'},
		{name: 'Preparame la Cena', length: '5:19'},
		{name: 'Outro', length: '1:11'}
	]
};

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


var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumArray = [albumPicasso, albumMarconi, albumCalle13];
var albumIndex = 1; //index of currently displayed album

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

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
		var $songNumber = $songItemNumber.data('song-number');
		if (currentlyPlayingSong !== null) {
			// Revert to song number for currently playing song because user started playing new song
			var $currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
			$currentlyPlayingSongElement.html(currentlyPlayingSong);
		}
		if (currentlyPlayingSong !== $songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing
			$songItemNumber.html(pauseButtonTemplate);
			currentlyPlayingSong = $songNumber;
		} else if (currentlyPlayingSong === $songNumber) {
			// Switch from Pause -> Play button to pause currently playing song
			$songItemNumber.html(playButtonTemplate);
			currentlyPlayingSong = null;
		}
	};

	var onHover = function(event){
		var $songItemNumber = $(this).find('.song-item-number');
		var $songNumber = $songItemNumber.data('song-number');
		if ($songNumber !== currentlyPlayingSong) {
			$songItemNumber.html(playButtonTemplate);
		}
	};

	var offHover = function(event){
		var $songItemNumber = $(this).find('.song-item-number');
		var $songNumber = $songItemNumber.data('song-number');
		if ($songNumber !== currentlyPlayingSong) {
			$songItemNumber.html($songNumber);
		}
	};

	var $songListContainer = $('.album-view-song-list');
	$songListContainer.on("mouseenter", ".album-view-song-item", onHover);
	$songListContainer.on("mouseleave", ".album-view-song-item", offHover);
	$songListContainer.on('click', ".album-view-song-item", clickHandler);
});






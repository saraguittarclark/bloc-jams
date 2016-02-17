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

var findParentByClassName = function(element, targetClass) {
	var currentParent = element.parentElement;
	if (currentParent) {
		while (currentParent && currentParent.className != targetClass) {
			currentParent = currentParent.parentElement;
		}
		if (currentParent.className == targetClass) { 
			return currentParent;
		} else {
			console.log("No parent with that class name found");
		}	
		return currentParent;
	} else {
		console.log("No parent found!");
	} 
};

var getSongItem = function(element) {
	//ALWAYS return song-item-number class 
	//parent find a child - query down the DOM 
	//sibling find a sibling - query up then across the DOM
	//child find parent - query UP! findParentByClassName
	switch(element.className) {
		case "album-song-button":
		case "ion-play":
		case "ion-pause":
			return findParentByClassName(element, "song-item-number");
		case "album-view-song-item":
			return element.querySelector(".song-item-number");
		case "song-item-duration":
		case "song-item-title":
			return findParentByClassName(element, "album-view-song-item").querySelector(".song-item-number");
		case "song-item-number":
			return element;
		default: 
			return;
	}  
};

var clickHandler = function(targetElement) {
	var songItem = getSongItem(targetElement);
	if (currentlyPlayingSong === null) {
		songItem.innerHTML = pauseButtonTemplate;
		currentlyPlayingSong = songItem.getAttribute('data-song-number');
	} else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
		songItem.innerHTML = playButtonTemplate;
		currentlyPlayingSong = null;
	} else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
		var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
		currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
		songItem.innerHTML = pauseButtonTemplate;
		currentlyPlayingSong = songItem.getAttribute('data-song-number');
	}
};



var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumArray = [albumPicasso, albumMarconi, albumCalle13];
var albumIndex = 1; //index of currently displayed album

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

window.onload = function() {
	setCurrentAlbum(albumArray[albumIndex]);

	albumImage.addEventListener('click', function() { 
	albumIndex++;
	if (albumIndex >= albumArray.length) {
		albumIndex = 0;
	} 
	setCurrentAlbum(albumArray[albumIndex]);
	});

	songListContainer.addEventListener('mouseover', function(event){
		if (event.target.parentElement.className === 'album-view-song-item')  {
			var songItem = getSongItem(event.target);

			if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
				songItem.innerHTML = playButtonTemplate;
			}
		}
	});

	songListContainer.addEventListener('mouseout', function(event) {
		if (event.target.parentElement.className === 'album-view-song-item') {
			var songItem = getSongItem(event.target);
			var songItemNumber = songItem.getAttribute('data-song-number');

			if (songItemNumber !== currentlyPlayingSong) {
				songItem.innerHTML = songItemNumber;
			}
		}
	});
	
	songListContainer.addEventListener("click", function (event) {
		if (event.target.parentElement.className === "album-view-song-item") {
			clickHandler(event.target);
		}
	});
};






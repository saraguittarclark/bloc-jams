var albumPicasso={name:"The Colors",artist:"Pablo Picasso",label:"Cubism",year:"1881",albumArtUrl:"assets/images/album_covers/01.png",songs:[{name:"Blue",length:"4:26"},{name:"Green",length:"3:14"},{name:"Red",length:"5:01"},{name:"Pink",length:"3:21"},{name:"Magenta",length:"2:15"}]},albumMarconi={name:"The Telephone",artist:"Guglielmo Marconi",label:"EM",year:"1909",albumArtUrl:"assets/images/album_covers/20.png",songs:[{name:"Hello, Operator",length:"1:01"},{name:"Ring, ring, ring",length:"5:01"},{name:"Fits in your pocket",length:"3:21"},{name:"Can you hear me now?",length:"3:14"},{name:"New phone, who dis?",length:"2:15"}]},albumCalle13={name:"Entren Los Que Quieran",artist:"Calle 13",label:"Alt Hip-Hop",year:"2010",albumArtUrl:"assets/images/album_covers/15.png",songs:[{name:"Intro",length:"3:17"},{name:"Calma Pueblo",length:"4:09"},{name:"El Baile de los Pobres",length:"3:27"},{name:"La Vuelta al Mundo",length:"3:54"},{name:"La Bala",length:"4:27"},{name:"Vamo a Portarnos Mal",length:"6:07"},{name:"Latinoamerica",length:"4:57"},{name:"Inter - En Annunakilandia",length:"1:04"},{name:"Digo lo que Pienso",length:"5:06"},{name:"Muerte en Hawaii",length:"3:09"},{name:"Todo Se Mueve",length:"3:22"},{name:"El Hormiguero",length:"4:51"},{name:"Preparame la Cena",length:"5:19"},{name:"Outro",length:"1:11"}]},createSongRow=function(e,n,a){var t='<tr class="album-view-song-item">		<td class="song-item-number" data-song-number="'+e+'">'+e+'</td>		<td class="song-item-title">'+n+'</td>		<td class="song-item-duration">'+a+"</td>	</tr>";return t},setCurrentAlbum=function(e){var n=document.getElementsByClassName("album-view-title")[0],a=document.getElementsByClassName("album-view-artist")[0],t=document.getElementsByClassName("album-view-release-info")[0],l=document.getElementsByClassName("album-cover-art")[0],s=document.getElementsByClassName("album-view-song-list")[0];n.firstChild.nodeValue=e.name,a.firstChild.nodeValue=e.artist,t.firstChild.nodeValue=e.year+" "+e.label,l.setAttribute("src",e.albumArtUrl),s.innerHTML="";for(var m=0;m<e.songs.length;m++)s.innerHTML+=createSongRow(m+1,e.songs[m].name,e.songs[m].length)},albumImage=document.getElementsByClassName("album-cover-art")[0],albumArray=[albumPicasso,albumMarconi,albumCalle13],albumIndex=1,songListContainer=document.getElementsByClassName("album-view-song-list")[0],songRows=document.getElementsByClassName("album-view-song-item"),playButtonTemplate='<a class="album-song-button"><span class="ion-play"></span></a>';window.onload=function(){setCurrentAlbum(albumArray[albumIndex]),albumImage.addEventListener("click",function(){albumIndex++,albumIndex>=albumArray.length&&(albumIndex=0),setCurrentAlbum(albumArray[albumIndex])}),songListContainer.addEventListener("mouseover",function(e){"album-view-song-item"===e.target.parentElement.className&&(e.target.parentElement.querySelector(".song-item-number").innerHTML=playButtonTemplate)});for(var e=0;e<songRows.length;e++)songRows[e].addEventListener("mouseleave",function(e){this.children[0].innerHTML=this.children[0].getAttribute("data-song-number")})};
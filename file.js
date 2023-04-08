const fileSelector = document.getElementById("file-selector");
const audioTag = document.body.querySelector("audio");

var fileList;
var currentNumber = 0;

function showList(list) {
  document.getElementById("box-storage").innerHTML = "no files :(";
  for(let i = 0; i < list.length; i++) {
    var box = document.createElement("div");
    box.classList.add("box-class");
    box.innerHTML = list[i].name;
    box.onclick = function() {
      currentNumber = i;
      setNewSong();
    }
    document.getElementById("box-storage").appendChild(box);
  }
  changeBoxColor();
}


fileSelector.addEventListener("change", function(event){ //if files have been added
  fileList = Array.from(event.target.files); //make it an array!!!
  showList(fileList);
  setNewSong();
  loopOff();
})

var updateTimer;

//set the current song
function setNewSong() {
  clearInterval(updateTimer);
  resetValues();
  if(!showAlphabet) {
    audioTag.src = URL.createObjectURL(fileList[currentNumber]);
      document.getElementById("current-song").innerHTML = fileList[currentNumber].name;
      alphabetPlaylistPlaying = false;
  }
  else if(showAlphabet){
    audioTag.src = URL.createObjectURL(tempoList[currentNumber]);
      document.getElementById("current-song").innerHTML = tempoList[currentNumber].name;
      alphabetPlaylistPlaying = true;
  }
  //change color of box
  changeBoxColor();

  updateTime = setInterval(seekUpdate, 1000); //check time of video every second (?)
  playSong();
}

function changeBoxColor() {
  const boxList = document.getElementById("box-storage").getElementsByTagName("div");
  for(var i = 0; i < boxList.length; i++) {
    if((i === currentNumber) && ((showAlphabet && alphabetPlaylistPlaying)||(!showAlphabet && !alphabetPlaylistPlaying))) {
      boxList[i].className = "box-class-selected";
    }
    else boxList[i].className = "box-class";
  }

}

//shuffle the playlist
document.getElementById("random-button").onclick = function() {
  shuffle(fileList);
  currentNumber = 0; //begin at start of list
  showAlphabet = false; //no more alphabet list
  setNewSong();
  //change the display!!!
  showList(fileList);
  loopOff(); //shut off deh loop

}

//loop the current song
var loopSong = false;
const loopButton = document.getElementById("loop-button")
loopButton.onclick = function() {
  if(!loopSong) loopOn();
  else if (loopSong) loopOff();
}

function loopOn() {
  loopSong = true;
  loopButton.style.backgroundColor = "green"
}

function loopOff() {
  loopSong = false;
  loopButton.style.backgroundColor = "white";
}

audioTag.onended = function() {
  if(!loopSong) {
    if(currentNumber != fileList.length - 1 )currentNumber++;
    else currentNumber = 0;
  }
    setNewSong();
    playSong();

}

//play and pause stuff {
var playing = false;
const playButton = document.getElementById("play-button");
playButton.onclick = function(){
  if(playing) pauseSong();
  else if (!playing) playSong();

};

function playSong() {
  playing = true;
  audioTag.play();
  playButton.innerHTML = "pause";
}

function pauseSong() {
  playing = false;
  audioTag.pause();
  playButton.innerHTML = "play_arrow";
}


document.getElementById("previous-button").onclick = function(){
  if(currentNumber!== 0) currentNumber--;
  else currentNumber = fileList.length - 1;
  setNewSong();
  playSong();
}

document.getElementById("next-button").onclick = function(){
  if(currentNumber!== fileList.length -1) currentNumber++;
  else currentNumber = 0;
  setNewSong();
  playSong();

}

//progress bar and time stamps and volume {
const progressBar = document.getElementById("progress-bar");

function resetValues() { //reset the time numbers
  document.getElementById("start-time").innerHTML = "00:00";
  document.getElementById("end-time").innerHTML = "00:00";
  progressBar.value = 0;
  loopOff();
  clearSearchBar();
}

progressBar.oninput = function() { //change the place in video when you press the funny bar
  // Calculate the seek position by the
  // percentage of the seek slider
  // and get the relative duration to the track
  var seekto = audioTag.duration * (progressBar.value / 100);

  // Set the current track time to the calculated seek position
  audioTag.currentTime = seekto;
}

document.getElementById("volume-bar").oninput = function() {
  // Set the volume according to the
  // percentage of the volume slider set
  audioTag.volume = document.getElementById("volume-bar").value / 100;
}

function seekUpdate() { //update the progress bar as the song plays
  var seekPosition = 0;

  // Check if the current track duration is a legible number
  if (!isNaN(audioTag.duration)) {
    seekPosition = audioTag.currentTime * (100 / audioTag.duration);
    progressBar.value = seekPosition;

    // Calculate the time left and the total duration
    let currentMinutes = Math.floor(audioTag.currentTime / 60);
    let currentSeconds = Math.floor(audioTag.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(audioTag.duration / 60);
    let durationSeconds = Math.floor(audioTag.duration - durationMinutes * 60);

    // Add a zero to the single digit time values
    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    // Display the updated duration
    document.getElementById("start-time").textContent = currentMinutes + ":" + currentSeconds;
    document.getElementById("end-time").textContent = durationMinutes + ":" + durationSeconds;
  }
}

//}


//SEARCH {
var searchBar = document.getElementById("search-bar")
searchBar.onkeyup = updateSearch;
function updateSearch() {
  var filter = searchBar.value.toUpperCase();
  var list = document.getElementById("box-storage").getElementsByTagName("div");
  for (var i = 0; i < list.length; i++) {
    if(list[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      list[i].style.display = "";
    } else {
      list[i].style.display = "none";
    }
  }
}

function clearSearchBar() {
  searchBar.value = "";
  updateSearch();
}
//}

//button to sort songs and play them alphabteically or in og playorder
var sortButton = document.getElementById("sort-button");
sortButton.onclick = changeAlphabet;
var tempoList, //the alphabeitcal list
    showAlphabet = false, //whether or not the alphabet list being shown
    alphabetPlaylistPlaying = false; //wheter or not the alphabet playlist is being played

function changeAlphabet(){ //show the alphabet song list
  if(!showAlphabet) {
    var nameList = [];
    tempoList = [...fileList]; //tenporary variable to hold alpaheblical list

    for(var i = 0; i < fileList.length; i++) nameList.push(fileList[i].name.toLowerCase());

    var alphabetList = nameList.sort(); //make the list of names in alphabitcal order
      tempoList.sort((a, b) => alphabetList.indexOf(a.name.toLowerCase()) - alphabetList.indexOf(b.name.toLowerCase()));
  /**
      tempoList.forEach(function(obj){ //order tempolist in order of alphabetlist
        for(var k = 0; k < alphabetList.length; k++) {
          if(obj.name.toLowerCase() === alphabetList[k]) {
          //  console.log(obj.name.toLowerCase() + "og position:" + tempoList.indexOf(obj) + "new position:" + k)
            //swapElement(tempoList, tempoList.indexOf(obj), k);
            tempoList.sort(function(b){
              return tempoList.indexOf(obj) - alphabetList.indexOf(b);
            });

          //  console.log(obj.name.toLowerCase() + "new position" + tempoList.indexOf(obj))
          }
        }
      })
    UNEEDED CODE (but i like it so it stays :)   )**/

    sortButton.innerHTML = "Sort play order"
    showAlphabet = true;
      changeBoxColor();
    showList(tempoList); //note that the alphabeitcal list is not order songs are played in

  } else if (showAlphabet) { //put order back into order songs will be played
   sortButton.innerHTML = "Sort Alphbetical"
      showAlphabet = false;
        changeBoxColor();
      showList(fileList);
  }
}

//random ass array functions {
//swap elmenets around in an array function
function swapElement(array, oldIndex, newIndex) {
  var tmp = array[oldIndex];
  array[oldIndex] = array[newIndex];
  array[newIndex] = tmp;
}

//shuffle function

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
      swapElement(array, currentIndex, randomIndex);
  }

  return array;
}
//}

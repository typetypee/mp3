var fileSelector = document.getElementById("file-selector");


 var audioTag = document.body.querySelector("audio");


var fileList;
var currentNumber = 0;

function showList(list) {
  document.getElementById("box-storage").innerHTML = "";
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
  audioTag.src = URL.createObjectURL(fileList[currentNumber]);
  document.getElementById("current-song").innerHTML = fileList[currentNumber].name;
  updateTime = setInterval(seekUpdate, 1000);
  playSong();
}

//shuffle the playlist
document.getElementById("random-button").onclick = function() {
  shuffle(fileList);
  currentNumber = 0;
  setNewSong();
  //change the display!!!
  showList(fileList);
  loopOff();
}

var loopSong = false;
var loopButton = document.getElementById("loop-button")
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
var playButton = document.getElementById("play-button");
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
  loopOff();
}

document.getElementById("next-button").onclick = function(){
  if(currentNumber!== fileList.length -1) currentNumber++;
  else currentNumber = 0;
  setNewSong();
  playSong();
  loopOff();
}

//}


//progress bar and time stamps and volume {
var progressBar = document.getElementById("progress-bar");

function resetValues() {
  document.getElementById("start-time").innerHTML = "00:00";
  document.getElementById("end-time").innerHTML = "00:00";
  progressBar.value = 0;
}

progressBar.oninput = function() {
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

var searchBar = document.getElementById("search-bar")
searchBar.onkeyup = function() {
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
var showAlphabet = false;

var sortButton = document.getElementById("sort-button");
sortButton.onclick = function() { //list in alphabetical order
  if(!showAlphabet) {
    var nameList = [];
    var tempoList = fileList;
    for(var i = 0; i < fileList.length; i++) {
      nameList.push(fileList[i].name);
    }
    var alphabetList = nameList.sort();

      for(var k = 0; k < alphabetList.length; k++) {
        tempoList.findIndex(function(obj){
          if(tempoList.name === alphabetList[k]) {
            tempoList.splice(tempoList.indexOf(), 1);
            tempoList.splice(k, 0, tempoList);
          }
        })
      }
    sortButton.innerHTML = "Sort play order"
    showAlphabet = true;
    showList(tempoList);

  } else if (showAlphabet) { //put order back into order songs will be played
   sortButton.innerHTML = "Sort Alphbetical"
      showAlphabet = false;
      showList(fileList);

  }
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
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

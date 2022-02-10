// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebase } from '@firebase/app';
import "firebase/firestore";
import 'regenerator-runtime/runtime';
import { speed } from "jquery";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOgYJzD-yhVfC18ikzhx4fgxWY9sE9tC0",
  authDomain: "progetto-actam.firebaseapp.com",
  projectId: "progetto-actam",
  storageBucket: "progetto-actam.appspot.com",
  messagingSenderId: "934505841889",
  appId: "1:934505841889:web:49c57ffed9d1f0f5ad23a0"
};

var preset;
window.preset = preset;

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
db.collection("presets").onSnapshot(dbCallback);

function dbCallback(snapshot) {
  preset = [];
  snapshot.docs.forEach((doc) => preset.push({
    id: doc.id,
    ...doc.data(),
  }));
  console.log(preset)
}

function upload() {
  let NewPreset = {};
  NewPreset.Name = NamePreset;
  NewPreset.Attack = document.querySelector("#attackRange").value;
  NewPreset.Sustain = document.querySelector("#decayRange").value;
  NewPreset.Decay = document.querySelector("#sustainRange").value;
  NewPreset.Release = document.querySelector("#releaseRange").value;
  NewPreset.Gain = document.querySelector("#gainRange").value;
  NewPreset.LowPass = document.querySelector("#LOWFilter").value;
  NewPreset.HighPass = document.querySelector("#HIGHFilter").value;
  NewPreset.EchoDelay = document.querySelector("#TimeOfDelay").value;
  NewPreset.EchoGain = document.querySelector("#GainOfDelay").value;
  NewPreset.FreqDifference = document.querySelector("#deltaSlider").value;
  db.collection("presets").add(NewPreset)
    .then(function (docRef) {
      docRef.get().then(function (snap) {
        /*app.selectedState.id = snap.id
        app.saveState(snap.id)
        app.selectedState.name = snap.data().name
        app.selectedState.rings = snap.data().rings*/
      })
    })
    .catch(function () {
      alert("Internal error: can't upload state to database")
    });
}

window.upload = upload;




//TALKBOX***************************************************************************
//knob controlled variables that allow you to select a certain section of the voice buffer
var sliceStart = 0;
var sliceEnd = 1;
//random variables that have the same distance as (sliceEnd-sliceStart). They move around the buffer thanks to the random function
var rndgrainStart;
var rndgrainEnd;
var Startrnd;
var Endrnd;
var speedRnd = 100;   //initial value of the slider that allows you to decide at which speed the random function will be called

var selezionaSpeed = document.querySelector("#speedSlider");

selezionaSpeed.addEventListener("change", displayTempo)

//function used to update the speed, displayed in the #randomVelocity screen, when the slider SLDTalkbox is moved around 
function displayTempo() {
  speedRnd = selezionaSpeed.value
  document.getElementById("speed").innerHTML = speedRnd * 0.001 + "s";
  setTimeout(displayTempo, 100);
}

displayTempo();


var canvasElementTalkbox = document.querySelector("#canvasRecorder");
const ctxTalkbox = canvasElementTalkbox.getContext("2d");
ctxTalkbox.moveTo(0, 0);
ctxTalkbox.lineTo(100, 100);

const c = new AudioContext();
const aTalkbox = c.createAnalyser();

var dataTalkbox = new Float32Array(1024);

aTalkbox.getFloatTimeDomainData(dataTalkbox);
console.log(dataTalkbox);

function drawTalkbox() {
  aTalkbox.getFloatTimeDomainData(dataTalkbox);
  ctxTalkbox.clearRect(0, 0, 1000, 1000);
  ctxTalkbox.beginPath();
  const hTalkbox = canvasElementTalkbox.height;
  ctxTalkbox.moveTo(0, hTalkbox / 2);
  for (var i = 0; i < 1024; i++) {
    ctxTalkbox.lineTo(
      (i * canvasElementTalkbox.width) / dataTalkbox.length,
      hTalkbox / 2 + (dataTalkbox[i] * hTalkbox) / 2
    );
  }
  ctxTalkbox.stroke();
}

setInterval(drawTalkbox, 20);

//FIRST KNOB
//const knob = document.querySelector(".knob");
const knob = document.querySelector(".knob");

let prevX = 0;
let prevY = 0;

function startKnob(e) {
  //get half of the knob width and height
  const w = knob.clientWidth / 2;
  const h = knob.clientHeight / 2;

  //get the mouse coordinates
  const x = e.clientX - (150 + 118);
  const y = e.clientY - (165 + 255);

  //calculating delta values
  const deltaX = w - x;
  const deltaY = h - y;

  //mouse position in radians
  const rad = Math.atan2(deltaY, deltaX);
  //Convert to degrees
  let deg = rad * (180 / Math.PI);

  //limit bounds
  if (deg < -135) {
    deg = -135;
  } else if (deg > 135) {
    deg = 135;
  }

  prevX = x;
  prevY = y;

  return deg;
}

function rotate(e) {
  //final calculations for the mouse position
  const result = Math.floor(startKnob(e));
  //rotate knob with the final calculation
  knob.style.transform = `rotate(${result}deg)`;
  sliceStart = result / 270 + 0.5;

  if (sliceStart >= sliceEnd) {
    sliceStart = sliceEnd;
  }
}

function startRotation() {
  window.addEventListener("mousemove", rotate);
  window.addEventListener("mouseup", endRotation);
}

function endRotation() {
  window.removeEventListener("mousemove", rotate);
}

knob.addEventListener("mousedown", startRotation);

//SECOND KNOB
const knob2 = document.querySelector(".lowerKnob");

let prevX2 = 0;
let prevY2 = 0;

function startKnob2(e) {
  //get half of the knob width and height
  const w2 = knob2.clientWidth / 2;
  const h2 = knob2.clientHeight / 2;

  //get the mouse coordinates
  const x2 = e.clientX - (150 + 118);
  const y2 = e.clientY - (165 + 356);

  //calculating delta values
  const deltaX2 = w2 - x2;
  const deltaY2 = h2 - y2;

  //mouse position in radians
  const rad2 = Math.atan2(deltaY2, deltaX2);
  //Convert to degrees
  let deg2 = rad2 * (180 / Math.PI);

  //limit bounds
  if (deg2 < -135) {
    deg2 = -135;
  } else if (deg2 > 135) {
    deg2 = 135;
  }

  prevX2 = x2;
  prevY2 = y2;

  return deg2;
}

function rotate2(e) {
  //final calculations for the mouse position
  const result2 = Math.floor(startKnob2(e));
  //rotate knob with the final calculation
  knob2.style.transform = `rotate(${result2}deg)`;
  sliceEnd = result2 / 270 + 0.5;

  if (sliceEnd <= sliceStart) {
    sliceEnd = sliceStart;
  }
}

function startRotation2() {
  window.addEventListener("mousemove", rotate2);
  window.addEventListener("mouseup", endRotation2);
}

function endRotation2() {
  window.removeEventListener("mousemove", rotate2);
}

knob2.addEventListener("mousedown", startRotation2);

//BUFFER
const recording_length = 10;

var recordBuffer = c.createBuffer(
  1,
  recording_length * c.sampleRate,
  c.sampleRate
);

var bindex = 0;


var pn, mss;
var recording = true;
async function main() {
  var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  var mss = c.createMediaStreamSource(stream);
  pn = c.createScriptProcessor(1024, 1, 1);
  pn.onaudioprocess = function (event) {
    if (recording == false) {
      return;
    }
    const dataIn = event.inputBuffer.getChannelData(0);
    var recordBufferData = recordBuffer.getChannelData(0);
    for (var i = 0; i < dataIn.length; i++) {
      recordBufferData[bindex++ % recordBuffer.length] = dataIn[i];
    }
  };
  mss.connect(pn);
  pn.connect(c.destination);
}

main();

var dataIn;
var step;
var markPosition;

function drawBuffer() {
  ctxTalkbox.strokeStyle = "#000000";

  ctxTalkbox.beginPath();
  ctxTalkbox.clearRect(0, 0, canvasRecorder.width, canvasRecorder.height);
  ctxTalkbox.moveTo(0, canvasRecorder.height / 2);
  dataIn = recordBuffer.getChannelData(0);
  step = recordBuffer.length / canvasRecorder.width;
  for (var i = 0; i < canvasRecorder.width; i++) {
    ctxTalkbox.lineTo(i, canvasRecorder.height / 2 + 400 * dataIn[Math.round(i * step)]);
  }

  markPosition = Math.round((bindex % recordBuffer.length) / step);
  ctxTalkbox.moveTo(markPosition, 0);
  ctxTalkbox.lineTo(markPosition, canvasRecorder.height);
  ctxTalkbox.stroke();

  // draw slice bounds

  ctxTalkbox.strokeStyle = "lightblue";
  ctxTalkbox.beginPath();
  ctxTalkbox.moveTo(canvasRecorder.width * sliceStart, 0);
  ctxTalkbox.lineTo(canvasRecorder.width * sliceStart, canvasRecorder.height);
  ctxTalkbox.moveTo(canvasRecorder.width * sliceEnd, 0);
  ctxTalkbox.lineTo(canvasRecorder.width * sliceEnd, canvasRecorder.height);
  ctxTalkbox.stroke();
  ctxTalkbox.strokeStyle = "#000000";
  window.requestAnimationFrame(drawBuffer);

  ctxTalkbox.beginPath();
  ctxTalkbox.fillStyle = "lightgreen";
  ctxTalkbox.fillRect(
    canvasRecorder.width * sliceStart,
    canvasRecorder.height,
    canvasRecorder.width * sliceEnd - canvasRecorder.width * sliceStart,
    canvasRecorder.height
  );
  ctxTalkbox.stroke();

  //draw random slice bound
  ctxTalkbox.strokeStyle = "#FFA500";
  ctxTalkbox.beginPath();
  ctxTalkbox.moveTo(canvasRecorder.width * rndgrainStart, 0);
  ctxTalkbox.lineTo(canvasRecorder.width * rndgrainStart, canvasRecorder.height);
  ctxTalkbox.moveTo(canvasRecorder.width * rndgrainEnd, 0);
  ctxTalkbox.lineTo(canvasRecorder.width * rndgrainEnd, canvasRecorder.height);
  ctxTalkbox.stroke();
  ctxTalkbox.strokeStyle = "#000000";
}

drawBuffer();

var playBuffer;

//function used to play a selected section of the buffer
function playSlice(start, end, playbackRate) {
  var playBuffer = c.createBuffer(
    1,
    Math.round((end * 10 - start * 10) * c.sampleRate),
    c.sampleRate
  );
  var playData = playBuffer.getChannelData(0);
  var dataIn = recordBuffer.getChannelData(0);
  var startSample = Math.round(start * 10 * c.sampleRate);
  var endSample = Math.round(end * 10 * c.sampleRate);
  for (var i = startSample; i < endSample; i++) {
    playData[i - startSample] = dataIn[i];
  }
  const bufferSource = c.createBufferSource();
  bufferSource.buffer = playBuffer;
  bufferSource.connect(c.destination);
  bufferSource.start();
  bufferSource.playbackRate.value = playbackRate;
}

var startrec = document.querySelector("#rec");
var clickedKey;

function StartSuspendRec() {
  recording = !recording;
  clickedKey = event.target;
  clickedKey.classList.toggle("NonActiveRec");
};

startrec.addEventListener("click", StartSuspendRec)

var IO = document.getElementById("accensione");

function ONOFF() {
  var ciao = document.getElementById("accensione").checked == true;

  if (ciao == true) {
    c.resume();
  }
  else {
    c.suspend();
  }

  return ciao
}

IO.addEventListener("click", ONOFF);

//lines of code used to change the style of the random button when clicked
const rnd = document.querySelector(".rnd");
rnd.addEventListener("click", function (e) {
  rnd.classList.toggle("button-clicked");
  rnd.firstElementChild.classList.toggle("icon-clicked");
});

//function used to check that the slice bounds do not exceed the max buffer size (the canvas size)
function CheckOutOfBoundsRandom(e) {
  if (e > 1) e = 1;
  else e = e;

  return e;
}

//function used to update the random slice bounds
function updateRandom() {
  var min = 0;
  var max = 1;
  var Startrnd = Math.random();
  var Endrnd = Startrnd + (sliceEnd - sliceStart);
  Endrnd = CheckOutOfBoundsRandom(Endrnd);
  rndgrainStart = Startrnd;
  rndgrainEnd = Endrnd;
}

//function used to call a certain number of times (repetitions) the same buffer section after a certain delay
function setIntervalX(callback, delay, repetitions) {
  var x = 0;
  var intervalID = window.setInterval(function () {

    playSlice(rndgrainStart, rndgrainEnd, 1)

    if (++x === repetitions) {
      window.clearInterval(intervalID);
    }
  }, delay);
}

//function that plays the slices of buffer selected by the Random bounds
function PlayRandom() {
  var diff = rndgrainEnd - rndgrainStart;
  //when the duration of the selected slice of buffer is greater then the speed of the random update, the function only plays a part of the selected slice that has the same time duration as the speed od the random update
  if (diff * 10 > speedRnd * 0.001) {
    var rndgrainEndNew = rndgrainStart + (speedRnd * 0.0001);
    playSlice(rndgrainStart, rndgrainEndNew, 1)
  }
  //when the duration of the selected slice of buffer is less greater then the speed of the random update, the function plays the selected slice of buffer DecNumber+IntNumer of times
  else {
    var IntNumber = Math.trunc((speedRnd / 1000) / (diff * 10));    //parte intera
    var DecNumber = ((speedRnd / 1000) / (diff * 10)) - IntNumber;  //parte decimale
    setIntervalX(playSlice(rndgrainStart, rndgrainEnd, 1), (rndgrainEnd - rndgrainStart) * 10000, IntNumber);
    setTimeout(playSlice(rndgrainStart, rndgrainStart + (DecNumber / 10), 1), (rndgrainEnd - rndgrainStart) * 10000 * IntNumber)
  }
}

var randomButton = document.querySelector("#random");

//function that changes the value of the rnd button when clicked
function activeOrNot() {
  if (document.querySelector(".rnd").value == "false") { activateRnd(); }
  else { deactivateRnd() }
}

randomButton.addEventListener("click", activeOrNot);


//variables used to keep track of what intervals we're creating, in order to be able to clear them
var rndInterval = 0;
var rndInterval2 = 0;

//function that, when the rnd button is true, plays the selected section with PlayRandom() and updates it
function activateRnd() {
  document.querySelector(".rnd").value = "true";
  rndInterval = setInterval(updateRandom, speedRnd);
  rndInterval2 = setInterval(PlayRandom, speedRnd);
}

//function that is used to clear all the intervals that are created by the activateRnd() function
function deactivateRnd() {
  document.querySelector(".rnd").value = "false";
  clearInterval(rndInterval);
  clearInterval(rndInterval2);
}

//function used to play the selected buffer's slice when the TEST button is clicked
document.querySelector(".test").onclick = function () {
  playSlice(sliceStart, sliceEnd, 1)
};


//TASTIERA*******************************************************
let ac = new AudioContext();
let adsrCanvas = document.getElementById("adsrGraph");
let adsrCtx = adsrCanvas.getContext("2d");
let oscillatorsON = 0;
var n = 0;
let delta = 0;

let adsrEnv = {
  attack: 0.05,
  decay: 0,
  sustain: 1,
  release: 0.5,
  gain: 1
};

let total;
let current;
// const N = 24;
const ON = true;
let isOn = ON;
let waveType = "sine";

const keys = "w3e4rt6y7u8izsxdcvgbhnjm";
//const keys = "zsxdcvgbhnjm";
let oscillators = Array(keys.length);
let oscillatorsPlusDelta = Array(keys.length);
let oscillatorsMinusDelta = Array(keys.length);
let gains = Array(keys.length);

document.onkeydown = (e) => {
  if (!keys.includes(e.key)) {
    // console.log(e.key);
    return;
  }
  if (e.repeat) return;

  var selezioneInput = document.getElementById("selezioneInput").checked == true;

  if (selezioneInput == true) {
    playNote(keys.indexOf(e.key), isOn);
  }
  else {
    playSlice(sliceStart, sliceEnd, Math.pow(2, n) * Math.pow(2, keys.indexOf(e.key) / 12));
  }
  // console.log(parseInt(window.getComputedStyle(document.querySelector(`.${e.key}`)).backgroundColor.split(', ')[1])-50)
};

document.onkeyup = (e) => {
  if (!keys.includes(e.key)) return;
  stopNote(keys.indexOf(e.key), isOn);
};

//????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
function setWaveType(string) {
  waveType = string;
}

setWaveType(
  document.querySelector(".waveform.active").classList.value.split(" ")[1]
);

var LOWfilterSliderFreq = 0.5;
var HIGHfilterSliderFreq = 0.001;
var TimeDelay = 0;
var GainDelay = 0;
var freqDiff = 0;


function playNote(nFreq, isOnFlag) {
  if (!isOnFlag) return;
  oscillatorsON = oscillatorsON + 1;
  const now = ac.currentTime;
  var o = ac.createOscillator();
  var opd = ac.createOscillator();
  var omd = ac.createOscillator();
  var g = ac.createGain();
  oscillators[nFreq] = o;
  oscillatorsPlusDelta[nFreq] = opd;
  oscillatorsMinusDelta[nFreq] = omd;
  gains[nFreq] = g;
  oscillators[nFreq].type = document
    .querySelector(".waveform.active")
    .classList.value.split(" ")[1];
  oscillatorsPlusDelta[nFreq].type = document
    .querySelector(".waveform.active")
    .classList.value.split(" ")[1];
  oscillatorsMinusDelta[nFreq].type = document
    .querySelector(".waveform.active")
    .classList.value.split(" ")[1];
  oscillators[nFreq].connect(gains[nFreq]);
  oscillatorsPlusDelta[nFreq].connect(gains[nFreq]);
  oscillatorsMinusDelta[nFreq].connect(gains[nFreq]);

  const maxFilterFreq = ac.sampleRate / 2;

  //LOW-PASS FILTER
  const LOWfilter = ac.createBiquadFilter();
  LOWfilter.type = "lowpass";
  LOWfilter.frequency.value = LOWfilterSliderFreq * maxFilterFreq;

  //HIGH-PASS FILTER
  const HIGHfilter = ac.createBiquadFilter();
  HIGHfilter.type = "lowpass";
  HIGHfilter.frequency.value = HIGHfilterSliderFreq * maxFilterFreq;

  //ECHO or DELAY
  const echo = {
    maxDuration: 1
  }

  const delayNode = ac.createDelay();
  delayNode.delayTime.value = TimeDelay * echo.maxDuration;
  delayNode.connect(ac.destination)

  const gainEcho = ac.createGain();
  gainEcho.gain.value = GainDelay;


  gains[nFreq].connect(a)
  gains[nFreq].connect(LOWfilter);
  gains[nFreq].connect(HIGHfilter);
  LOWfilter.connect(ac.destination);
  HIGHfilter.connect(ac.destination);
  gains[nFreq].connect(delayNode);
  delayNode.connect(gainEcho);
  gainEcho.connect(delayNode);
  gains[nFreq].gain.setValueAtTime(0, now);
  gains[nFreq].gain.linearRampToValueAtTime(adsrEnv.gain * 0.5 / (3 * oscillatorsON), now + adsrEnv.attack);
  gains[nFreq].gain.linearRampToValueAtTime(
    adsrEnv.gain * adsrEnv.sustain * (0.5 / (3 * oscillatorsON)),
    now + adsrEnv.attack + adsrEnv.decay
  );
  oscillators[nFreq].frequency.value = Math.pow(2, n) * 220 * Math.pow(2, nFreq / 12);
  oscillatorsPlusDelta[nFreq].frequency.value = Math.pow(2, n) * 220 * Math.pow(2, nFreq / 12) + delta;
  oscillatorsMinusDelta[nFreq].frequency.value = Math.pow(2, n) * 220 * Math.pow(2, nFreq / 12) - delta;
  oscillators[nFreq].start(ac.currentTime);
  oscillatorsPlusDelta[nFreq].start(ac.currentTime + 0.005);
  oscillatorsMinusDelta[nFreq].start(ac.currentTime + 0.003);

  console.log(1 / oscillatorsON);

  var colorCode =
    parseInt(
      window
        .getComputedStyle(document.querySelector(`.${keys[nFreq]}`))
        .backgroundColor.split(", ")[1]
    ) - 50;

  document
    .querySelector(`.${keys[nFreq]}`)
    .style.setProperty(
      "background-color",
      `rgb(${colorCode},${colorCode},${colorCode})`
    );
};


var delaystime = document.querySelector("#TimeOfDelay");
var delaysgain = document.querySelector("#GainOfDelay");

TimeOfDelay.addEventListener("change", SETTADELAY)
GainOfDelay.addEventListener("change", SETTADELAY)

function SETTADELAY() {
  TimeDelay = delaystime.value;
  GainDelay = delaysgain.value;
}

var passabasso = document.querySelector("#LOWFilter");
var passaalto = document.querySelector("#HIGHFilter");

TimeOfDelay.addEventListener("change", SETTAFILTRI)
GainOfDelay.addEventListener("change", SETTAFILTRI)

function SETTAFILTRI() {
  LOWfilterSliderFreq = passaalto.value;
  HIGHfilterSliderFreq = passaalto.value;
}

function stopNote(nFreq, isOnFlag) {
  if (!isOnFlag) return;
  const now = ac.currentTime;
  gains[nFreq].gain.setValueAtTime(adsrEnv.gain * adsrEnv.sustain * (0.5 / (3 * oscillatorsON)), now);
  gains[nFreq].gain.linearRampToValueAtTime(0, now + adsrEnv.release);
  oscillatorsON = oscillatorsON - 1;
  oscillators[nFreq].stop(now + adsrEnv.release + 0.05);
  oscillatorsPlusDelta[nFreq].stop(now + adsrEnv.release + 0.05);
  oscillatorsMinusDelta[nFreq].stop(now + adsrEnv.release + 0.05);
  gains[nFreq].disconnect(a)

  var colorCode =
    parseInt(
      window
        .getComputedStyle(document.querySelector(`.${keys[nFreq]}`))
        .backgroundColor.split(", ")[1]
    ) + 50;

  document
    .querySelector(`.${keys[nFreq]}`)
    .style.setProperty(
      "background-color",
      `rgb(${colorCode},${colorCode},${colorCode})`
    );
};

//contare elementi b e w
var k = 1; //variabile per distinguere b/n nel ciclo for
var countw = 0;
var countb = 0;
for (var i = 1; i <= keys.length; i++) {
  if (k === 2 || k === 4 || k === 7 || k === 9 || k === 11) {
    countb++;
  } else {
    countw++;
  }
  k++;
  if (k === 8) {
    k = 1;
  }
}
// console.log(countw);
// console.log(countb);

var j = 1; //variabile per distinguere b/n nel ciclo for
var fromLeftWhite = 0;
var fromLeftBlack = 0;
for (var i = 1; i <= keys.length; i++) {
  let key = document.createElement("div");
  key.classList.add("key");
  key.classList.add(`${keys.split("")[i - 1]}`);
  if (j === 2 || j === 4 || j === 7 || j === 9 || j === 11) {
    //tasti black
    const style = `width: ${100 / 3 / countb}%; left: ${((100 / 3) * (3 / 2)) / countb + (fromLeftBlack * 100) / countw
      }%;`;
    key.classList.add("black");
    key.style = style;
    if (j === 4 || j === 11) {
      fromLeftBlack++;
    }
    fromLeftBlack++;
  } else {
    //tasti white
    const style = `width: ${100 / countw}%; left: ${(fromLeftWhite * 100) / countw
      }%;`;
    key.classList.add("white");
    key.style = style;
    fromLeftWhite++;
  }

  keyboard.append(key);
  j++;
  if (j === 13) {
    j = 1;
  }
}

function setSwitcher(value) {
  isOn = value;
  document.querySelector("#turnoff-button").style = `background-color: ${isOn ? "#7fc846" : "#760f00"
    }`;
  // console.log(isOn)
};

document
  .querySelector("#turnoff-button")
  .setAttribute("onclick", `setSwitcher(!isOn)`);

document.querySelector("#turnoff-button").style = `background-color: ${isOn ? "#7fc846" : "#760f00"
  }`;

// funzione che imposta il bottone ricevuto in input come 'active'
function setActive(string) {
  document.querySelector(".waveform.active").classList.remove("active");
  document.querySelector(`.${string}`).classList.add("active");
};

// si crea una funzione setActive per ogni pulsante e la si conserva in un array
// si assegnano ai bottoni le funzioni contenute nell'array
let functionsArray = [];
let f = 0;
document.querySelectorAll(".waveform").forEach((button) => {    // si assegnano ai bottoni le funzioni contenuto nell'array
  functionsArray.push(function () {
    setActive(button.classList.value.split(" ")[1]);
  });
  button.setAttribute("click", `functionsArray[${f}]()`);
  f++;
});

//VISUALIZZATORE

// set up canvas context for visualizer

var canvasElement = document.querySelector("canvas")

const ctx = canvasElement.getContext("2d")

ctx.moveTo(0, 0)
ctx.lineTo(100, 100)


const a = ac.createAnalyser()

var data = new Float32Array(1024)

a.getFloatTimeDomainData(data)

console.log(data)

function draw1() {
  a.getFloatTimeDomainData(data);

  ctx.clearRect(0, 0, 1000, 1000);
  ctx.beginPath();
  const h = canvasElement.height;
  ctx.moveTo(0, h / 2);

  for (var i = 0; i < 1024; i++) {
    ctx.lineTo(i, h / 2 + data[i] * h / 2)
  }

  ctx.stroke()
}

setInterval(draw1, 60)




// INVILUPPI
document.querySelector("#attack").innerHTML = adsrEnv.attack;
document.querySelector("#decay").innerHTML = adsrEnv.decay;
document.querySelector("#sustain").innerHTML = adsrEnv.sustain;
document.querySelector("#release").innerHTML = adsrEnv.release;
document.querySelector("#gain").innerHTML = adsrEnv.gain;
document.querySelector("#attackRange").value = adsrEnv.attack;
document.querySelector("#decayRange").value = adsrEnv.decay;
document.querySelector("#sustainRange").value = adsrEnv.sustain;
document.querySelector("#releaseRange").value = adsrEnv.release;
document.querySelector("#gainRange").value = adsrEnv.gain;

function draw() {
  // reset variables
  total = adsrEnv.attack + adsrEnv.decay + adsrEnv.release;
  current = 60;
  adsrCtx.clearRect(0, 0, adsrCanvas.width, adsrCanvas.height);

  // Attack
  adsrCtx.beginPath();
  adsrCtx.moveTo(60, 250);
  adsrCtx.lineTo((adsrEnv.attack / total) * 300 + current, 50 + 200 * (1 - adsrEnv.gain));
  current += (adsrEnv.attack / total) * 300;

  // Decay
  adsrCtx.lineTo(
    (adsrEnv.decay / total) * 300 + current,
    250 - adsrEnv.sustain * adsrEnv.gain * 200
  );
  current += (adsrEnv.decay / total) * 300;

  // Sustain
  adsrCtx.lineTo(current + 25, 250 - adsrEnv.sustain * adsrEnv.gain * 200);
  current += 100;

  // Release
  adsrCtx.lineTo((adsrEnv.release / total) * 300 + current, 250);
  current += (adsrEnv.release / total) * 300;

  // stroke
  adsrCtx.lineWidth = 6;
  adsrCtx.strokeStyle = "grey";
  adsrCtx.stroke();
  adsrCtx.closePath();
  // drawAxis();
}

draw();


//mousemove functions
document.querySelector("#attackRange").addEventListener('mousemove', () => {
  adsrEnv.attack = Math.floor(document.querySelector("#attackRange").value * 100) / 100;
  draw();
  document.querySelector("#attack").innerHTML = adsrEnv.attack;
})

document.querySelector("#sustainRange").addEventListener("mousemove", () => {
  adsrEnv.sustain = Math.floor(document.querySelector("#sustainRange").value * 100) / 100;
  draw();
  document.querySelector("#sustain").innerHTML = adsrEnv.sustain;
});

document.querySelector("#decayRange").addEventListener("mousemove", () => {
  adsrEnv.decay = Math.floor(document.querySelector("#decayRange").value * 100) / 100;
  draw();
  document.querySelector("#decay").innerHTML = adsrEnv.decay;
});

document.querySelector("#releaseRange").addEventListener("mousemove", () => {
  adsrEnv.release = Math.floor(document.querySelector("#releaseRange").value * 100) / 100;
  draw();
  document.querySelector("#release").innerHTML = adsrEnv.release;
});

document.querySelector("#deltaSlider").addEventListener("mousemove", () => {
  delta = Math.floor(document.querySelector("#deltaSlider").value * 100) / 100;
  draw();
  document.querySelector("#deltaValue").innerHTML = `Detune: ${delta} Hz`;
});

document.querySelector("#gainRange").addEventListener("mousemove", () => {
  adsrEnv.gain = Math.floor(document.querySelector("#gainRange").value * 100) / 100;
  console.log(adsrEnv.gain);
  draw();
  document.querySelector("#gain").innerHTML = adsrEnv.gain;
});


function plusPitch() {
  n = n + 1;
}
function minusPitch() {
  n = n - 1;
}

var PLUS = document.getElementById("+");
var MINUS = document.getElementById("-");

PLUS.addEventListener("click", plusPitch)
MINUS.addEventListener("click", minusPitch)


var SAVEPreset = document.getElementById("save")
SAVEPreset.addEventListener("click", SaveButtonClicked)

var NamePreset = new String("");

function NomePreset() {
  NamePreset = prompt("Please enter the preset's name:");
}

function SaveButtonClicked() {
  NomePreset();
  upload();
}

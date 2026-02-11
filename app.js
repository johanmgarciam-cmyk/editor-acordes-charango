console.log("JS externo cargado correctamente");

let activePositions = {};

const chordLibrary = {
  "C": {
    tipo: "Mayor",
    posiciones: [
      {
        numero: 1,
        inversion: "Fundamental",
        bajo: "C",
        shape: "0-0|1-0|2-0|3-3|4-0"
      }
    ]
  }
};

function toggleNote(string, fret, element) {

  document.querySelectorAll(`[data-string='${string}']`).forEach(el => {
    el.classList.remove("active");
  });

  element.classList.add("active");
  activePositions[string] = fret;

  validateChord();
}

function generateShapeCode() {
  let code = [];

  for (let s = 0; s < 5; s++) {
    let fret = activePositions[s] !== undefined ? activePositions[s] : 0;
    code.push(s + "-" + fret);
  }

  return code.join("|");
}

function validateChord() {

  let resultDiv = document.getElementById("result");
  if (!resultDiv) return;

  let currentShape = generateShapeCode();

  for (let chordName in chordLibrary) {

    let chord = chordLibrary[chordName];

    for (let pos of chord.posiciones) {

      if (currentShape === pos.shape) {

        resultDiv.innerHTML =
          "<b>Acorde:</b> " + chordName + " " + chord.tipo +
          "<br><b>Posición:</b> " + pos.numero +
          "<br><b>Inversión:</b> " + pos.inversion;

        return;
      }
    }
  }

  resultDiv.innerHTML = "No corresponde a biblioteca oficial";
}

const noteNames = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const tuning = [7,0,4,9,4];

function getFrequency(noteIndex) {
  return 440 * Math.pow(2, (noteIndex - 9) / 12);
}

function playChord() {

  const ctx = new (window.AudioContext || window.webkitAudioContext)();

  for (let s = 0; s < 5; s++) {

    let fret = activePositions[s] !== undefined ? activePositions[s] : 0;
    let noteIndex = (tuning[s] + fret) % 12;
    let frequency = getFrequency(noteIndex);

    let osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = frequency;

    let gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1);
  }
}

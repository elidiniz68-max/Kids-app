// The player's star score (starts at 0)
let score = 0;

// Adds one star, updates the scoreboard, plays a happy sound
function addPoint() {
  score = score + 1;
  document.getElementById("score").innerHTML = "⭐ Score: " + score;
  playHappySound();
}

// Plays a happy two-note chime using the browser's built-in mini piano
function playHappySound() {
  const audio = new (window.AudioContext || window.webkitAudioContext)();
  const note = audio.createOscillator();
  note.connect(audio.destination);
  note.type = "sine";
  note.frequency.setValueAtTime(523.25, audio.currentTime);
  note.frequency.setValueAtTime(659.25, audio.currentTime + 0.12);
  note.start();
  note.stop(audio.currentTime + 0.35);
}

// Recipe that runs when the Math button is clicked
function startMathGame() {
  // Pick a random number between 2 and 6
  const count = Math.floor(Math.random() * 5) + 2;

  // Build a row of apples, one per count
  let apples = "";
  for (let i = 0; i < count; i++) {
    apples += "🍎 ";
  }

  // Three answer choices: right one + two close ones, mixed up
  const choices = [count - 1, count, count + 1];
  choices.sort(() => Math.random() - 0.5);

  // Put the question and buttons inside the "game" box
  document.getElementById("game").innerHTML =
    "<h2>How many apples do you see?</h2>" +
    "<p class='big'>" + apples + "</p>" +
    "<button onclick='checkAnswer(" + choices[0] + ", " + count + ")'>" + choices[0] + "</button>" +
    "<button onclick='checkAnswer(" + choices[1] + ", " + count + ")'>" + choices[1] + "</button>" +
    "<button onclick='checkAnswer(" + choices[2] + ", " + count + ")'>" + choices[2] + "</button>" +
    "<p id='feedback'></p>";
}

// Recipe that runs when an answer button is clicked
function checkAnswer(chosen, correct) {
  if (chosen === correct) {
    document.getElementById("feedback").innerHTML = "🎉 Correct! Great job!";
    addPoint();
  } else {
    document.getElementById("feedback").innerHTML = "Try again! 💪";
  }
}

// Our word list: each word has a picture and its starting letter
const words = [
  { word: "Apple", emoji: "🍎", letter: "A" },
  { word: "Ball", emoji: "⚽", letter: "B" },
  { word: "Cat", emoji: "🐱", letter: "C" },
  { word: "Dog", emoji: "🐶", letter: "D" },
  { word: "Egg", emoji: "🥚", letter: "E" },
  { word: "Fish", emoji: "🐟", letter: "F" }
];

// Remembers the right answer for the current round
let correctLetter = "";

// Recipe that runs when the Reading button is clicked
function startReadingGame() {
  // Pick a random word from the list
  const pick = words[Math.floor(Math.random() * words.length)];
  correctLetter = pick.letter;

  // The right letter + two random wrong ones, mixed up
  const others = words.filter(w => w.letter !== pick.letter);
  others.sort(() => Math.random() - 0.5);
  const choices = [pick.letter, others[0].letter, others[1].letter];
  choices.sort(() => Math.random() - 0.5);

  document.getElementById("game").innerHTML =
    "<h2>Which letter does this word start with?</h2>" +
    "<p class='big'>" + pick.emoji + " " + pick.word + "</p>" +
    "<button onclick='checkLetter(this)'>" + choices[0] + "</button>" +
    "<button onclick='checkLetter(this)'>" + choices[1] + "</button>" +
    "<button onclick='checkLetter(this)'>" + choices[2] + "</button>" +
    "<p id='feedback'></p>";
}

// Recipe that runs when a letter button is clicked
function checkLetter(chosen, correct) {
  if (chosen === correctLetter) {
    document.getElementById("feedback").innerHTML = "🎉 Correct! Great job!";
    addPoint();
  } else {
    document.getElementById("feedback").innerHTML = "Try again! 💪";
  }
}
// The player's star score (starts at 0)
let score = 0;
// Load the saved best score (0 if this is the first visit)
let best = Number(localStorage.getItem("bestScore")) || 0;
document.getElementById("best").innerHTML = "🏆 Best: " + best;
// Difficulty setting the games can read ("easy" or "hard")
let difficulty = "easy";
// Holds the "next question" countdown so we can cancel it
let nextQuestionTimer = null;

function setDifficulty(level) {
  difficulty = level;
  if (level === "easy") {
    document.getElementById("level").innerHTML = "😊 Easy mode";
  } else {
    document.getElementById("level").innerHTML = "🔥 Hard mode";
  }
}
// Adds one star, updates the scoreboard, plays a happy sound
function addPoint() {
  score = score + 1;
  document.getElementById("score").innerHTML = "⭐ Score: " + score;
  // New record? Save it in the browser's notebook!
  if (score > best) {
    best = score;
    localStorage.setItem("bestScore", best);
    document.getElementById("best").innerHTML = "🏆 Best: " + best + " 🎉 NEW!";
  }
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

// Shared helper: builds one answer button per choice.
// Each button calls the given check recipe with (choice, correctAnswer).
function showChoices(choices, checkFunctionName, correctAnswer) {
  let buttons = "";
  for (let i = 0; i < choices.length; i++) {
    // Text answers need quotes around them; numbers don't
    let choice = choices[i];
    let correct = correctAnswer;
    if (typeof choice === "string") {
      choice = "'" + choice + "'";
    }
    if (typeof correct === "string") {
      correct = "'" + correct + "'";
    }
    buttons += '<button onclick="' + checkFunctionName + "(" + choice + ", " + correct + ')">' + choices[i] + "</button>";
  }
  document.getElementById("choices").innerHTML = buttons;
}

// Runs after a right answer: locks the buttons so extra clicks
// don't count, then loads a fresh question after 1.5 seconds.
// (We hand setTimeout the recipe WITHOUT () — we're giving it
// the recipe to run later, not running it now.)
function advanceAfterWin(nextGame) {
  const buttons = document.querySelectorAll("#game button");
  buttons.forEach(b => b.disabled = true);
  nextQuestionTimer = setTimeout(nextGame, 1500);
}

// Recipe that runs when the Math button is clicked
function startMathGame() {
  clearTimeout(nextQuestionTimer);
  // Easy: 2-6 apples. Hard: 7-12 apples.
  let min = 2;
  let max = 6;
  if (difficulty === "hard") {
    min = 7;
    max = 12;
  }
  const count = Math.floor(Math.random() * (max - min + 1)) + min;

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
    advanceAfterWin(startMathGame);
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
  clearTimeout(nextQuestionTimer);
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
    "<button onclick=\"checkLetter('" + choices[0] + "')\">" + choices[0] + "</button>" +
    "<button onclick=\"checkLetter('" + choices[1] + "')\">" + choices[1] + "</button>" +
    "<button onclick=\"checkLetter('" + choices[2] + "')\">" + choices[2] + "</button>" +
    "<p id='feedback'></p>";
}

// Recipe that runs when a letter button is clicked
// (chosen is the letter written on the button that was tapped)
function checkLetter(chosen) {
  if (chosen === correctLetter) {
    document.getElementById("feedback").innerHTML = "🎉 Correct! Great job!";
    addPoint();
    advanceAfterWin(startReadingGame);
  } else {
    document.getElementById("feedback").innerHTML = "Try again! 💪";
  }
}

function startAdditionGame() {
  clearTimeout(nextQuestionTimer);
  // Easy: 1-5 + 1-5. Hard: 6-12 + 6-12.
  let min = 1;
  let max = 5;
  if (difficulty === "hard") {
    min = 6;
    max = 12;
  }
  const a = Math.floor(Math.random() * (max - min + 1)) + min;
  const b = Math.floor(Math.random() * (max - min + 1)) + min;
  const answer = a + b;

  // Show the question
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = "<h2>What is " + a + " + " + b + "?</h2>";
  gameDiv.innerHTML += '<p id="choices"></p><p id="feedback"></p>';

  // 4 choices: the right answer plus 3 close-but-wrong ones
  let choices = [answer, answer - 1, answer + 1, answer + 2];
  // Shuffle so the answer isn't always first
  choices.sort(() => Math.random() - 0.5);

  showChoices(choices, "checkAdditionAnswer", answer);
}

function checkAdditionAnswer(choice, correctAnswer) {
  if (choice === correctAnswer) {
    document.getElementById("feedback").innerHTML = "🎉 Correct! Amazing!";
    addPoint();
    advanceAfterWin(startAdditionGame);
  } else {
    document.getElementById("feedback").innerHTML = "Try again! 💪";
  }
}

// Recipe that runs when the Missing Letter button is clicked
function startMissingLetterGame() {
  clearTimeout(nextQuestionTimer);
  // Pick a random word from the list
  const pick = words[Math.floor(Math.random() * words.length)];
  const word = pick.word.toUpperCase();

  // Hide one random letter (never the first, so there's always a hint)
  const hideAt = 1 + Math.floor(Math.random() * (word.length - 1));
  const missing = word[hideAt];

  // Build the word with a blank, like: C _ T
  let display = "";
  for (let i = 0; i < word.length; i++) {
    if (i === hideAt) {
      display += "_ ";
    } else {
      display += word[i] + " ";
    }
  }

  // Show the question
  const gameDiv = document.getElementById("game");
  gameDiv.innerHTML = "<h2>Which letter is missing?</h2>";
  gameDiv.innerHTML += "<p class='big'>" + pick.emoji + "</p>";
  gameDiv.innerHTML += "<p class='big'>" + display + "</p>";
  gameDiv.innerHTML += '<p id="choices"></p><p id="feedback"></p>';

  // The missing letter + 3 random different letters, mixed up
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let choices = [missing];
  while (choices.length < 4) {
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!choices.includes(letter)) {
      choices.push(letter);
    }
  }
  choices.sort(() => Math.random() - 0.5);

  showChoices(choices, "checkMissingLetter", missing);
}

// Recipe that runs when a missing-letter button is clicked
function checkMissingLetter(choice, correctAnswer) {
  if (choice === correctAnswer) {
    document.getElementById("feedback").innerHTML = "🎉 Correct! Amazing!";
    addPoint();
    advanceAfterWin(startMissingLetterGame);
  } else {
    document.getElementById("feedback").innerHTML = "Try again! 💪";
  }
}

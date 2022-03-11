var key = "b03566fdccd95fe5202b5372365d55f2";
var root = document.getElementById("root");
var life = document.getElementById("life");
var message = document.getElementById("message");
var greeting = document.getElementsByClassName("greeting")[0];
var hintWrapper = document.getElementsByClassName("hint-message")[0];
var hintMessage = document.getElementById("hint-message");
var hint = document.getElementById("hint");
var hintClose = document.getElementById("closebtn");

var guessedWord = {
  unKnownLetters: [],
  letters: [],
  fullTitle: "",
  overview: "",
  release_date: "",
  popularity: 0,
};
var lifeCount = 0;
var hintCount = 5;

// starts area

hint.innerText = hintCount;

const start = () => {
  greeting.style.display = "none";
  message.style.display = "none";
  root.innerHTML = "";
  var randomPage = Math.floor(Math.random() * 100) * 5 + 1;
  baseUrl = `https://api.themoviedb.org/3/discover/movie?/sort_by=popularity.desc&api_key=${key}&language=en-US&page=${randomPage}`;
  try {
    axios.get(baseUrl).then((res) => insertToWord(res.data));
  } catch (error) {
    console.error(err);
  }
};

function insertToWord({ results }) {
  guessedWord.unKnownLetters = [];
  var randomItem = Math.floor(Math.random() * 10) * 2;
  guessedWord.fullTitle = results?.[randomItem]?.title ?? "";
  var letters = results?.[randomItem]?.title?.split(/(?!$)/u);
  guessedWord.overview = results?.[randomItem].overview;
  guessedWord.release_date = results?.[randomItem].release_date;
  guessedWord.popularity = results?.[randomItem].popularity;
  guessedWord.letters = letters;
  lifeCount = Math.floor(letters.length / 4);
  hintMessage.innerText = guessedWord.overview;
  getReady(letters);
}

function getReady(array) {
  for (let i = 0; i < array.length; i++) {
    const letter = array[i];
    if (letter == " ") {
      root.innerHTML += " ";
      guessedWord.unKnownLetters.push(" ");
    } else {
      root.innerHTML += "_";
      guessedWord.unKnownLetters.push("_");
    }
  }
  life.innerHTML = lifeCount;
}

// check area

function check(e) {
  if (lifeCount > 0) {
    var inputLetter = e.innerText;
    if (
      guessedWord.letters.includes(inputLetter.toUpperCase()) ||
      guessedWord.letters.includes(inputLetter.toLowerCase())
    ) {
      replace(inputLetter);
    } else {
      decreaseLife();
    }
  } else {
    message.style.display = "inline-block";
    message.innerHTML = `You miss 😐, let's skip and try one more time 😊`;
  }
}

function replace(text) {
  for (let i = 0; i < guessedWord.letters.length; i++) {
    const element = guessedWord.letters[i];
    if (element == text.toLowerCase()) {
      guessedWord.unKnownLetters.splice(i, 1, element);
    } else if (element == text.toUpperCase()) {
      guessedWord.unKnownLetters.splice(i, 1, element);
    }
    root.innerHTML = guessedWord.unKnownLetters.join("");
    if (guessedWord.unKnownLetters.join("") == guessedWord.fullTitle) {
      alert("You found!");
    }
  }
}

//  life methods

function decreaseLife() {
  if (lifeCount > 0) {
    lifeCount--;
    life.innerHTML = lifeCount;
  } else {
    message.innerHTML = `<h2>You are dead</h2>`;
  }
}

function increaseLife() {
  lifeCount++;
  life.innerHTML = lifeCount;
}

// hint

function showHint() {
  if (hintCount > 0) {
    hintCount--;
    hint.innerText = hintCount;
    hintWrapper.style.left = "10px";
  }
}

function hideHint() {
  hintWrapper.style.left = "-50%";
}

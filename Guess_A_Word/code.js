
const WORDCHOICES = [
  ['banana', 'pear', 'orange', 'apple', 'blueberry'], 
  ['mystic', 'controller', 'substance', 'ornary', 'gigantic'], 
  ['scrumptuous', 'stolen', 'contribute', 'teller', 'scolding'],
  ['money', 'blended', 'narcotics', 'memory', 'details'],
  ['slugworth', 'wonka', 'gobstopper', 'ticket', 'chocolate', 'factory']];


  document.addEventListener('DOMContentLoaded', event => {
    //HTML containers for various content in Game
    let message = document.querySelector('#message');
    let letters = document.querySelector('#spaces');
    let guesses = document.querySelector('#guesses');
    let apples = document.querySelector('#apples');
    let replay = document.querySelector('#replay');

    //generate a random word and remove that chosen word from the given array
    let randomWord = (function() {
      let wordArray = WORDCHOICES[Math.floor(Math.random()*WORDCHOICES.length)];
    
      function reduceArray() {
        let unusedWords = [],
            args = Array.prototype.slice.call(arguments);

          wordArray.forEach(word => {
            if (args.indexOf(word) === -1) {
              unusedWords.push(word)
            }
          })
        return unusedWords;
      };

      return function() {
        let randomIndex = Math.floor(Math.random() * wordArray.length);
        let word = wordArray[randomIndex];
        wordArray = reduceArray(word); //reduces the size of word array through reassignment
        return word;
      }
    })();

function Game() {
    this.word = randomWord();
    this.incorrectGuesses = 0;
    this.lettersGuessed = [];
    this.correctSpaces = 0;

    if (!this.word) {
      this.displayMessage('Sorry I have run out of words! Please refresh the page to continue.');
    }

    this.word = this.word.split('');
    this.init();
  };

  Game.prototype = {
    guesses: 6,
    createBlanks: function() {
      let spaces = (new Array(this.word.length + 1)).join("<span></span>");

      let spans = letters.querySelectorAll("span");
      spans.forEach(span => {
        span.parentNode.removeChild(span);
      });
      letters.insertAdjacentHTML('beforeend', spaces);
      this.spaces = document.querySelectorAll("#spaces span");
    },
    fillBlanksFor: function(letter) {
      var self = this;

      this.word.forEach(function(l, i) {
        if (letter === l) {
          self.spaces[i].textContent = letter;
          self.correctSpaces++;
        }
      });
    },
    emptyGuesses: function() {
      let spans = guesses.querySelectorAll('span');
      spans.forEach(span => {
        span.parentNode.removeChild(span);
      });
    },
    renderGuess: function(letter) {
      let span = document.createElement("span");
      span.textContent = letter;
      guesses.appendChild(span);
    },
    renderIncorrectGuess: function(letter) {
      this.incorrectGuesses++;
      this.renderGuess(letter);
      this.setClass();
    },
    duplicateGuess: function(letter) {
      let duplicate = this.lettersGuessed.indexOf(letter) !== -1;

      if (!duplicate) { this.lettersGuessed.push(letter); }

      return duplicate;
    },
    setClass: function() {
      apples.classList.remove(...apples.classList);
      apples.classList.add("guess_" + this.incorrectGuesses);
    },
    displayMessage: function(text) {
      message.textContent = text;
    },
    showReplayLink: function() {
      replay.classList.add("visible");
    },
    hideReplayLink: function() {
      replay.classList.remove("visible");
    },
    processGuess: function(e) {
      let letter = e.key;
      if (notALetter(letter)) { return; }
      if (this.duplicateGuess(letter)) { return; }

      if (this.word.includes(letter)) {
        this.fillBlanksFor(letter);
        this.renderGuess(letter);

        if (this.correctSpaces === this.spaces.length) {
          this.win();
        }
      } else {
        this.renderIncorrectGuess(letter);
      }
      if (this.incorrectGuesses === this.guesses) {
        this.lose();
      }
    },
    win: function() {
      this.unbind();
      this.displayMessage("You win!");
      this.showReplayLink();
      this.setGameStatus("win");
    },
    lose: function() {
      this.unbind();
      this.displayMessage("Sorry! You're out of guesses");
      this.showReplayLink();
      this.setGameStatus("lose");
    },
    setGameStatus: function(status) {
      document.body.classList.remove('win', 'lose');
      if (status) {
        document.body.classList.add(status);
      }
    },
    bind: function() {
      this.processGuessHandler = (e) => this.processGuess(e);
      document.addEventListener("keyup", this.processGuessHandler);
    },
    unbind: function() {
      document.removeEventListener("keyup", this.processGuessHandler);
    },
    init: function() {
      this.bind();
      this.setClass();
      this.hideReplayLink();
      this.emptyGuesses();
      this.createBlanks();
      this.setGameStatus();
      this.displayMessage("");
    }
  };

  function notALetter(letter) {
    return letter < 'a' || letter > 'z';
  }

  new Game();

  replay.addEventListener("click", function(e) {
    e.preventDefault();
    new Game();
  });

});
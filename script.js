import Deck from "./deck.js"

const totalPoints = document.querySelector(".point-total")
const pointMultiplier = document.querySelector(".point-multiplier")
const board = document.querySelector(".board")
const combo = document.querySelector(".combo")
const rules = document.getElementById("rules")

let points = 0;
let multiplier = 1;
let suit = '';

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard
let firstCardValue, secondCardValue;
let firstValue, secondValue;
let firstSuit, secondSuit;
let color1, color2;

let oneDeck;

const selections = document.querySelectorAll(".selection")
selections.forEach(selection => selection.addEventListener('click', () => {
  let deckBool = (selection.id === 'true')
  oneDeck = deckBool;
  deckBool ? document.getElementById("ruleText").textContent = "color" : document.getElementById("ruleText").textContent = "suit";
  
  startGame();
}));

function startGame() {
  rules.removeAttribute("hidden")
  createDeck(oneDeck);
  
  if (oneDeck) {
    board.style.height = "60%"
  }

  totalPoints.innerText = "Points: " + points
  pointMultiplier.innerText = "Multiplier: " + multiplier
  combo.innerText = "Match a pair to start a combo!"

  const cards = document.querySelectorAll(".flip-card")
  cards.forEach(card => card.addEventListener('click', flipCard));
}

function createDeck(oneDeck) {
  const deck = new Deck(oneDeck);
  deck.shuffle()

  for (let i = 0; i < deck.cards.length; i++) {
    let card = deck.cards[i].getHTML();
    board.appendChild(card)
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    // first click
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  // second click
  secondCard = this;

  checkForMatch();
}

function checkForMatch() {
  // i'm not sure how to get the dataset values out of the inner divs
  // so i'm doing this weird string/array manipulation thing instead
  // i feel like this is such a mess lmao i'm sure i'll find a better way at some point

  firstCardValue = firstCard.innerHTML.slice(firstCard.innerHTML.length - 13, firstCard.innerHTML.length - 9).replace('"', '').split(' ')
  secondCardValue = secondCard.innerHTML.slice(secondCard.innerHTML.length - 13, secondCard.innerHTML.length - 9).replace('"', '').split(' ')

  firstValue = firstCardValue[0]
  secondValue = secondCardValue[0]
  firstSuit = firstCardValue[1]
  secondSuit = secondCardValue[1]

  color1 = firstSuit === "♠" || firstSuit === "♣" ? "black" : "red"
  color2 = secondSuit === "♦" || secondSuit === "♥" ? "red" : "black"

  let isMatch = oneDeck ? (firstValue === secondValue) && (color1 === color2) : (firstValue === secondValue) && (firstSuit === secondSuit)

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  addPoints()
  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function addPoints() {
  // there's probably a better way to write this but i'll just do this for now
  if (oneDeck) {
    if (suit === color1) {
      convertValue()
      multiplier += 1
    } else {
      suit = color1
      multiplier = 1
      combo.innerText = "Current color: " + suit
      convertValue();
    }
  } else {
      if (suit === firstSuit) {
      convertValue()
      multiplier += 1;
    } else {
      suit = firstSuit
      multiplier = 1;
      combo.innerText = "Current suit: " + suit
      convertValue();
    }
  }
  
  totalPoints.innerText = "Points: " + points
  pointMultiplier.innerText = "Multiplier: " + multiplier
} 

function convertValue() {
  if (firstValue === 'A') {
    points += 1 * multiplier
  } else if (firstValue === 'K') {
    points += 13 * multiplier
  } else if (firstValue === 'Q') {
    points += 12 * multiplier
  } else if (firstValue === 'J') {
    points += 11 * multiplier
  } else {
    points += firstValue * multiplier
  }
}
import Deck from "./deck.js"

const totalPoints = document.querySelector(".point-total")
const pointMultiplier = document.querySelector(".point-multiplier")
const board = document.querySelector(".board")
const combo = document.querySelector(".combo")

let points = 0;
let multiplier = 1.0;
let suit = '';

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let firstCardValue, secondCardValue;

function startGame() {
  const deck = new Deck()
  deck.shuffle()

  for (let i = 0; i < deck.cards.length; i++) {
    let card = deck.cards[i]
    board.appendChild(card.getHTML())
  }

  totalPoints.innerText = "Points: " + points
  pointMultiplier.innerText = "Multiplier: " + multiplier
  combo.innerText = "Match a pair to start a combo!"

  const cards = document.querySelectorAll(".flip-card")
  cards.forEach(card => card.addEventListener('click', flipCard));
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

  // this seems easier than the other methods i've found to compare arrays so i'm going with this ok 

  let isMatch = firstCardValue[0] === secondCardValue[0] && firstCardValue[1] === secondCardValue[1]

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
  if (suit === firstCardValue[1]) {
    multiplier += .5;
  } else {
    suit = firstCardValue[1]
    multiplier = 1;
    combo.innerText = "Current suit: " + suit
  }

  if (firstCardValue[0] === 'A') {
    points += 1 * multiplier
  } else if (firstCardValue[0] === 'K') {
    points += 13 * multiplier
  } else if (firstCardValue[0] === 'Q') {
    points += 12 * multiplier
  } else if (firstCardValue[0] === 'J') {
    points += 11 * multiplier
  } else {
    points += firstCardValue[0] * multiplier
  }
  
  totalPoints.innerText = "Points: " + points
  pointMultiplier.innerText = "Multiplier: " + multiplier
} 

startGame()
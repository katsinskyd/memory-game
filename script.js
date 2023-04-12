import Deck from "./deck.js"
import openModal from "./modals.js"

const totalPoints = document.querySelector(".point-total")
const pointMultiplier = document.querySelector(".point-multiplier")
const board = document.querySelector(".board")
const pointsBox = document.querySelector(".points-box")
const combo = document.querySelector(".combo")
const pageBackground = document.getElementById("pageBackground")
const title = document.getElementById("modalTitle")
const endResult = document.getElementById("endResult")

pageBackground.addEventListener("input", () => {
  document.body.style.backgroundColor = pageBackground.value;
})

let points = 0;
let multiplier = 1;
let suit = '';

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let firstCardValue, secondCardValue;
let firstValue, secondValue;
let firstSuit, secondSuit;
let color1, color2;

let oneDeck;
let numMatches;

const selections = document.querySelectorAll(".selection")
selections.forEach(selection => selection.addEventListener('click', () => {
  let deckBool = (selection.id === 'true');
  oneDeck = deckBool;
  document.getElementById("ruleText").textContent = deckBool ? "color" : "suit"
  
  startGame();
}));

function startGame() {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }

  pointsBox.removeAttribute("hidden");
  createDeck(oneDeck);
  
  board.style.height = oneDeck ? "60%" : "90%"
  numMatches = oneDeck ? 26 : 52

  const cards = document.querySelectorAll(".flip-card");
  cards.forEach(card => card.addEventListener('click', flipCard));

  points = 0;
  multiplier = 1;
  totalPoints.innerText = "Points: " + points
  pointMultiplier.innerText = "Multiplier: " + multiplier
  combo.innerText = "Match a pair to start a combo!";

  title.innerHTML = "Which Mode Would You Like To Play?"
  endResult.setAttribute("hidden", '')
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
  if (suit === color1 || suit === firstSuit) {
    convertValue()
    multiplier += 1
    } else {
      multiplier = 1
        if (oneDeck) {
          suit = color1
          combo.innerText = "Current color: " + suit
        } else {
          suit = firstSuit
          combo.innerText = "Current suit: " + suit
        }
      convertValue();
  }

  totalPoints.innerText = "Points: " + points
  pointMultiplier.innerText = "Multiplier: " + multiplier
  numMatches--

  if (numMatches == 0) {
    const finalScore = document.getElementById('finalScore')
    finalScore.innerText = points

    title.innerHTML = "Congratulations!"
    endResult.removeAttribute("hidden")
    const modal = document.getElementById("selectionModal")
    openModal(modal)
  }
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

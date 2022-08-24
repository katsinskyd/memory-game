const SUITS = ["♠", "♦", "♣", "♥", "♠", "♦", "♣", "♥"]
const VALUES = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K"
]

export default class Deck {
    constructor(oneDeck) {
        this.cards = freshDeck(oneDeck);

        if (oneDeck) {
            let singleDeck = this.cards.filter((value, index) => {
              const _value = JSON.stringify(value);
              return index === this.cards.findIndex(obj => {
                return JSON.stringify(obj) === _value;
              });
            });
            this.cards = singleDeck;
          }
    }

    get numberOfCards() {
        return this.cards.length
    }

    shuffle() {
        for (let i = this.numberOfCards - 1; i > 0; i--) {
            const newIndex = Math.floor(Math.random()* (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }
}

class Card {
    constructor(suit, value, oneDeck) {
        this.suit = suit
        this.value = value
        this.oneDeck = oneDeck
    }

    get color() {
        if (this.suit === "♠") {
            return 'black'
        } else if (this.suit === "♣") {
            return this.oneDeck ? 'black' : 'green'
        } else if (this.suit === "♦") {
            return this.oneDeck ? 'red' : 'blue'
        } else {
            return 'red'
        }
    }

    getHTML() {
        const cardDiv = document.createElement('div')

        cardDiv.classList.add("flip-card")
        cardDiv.innerHTML = `
            <div class = "flip-card-front"></div>
            <div class = "flip-card-back ${this.color}" data-card = "${this.value} ${this.suit}">${this.suit}</div>`

        return cardDiv
    }
}

function freshDeck(oneDeck) {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit, value, oneDeck)
        })
    })
}
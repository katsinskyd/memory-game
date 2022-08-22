const SUITS = ["♠", "♦", "♣", "♥"]
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
    "K",
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
    constructor(cards = freshDeck()) {
        this.cards = cards
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
    constructor(suit, value) {
        this.suit = suit
        this.value = value
    }

    get color() {
        if (this.suit === "♠") {
            return 'black'
        } else if (this.suit === "♣") {
            return 'green'
        } else if (this.suit === "♦") {
            return 'blue'
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

function freshDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit, value)
        })
    })
}
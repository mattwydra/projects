// Memory Match Game Logic
const gameContainer = document.getElementById('game-container');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const restartButton = document.getElementById('restart');

// Icons using text representations
const icons = ['♠', '♣', '♥', '♦', '★', '✿', '♫', '✈'];
let cards = [];
let flippedCards = [];
let moves = 0;
let matches = 0;
let canFlip = true;

// Initialize game
function initGame() {
    // Reset game state
    flippedCards = [];
    moves = 0;
    matches = 0;
    canFlip = true;
    movesDisplay.textContent = moves;
    matchesDisplay.textContent = matches;
    gameContainer.innerHTML = '';

    // Create paired cards with icons
    cards = [...icons, ...icons]
        .sort(() => Math.random() - 0.5)
        .map((icon, index) => ({
            id: index,
            icon: icon,
            flipped: false,
            matched: false
        }));

    // Create card elements
    cards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = card.id;

        const iconElement = document.createElement('span');
        iconElement.classList.add('icon');
        iconElement.textContent = card.icon;

        cardElement.appendChild(iconElement);
        cardElement.addEventListener('click', () => flipCard(card.id));
        gameContainer.appendChild(cardElement);
    });
}

// Flip card logic
function flipCard(id) {
    const card = cards.find(card => card.id === id);
    const cardElement = document.querySelector(`.card[data-id="${id}"]`);

    // Prevent flipping if game is locked, card is already flipped or matched
    if (!canFlip || card.flipped || card.matched) return;

    // Flip the card
    card.flipped = true;
    cardElement.classList.add('flipped');
    flippedCards.push(card);

    // Check for match when 2 cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;

        // Check if the two flipped cards match
        if (flippedCards[0].icon === flippedCards[1].icon) {
            // Match found
            flippedCards.forEach(card => {
                card.matched = true;
                document.querySelector(`.card[data-id="${card.id}"]`).classList.add('matched');
            });
            matches++;
            matchesDisplay.textContent = matches;
            flippedCards = [];

            // Check for game completion
            if (matches === icons.length) {
                setTimeout(() => {
                    alert(`Congratulations! You completed the game in ${moves} moves!`);
                }, 500);
            }
        } else {
            // No match, flip back after delay
            canFlip = false;
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.flipped = false;
                    document.querySelector(`.card[data-id="${card.id}"]`).classList.remove('flipped');
                });
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }
}

// Restart game
restartButton.addEventListener('click', initGame);

// Start the game
initGame();
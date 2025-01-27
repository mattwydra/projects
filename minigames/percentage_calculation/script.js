let score = 0;
let questions = 0;
const totalQuestions = 10;
let currentStreak = 0; // Tracks the current streak
let highestStreak = 0; // Tracks the highest streak
const scores = []; // Array to store player scores

// Helper function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a percentage question
function generateQuestion() {
    const percentage = getRandomInt(10, 50); // Random percentage (10-50%)
    const total = getRandomInt(100, 500); // Random total (100-500)
    const correctAnswer = Math.round((percentage / 100) * total);

    return {
        question: `What is ${percentage}% of ${total}?`,
        correctAnswer,
        choices: generateChoices(correctAnswer),
    };
}

// Generate multiple-choice answers
function generateChoices(correctAnswer) {
    const choices = new Set();
    choices.add(correctAnswer);
    while (choices.size < 4) {
        const randomOffset = getRandomInt(-20, 20);
        const fakeAnswer = correctAnswer + randomOffset;
        if (fakeAnswer > 0) choices.add(fakeAnswer);
    }
    return Array.from(choices).sort(() => Math.random() - 0.5); // Shuffle choices
}

// Render the game UI
function renderGame() {
    if (questions >= totalQuestions) {
        endGame();
        return;
    }

    const { question, correctAnswer, choices } = generateQuestion();

    // Display the question
    document.getElementById('question').textContent = question;

    // Display the choices
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices
    choices.forEach((choice) => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('choice');
        button.addEventListener('click', () => {
            const result = document.getElementById('result');
            if (choice === correctAnswer) {
                result.textContent = 'Correct!';
                result.style.color = 'green';
                score++;
                currentStreak++;
                highestStreak = Math.max(highestStreak, currentStreak);
            } else {
                result.textContent = `Wrong! The correct answer was ${correctAnswer}.`;
                result.style.color = 'red';
                currentStreak = 0; // Reset the streak
            }
            questions++;
            setTimeout(renderGame, 1000); // Load new question after 1 second
        });
        choicesContainer.appendChild(button);
    });

    // Update the score and streak display
    document.getElementById('score').textContent = `Score: ${score}/${questions} | Streak: ${currentStreak}`;
    document.getElementById('result').textContent = ''; // Clear the result
}

// End the game
function endGame() {
    document.getElementById('game-container').style.display = 'none';
    const endScreen = document.getElementById('end-screen');
    endScreen.style.display = 'block';
    document.getElementById('final-score').textContent = `Your final score is ${score}/${totalQuestions}.`;
    const streakMessage = `Your highest streak was ${highestStreak}!`;
    document.getElementById('final-score').textContent += ` ${streakMessage}`;
}

// Save the score
document.getElementById('save-score').addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value.trim();
    if (playerName) {
        scores.push({ name: playerName, score, highestStreak });
        alert(`Score saved!`);
        document.getElementById('player-name').value = '';
    } else {
        alert('Please enter your name.');
    }
});

// Restart the game
document.getElementById('play-again').addEventListener('click', () => {
    score = 0;
    questions = 0;
    currentStreak = 0;
    highestStreak = 0;
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('end-screen').style.display = 'none';
    renderGame();
});

// Initialize the game
renderGame();

// Dark/Light Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    themeToggle.textContent = document.body.classList.contains('theme-dark')
        ? 'Switch to Light Mode'
        : 'Switch to Dark Mode';
});

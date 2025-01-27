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
        choices: generateChoices(correctAnswer)
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
    const { question, correctAnswer, choices } = generateQuestion();

    // Display the question
    document.getElementById('question').textContent = question;

    // Display the choices
    const choicesContainer = document.getElementById('choices');
    choicesContainer.innerHTML = ''; // Clear previous choices
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('choice');
        button.addEventListener('click', () => {
            const result = document.getElementById('result');
            if (choice === correctAnswer) {
                result.textContent = 'Correct!';
                result.style.color = 'green';
            } else {
                result.textContent = `Wrong! The correct answer was ${correctAnswer}.`;
                result.style.color = 'red';
            }
            setTimeout(renderGame, 2000); // Load new question after 2 seconds
        });
        choicesContainer.appendChild(button);
    });

    // Clear the result display
    document.getElementById('result').textContent = '';
}

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

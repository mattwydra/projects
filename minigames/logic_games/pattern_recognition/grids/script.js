document.addEventListener('DOMContentLoaded', function () {
    // Game state
    const gameState = {
        level: 1,
        score: 0,
        patternCells: [],
        userSelectedCells: [],
        patternVisible: false,
        gameStarted: false,
        timerInterval: null,
        timeRemaining: 5,
        gridSize: 4
    };

    // DOM elements
    const patternContainer = document.getElementById('pattern-container');
    const gridContainer = document.getElementById('grid-container');
    const levelDisplay = document.getElementById('level');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const feedbackEl = document.getElementById('feedback');
    const startBtn = document.getElementById('start-btn');
    const showPatternBtn = document.getElementById('show-pattern-btn');
    const submitBtn = document.getElementById('submit-btn');
    const nextBtn = document.getElementById('next-btn');

    // Initialize UI state
    showPatternBtn.style.display = 'none';
    submitBtn.style.display = 'none';

    // Generate the pattern and grid containers
    function initializeGame() {
        // Generate pattern cells
        patternContainer.innerHTML = '';
        for (let i = 0; i < gameState.gridSize * gameState.gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('pattern-cell');
            cell.dataset.index = i;
            patternContainer.appendChild(cell);
        }

        // Generate grid cells
        gridContainer.innerHTML = '';
        for (let i = 0; i < gameState.gridSize * gameState.gridSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.dataset.index = i;
            cell.addEventListener('click', toggleCell);
            gridContainer.appendChild(cell);
        }

        // Hide the pattern initially
        patternContainer.style.display = 'none';
        gridContainer.style.display = 'none';
    }

    // Generate a random pattern based on level
    function generatePattern() {
        gameState.patternCells = [];
        gameState.userSelectedCells = [];

        // Number of cells to highlight increases with level
        const numCells = Math.min(3 + Math.floor(gameState.level / 2), 12);

        const totalCells = gameState.gridSize * gameState.gridSize;
        const allCells = Array.from({ length: totalCells }, (_, i) => i);

        // Shuffle array and take first numCells elements
        for (let i = allCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
        }

        gameState.patternCells = allCells.slice(0, numCells);

        // Update pattern display
        const patternCellEls = patternContainer.querySelectorAll('.pattern-cell');
        patternCellEls.forEach(cell => cell.classList.remove('highlighted'));

        gameState.patternCells.forEach(index => {
            patternCellEls[index].classList.add('highlighted');
        });
    }

    // Toggle cell selection
    function toggleCell(event) {
        if (!gameState.gameStarted) return;

        const cell = event.target;
        const index = parseInt(cell.dataset.index);

        if (cell.classList.contains('active')) {
            cell.classList.remove('active');
            gameState.userSelectedCells = gameState.userSelectedCells.filter(i => i !== index);
        } else {
            cell.classList.add('active');
            gameState.userSelectedCells.push(index);
        }
    }

    // Check if user pattern matches the generated pattern
    function checkPattern() {
        const correct = gameState.patternCells.length === gameState.userSelectedCells.length &&
            gameState.patternCells.every(cell => gameState.userSelectedCells.includes(cell));

        const gridCells = gridContainer.querySelectorAll('.grid-cell');

        if (correct) {
            // Highlight correct cells
            gameState.userSelectedCells.forEach(index => {
                gridCells[index].classList.add('correct');
            });

            // Update score and show feedback
            gameState.score += gameState.level * 10;
            scoreDisplay.textContent = gameState.score;
            feedbackEl.textContent = 'Correct! Great job!';
            feedbackEl.className = 'feedback correct-feedback';

            // Enable next level button
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
            showPatternBtn.style.display = 'none';
        } else {
            // Show correct and incorrect cells
            gridCells.forEach(cell => {
                const index = parseInt(cell.dataset.index);

                if (gameState.patternCells.includes(index) && gameState.userSelectedCells.includes(index)) {
                    // Correctly selected
                    cell.classList.add('correct');
                } else if (gameState.patternCells.includes(index) && !gameState.userSelectedCells.includes(index)) {
                    // Should have been selected
                    cell.classList.add('solution');
                } else if (!gameState.patternCells.includes(index) && gameState.userSelectedCells.includes(index)) {
                    // Incorrectly selected
                    cell.classList.add('incorrect');
                }
            });

            // Show feedback
            feedbackEl.textContent = 'Incorrect. Try again on the next level.';
            feedbackEl.className = 'feedback incorrect-feedback';

            // Enable next level button
            nextBtn.style.display = 'inline-block';
            submitBtn.style.display = 'none';
            showPatternBtn.style.display = 'inline-block';
        }
    }

    // Start the game
    function startGame() {
        gameState.gameStarted = true;
        gameState.patternVisible = true;
        gameState.timeRemaining = 5 + Math.min(gameState.level, 5);

        // Reset UI
        startBtn.style.display = 'none';
        showPatternBtn.style.display = 'none';
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';

        // Show pattern
        patternContainer.style.display = 'grid';
        gridContainer.style.display = 'none';

        // Generate new pattern
        generatePattern();

        // Start timer
        timeDisplay.textContent = gameState.timeRemaining;
        gameState.timerInterval = setInterval(updateTimer, 1000);
    }

    // Update timer
    function updateTimer() {
        gameState.timeRemaining--;
        timeDisplay.textContent = gameState.timeRemaining;

        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timerInterval);
            hidePattern();
        }
    }

    // Hide pattern and show grid for user input
    function hidePattern() {
        gameState.patternVisible = false;
        patternContainer.style.display = 'none';
        gridContainer.style.display = 'grid';

        // Reset grid cells
        const gridCells = gridContainer.querySelectorAll('.grid-cell');
        gridCells.forEach(cell => {
            cell.classList.remove('active', 'correct', 'incorrect', 'solution');
        });

        gameState.userSelectedCells = [];

        // Show controls
        showPatternBtn.style.display = 'inline-block';
        submitBtn.style.display = 'inline-block';
    }

    // Show pattern temporarily
    function showPattern() {
        if (gameState.patternVisible) return;

        patternContainer.style.display = 'grid';
        gridContainer.style.display = 'none';

        // Hide pattern after a short time
        setTimeout(() => {
            patternContainer.style.display = 'none';
            gridContainer.style.display = 'grid';
        }, 1000);
    }

    // Move to next level
    function nextLevel() {
        gameState.level++;
        levelDisplay.textContent = gameState.level;

        // Reset UI
        nextBtn.style.display = 'none';
        startBtn.style.display = 'inline-block';
        feedbackEl.textContent = '';
        feedbackEl.className = 'feedback';

        // Hide containers
        patternContainer.style.display = 'none';
        gridContainer.style.display = 'none';
    }

    // Event listeners
    startBtn.addEventListener('click', startGame);
    showPatternBtn.addEventListener('click', showPattern);
    submitBtn.addEventListener('click', checkPattern);
    nextBtn.addEventListener('click', nextLevel);

    // Initialize game
    initializeGame();
});
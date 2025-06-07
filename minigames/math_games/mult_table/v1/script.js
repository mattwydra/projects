let currentProblem = {};
        let stats = {
            correct: 0,
            incorrect: 0,
            streak: 0,
            maxStreak: 0
        };

        function generateProblem() {
            const num1 = Math.floor(Math.random() * 11);
            const num2 = Math.floor(Math.random() * 11);
            currentProblem = {
                num1: num1,
                num2: num2,
                answer: num1 * num2
            };
            
            document.getElementById('problem').textContent = `${num1} × ${num2} = ?`;
            document.getElementById('answer').value = '';
            document.getElementById('feedback').textContent = '';
            document.getElementById('feedback').className = 'feedback';
        }

        function checkAnswer() {
            const userAnswer = parseInt(document.getElementById('answer').value);
            const feedback = document.getElementById('feedback');
            
            if (isNaN(userAnswer)) {
                feedback.textContent = 'Please enter a number!';
                feedback.className = 'feedback incorrect';
                return;
            }
            
            if (userAnswer === currentProblem.answer) {
                feedback.textContent = '🎉 Correct!';
                feedback.className = 'feedback correct';
                stats.correct++;
                stats.streak++;
                stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
                setTimeout(nextProblem, 1500);
            } else {
                feedback.textContent = `❌ Wrong! The answer is ${currentProblem.answer}`;
                feedback.className = 'feedback incorrect';
                stats.incorrect++;
                stats.streak = 0;
                setTimeout(nextProblem, 2500);
            }
            
            updateStats();
        }

        function nextProblem() {
            generateProblem();
            document.getElementById('answer').focus();
        }

        function updateStats() {
            document.getElementById('correct').textContent = stats.correct;
            document.getElementById('incorrect').textContent = stats.incorrect;
            document.getElementById('streak').textContent = stats.streak;
        }

        function toggleTheme() {
            const body = document.body;
            const themeIcon = document.getElementById('theme-icon');
            const themeText = document.getElementById('theme-text');
            
            if (body.getAttribute('data-theme') === 'dark') {
                body.setAttribute('data-theme', 'light');
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Light Mode';
            } else {
                body.setAttribute('data-theme', 'dark');
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Dark Mode';
            }
        }

        // Handle Enter key press
        document.getElementById('answer').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });

        // Initialize the first problem
        generateProblem();
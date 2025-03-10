// static/dashboard.js
document.addEventListener('DOMContentLoaded', function () {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Game-specific modes
    const gameModes = {
        aim_trainer: ['Score', 'Time Attack'],
        cookie_clicker: ['Classic', 'Timed', 'Challenge'],
        cps: ['5s', '10s', '60s'],
        number_memory: ['Standard'],
        percentage_practice: ['Standard'],
        pixel_escape: ['Standard'],
        reaction_time: ['Standard'],
        typing_practice: ['Words', 'Quotes', 'Numbers', 'Custom']
    };

    // Populate game mode dropdowns based on selected game
    function updateGameModes(gameSelect, modeSelect) {
        const selectedGame = gameSelect.value;
        const modes = gameModes[selectedGame] || [];

        // Clear existing options
        modeSelect.innerHTML = '<option value="">All Modes</option>';

        // Add new options
        modes.forEach(mode => {
            const option = document.createElement('option');
            option.value = mode;
            option.textContent = mode;
            modeSelect.appendChild(option);
        });
    }

    // Leaderboard functionality
    const gameSelect = document.getElementById('game-select');
    const modeSelect = document.getElementById('mode-select');
    const loadLeaderboardBtn = document.getElementById('load-leaderboard');
    const leaderboardResults = document.getElementById('leaderboard-results');

    gameSelect.addEventListener('change', () => {
        updateGameModes(gameSelect, modeSelect);
    });

    loadLeaderboardBtn.addEventListener('click', () => {
        const game = gameSelect.value;
        const mode = modeSelect.value;

        // Show loading state
        leaderboardResults.innerHTML = '<p>Loading leaderboard...</p>';

        // Fetch leaderboard data
        let url = `/api/get_leaderboard/${game}`;
        if (mode) {
            url += `?game_mode=${mode}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    leaderboardResults.innerHTML = '<p>No scores available for this selection.</p>';
                    return;
                }

                // Create leaderboard table
                let tableHTML = `
                    <table class="scores-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Player</th>
                                <th>Score</th>
                `;

                // Add conditional headers
                if (data[0].reaction_time) tableHTML += '<th>Reaction Time</th>';
                if (data[0].accuracy) tableHTML += '<th>Accuracy</th>';
                if (data[0].time_survived) tableHTML += '<th>Time Survived</th>';

                tableHTML += `
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                // Add rows
                data.forEach((entry, index) => {
                    const playerName = entry.nickname || entry.username;

                    tableHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${playerName}</td>
                            <td>${entry.score}</td>
                    `;

                    if (entry.reaction_time) tableHTML += `<td>${entry.reaction_time}</td>`;
                    if (entry.accuracy) tableHTML += `<td>${entry.accuracy}%</td>`;
                    if (entry.time_survived) tableHTML += `<td>${entry.time_survived}s</td>`;

                    // Format date
                    const date = new Date(entry.created_at);
                    const formattedDate = date.toLocaleDateString();

                    tableHTML += `
                            <td>${formattedDate}</td>
                        </tr>
                    `;
                });

                tableHTML += `
                        </tbody>
                    </table>
                `;

                leaderboardResults.innerHTML = tableHTML;
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
                leaderboardResults.innerHTML = '<p>Error loading leaderboard. Please try again.</p>';
            });
    });

    // Progress tracking functionality
    const progressGameSelect = document.getElementById('progress-game-select');
    const progressModeSelect = document.getElementById('progress-mode-select');
    const loadProgressBtn = document.getElementById('load-progress');
    const progressChartContainer = document.getElementById('progress-chart-container');
    const noDataMessage = document.getElementById('no-data-message');
    let progressChart = null;

    progressGameSelect.addEventListener('change', () => {
        updateGameModes(progressGameSelect, progressModeSelect);
    });

    loadProgressBtn.addEventListener('click', () => {
        const game = progressGameSelect.value;
        const mode = progressModeSelect.value;
        const userId = getUserId(); // We'll need to implement this function

        // Show loading state
        if (progressChart) {
            progressChart.destroy();
        }
        noDataMessage.style.display = 'none';

        // Fetch user progress data
        let url = `/api/get_user_progress/${userId}/${game}`;
        if (mode) {
            url += `?game_mode=${mode}`;
        }

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length === 0) {
                    noDataMessage.style.display = 'block';
                    return;
                }

                // Create chart data
                const chartData = {
                    labels: data.map((entry, index) => `Game ${index + 1}`),
                    datasets: [{
                        label: 'Score',
                        data: data.map(entry => entry.score),
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        fill: true,
                        tension: 0.1
                    }]
                };

                // Add additional datasets if they exist
                if (data[0].reaction_time) {
                    chartData.datasets.push({
                        label: 'Reaction Time',
                        data: data.map(entry => entry.reaction_time),
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        hidden: true,
                        yAxisID: 'y1'
                    });
                }

                if (data[0].accuracy) {
                    chartData.datasets.push({
                        label: 'Accuracy',
                        data: data.map(entry => entry.accuracy),
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        hidden: true,
                        yAxisID: 'y2'
                    });
                }

                if (data[0].time_survived) {
                    chartData.datasets.push({
                        label: 'Time Survived',
                        data: data.map(entry => entry.time_survived),
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.2)',
                        hidden: true,
                        yAxisID: 'y3'
                    });
                }

                // Create chart options
                const chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                title: function (tooltipItems) {
                                    const idx = tooltipItems[0].dataIndex;
                                    return `Game ${idx + 1} - ${new Date(data[idx].created_at).toLocaleDateString()}`;
                                }
                            }
                        },
                        legend: {
                            position: 'top',
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Games Played'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Score'
                            }
                        }
                    }
                };

                // Add additional y-axes if needed
                if (data[0].reaction_time) {
                    chartOptions.scales.y1 = {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Reaction Time (ms)'
                        }
                    };
                }

                if (data[0].accuracy) {
                    chartOptions.scales.y2 = {
                        beginAtZero: true,
                        max: 100,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Accuracy (%)'
                        }
                    };
                }

                if (data[0].time_survived) {
                    chartOptions.scales.y3 = {
                        beginAtZero: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false
                        },
                        title: {
                            display: true,
                            text: 'Time Survived (s)'
                        }
                    };
                }

                // Create chart
                const ctx = document.getElementById('progress-chart').getContext('2d');
                progressChart = new Chart(ctx, {
                    type: 'line',
                    data: chartData,
                    options: chartOptions
                });
            })
            .catch(error => {
                console.error('Error fetching progress data:', error);
                noDataMessage.textContent = 'Error loading progress data. Please try again.';
                noDataMessage.style.display = 'block';
            });
    });

    // Helper function to get user ID from session
    function getUserId() {
        // In a real app, you might get this from a data attribute or session storage
        // For now, we'll assume it's available in the page as a data attribute
        const dashboardElement = document.querySelector('.container');
        return dashboardElement.dataset.userId || 1; // Fallback to ID 1 if not found
    }

    // Initialize mode dropdowns on page load
    updateGameModes(gameSelect, modeSelect);
    updateGameModes(progressGameSelect, progressModeSelect);
});
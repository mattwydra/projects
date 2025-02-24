const questionsUrl = 'https://raw.githubusercontent.com/mattwydra/projects/main/minigames/logic_games/questions.txt';
const answersUrl = 'https://raw.githubusercontent.com/mattwydra/projects/main/minigames/logic_games/answers.txt';

let riddles = [];
let answers = [];
let usedIndices = new Set();

async function loadRiddles() {
    const qResponse = await fetch(questionsUrl);
    const aResponse = await fetch(answersUrl);
    riddles = (await qResponse.text()).split('\n');
    answers = (await aResponse.text()).split('\n');
    nextRiddle();
}

function checkAnswer() {
    document.getElementById('feedback').innerText = answers[currentIndex];
}

function nextRiddle() {
    document.getElementById('ans-btn').style.display = 'inline-block';
    if (usedIndices.size === riddles.length) {
        // document.getElementById('ans-btn').innerHTML = "";
        document.getElementById('ans-btn').style.display = 'none';
        document.getElementById('feedback').innerText = "No more riddles! Click next to start again.";
        usedIndices.clear();
        return;
    }

    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * riddles.length);
    } while (usedIndices.has(newIndex));

    usedIndices.add(newIndex);
    currentIndex = newIndex;
    document.getElementById('riddle').innerText = riddles[currentIndex];
    document.getElementById('feedback').innerText = '';
}

loadRiddles();
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
    const body = document.body;
    const currentTheme = body.getAttribute("data-theme");

    if (currentTheme === "light") {
        body.setAttribute("data-theme", "dark");
    } else {
        body.setAttribute("data-theme", "light");
    }
});
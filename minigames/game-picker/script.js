const button = document.getElementById("pickBtn");
const textarea = document.getElementById("games");
const result = document.getElementById("result");

button.addEventListener("click", () => {

    const games = textarea.value
        .split("\n")
        .map(game => game.trim())
        .filter(game => game.length > 0);

    if(games.length === 0){
        result.textContent = "Add some games first!";
        return;
    }

    const randomGame = games[Math.floor(Math.random() * games.length)];

    result.textContent = `🎲 ${randomGame}`;
});

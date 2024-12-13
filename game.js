const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const startGameButton = document.getElementById("startGameButton");
const rollDiceButton = document.getElementById("rollDiceButton");
const rollIndividualButton = document.getElementById("rollIndividualButton");
const sumDiceButton = document.getElementById("sumDiceButton");
const endTurnButton = document.getElementById("endTurnButton");
const player1NameInput = document.getElementById("player1Name");
const player2NameInput = document.getElementById("player2Name");
const playAgainButton = document.getElementById("playAgainButton");
const boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentPlayerTurn = 1;
let currentRound = 1;
let die1 = 0;
let die2 = 0;
let player1TotalPoints = 0;
let player2TotalPoints = 0;
startGameButton.addEventListener("click", () => {
    const player1Name = player1NameInput.value.trim();
    const player2Name = player2NameInput.value.trim();
    if (!player1Name || !player2Name) {
        alert("Please enter names for both players!");
        player1NameInput.focus();
        return;
    }
    document.getElementById("p1name").textContent = player1Name;
    document.getElementById("p2name").textContent = player2Name;
    document.getElementById("currentPlayerTurn").textContent = `${player1Name}'s`;
    document.getElementById("players").style.display = "none";
    document.getElementById("board").style.display = "block";
    rollDiceButton.disabled = false;
});
rollDiceButton.addEventListener("click", () => {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    dice1.className = `bi bi-dice-${die1}`;
    dice2.className = `bi bi-dice-${die2}`;
    const sum = die1 + die2;
    document.getElementById("diceSum").textContent = sum;
    rollIndividualButton.disabled = die1 === die2 || boxes[die1] === "X" || boxes[die2] === "X";
    sumDiceButton.disabled = sum > 9 || boxes[sum] === "X";
    endTurnButton.disabled = !rollIndividualButton.disabled && !sumDiceButton.disabled;
    rollDiceButton.disabled = true;
});
function shut(boxNumber) {
    const box = document.getElementById(`box${boxNumber}`);
    box.classList.add("shut");
    box.style.backgroundColor = "#e74c3c";
    box.style.color = "#ffffff";
    box.textContent = "X";
}

rollIndividualButton.addEventListener("click", () => {
    shut(die1);
    shut(die2);
    boxes[die1] = "X";
    boxes[die2] = "X";
    boxes[0] += die1 + die2;
    rollIndividualButton.disabled = true;
    sumDiceButton.disabled = true;
    rollDiceButton.disabled = false;
});
sumDiceButton.addEventListener("click", () => {
    const sum = die1 + die2;
    shut(sum);
    boxes[sum] = "X";
    boxes[0] += sum;
    rollIndividualButton.disabled = true;
    sumDiceButton.disabled = true;
    rollDiceButton.disabled = false;
});
function resetBoard() {
    boxes.fill(0);
    const numberSpaces = document.querySelectorAll(".box");
    numberSpaces.forEach((box, index) => {
        box.classList.remove("shut");
        box.style.backgroundColor = "#4caf50";
        box.style.color = "#000000";
        box.textContent = index + 1;
    });
}
function buildRow(round, points) {
    const tr = document.createElement("tr");
    tr.id = `roundRow${round}`;
    const th = document.createElement("th");
    th.textContent = `Round ${round}`;
    const td1 = document.createElement("td");
    td1.className = "p1Pts";
    td1.textContent = points;
    const td2 = document.createElement("td");
    td2.className = "p2Pts";
    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
    return tr;
}
endTurnButton.addEventListener("click", () => {
    if (currentPlayerTurn === 1) {
        const points = 45 - boxes[0];
        player1TotalPoints += points;
        const newRow = buildRow(currentRound, points);
        document.querySelector("#gameScorecard tbody").appendChild(newRow);
        currentPlayerTurn = 2;
        document.getElementById("currentPlayerTurn").textContent = `${player2NameInput.value.trim()}'s`;
    } else {
        const points = 45 - boxes[0];
        player2TotalPoints += points;
        const row = document.querySelector(`#roundRow${currentRound} .p2Pts`);
        row.textContent = points;
        currentPlayerTurn = 1;
        currentRound++;
        document.getElementById("currentPlayerTurn").textContent = `${player1NameInput.value.trim()}'s`;
        document.getElementById("roundNumber").textContent = currentRound;
    }
    resetBoard();
    rollDiceButton.disabled = false;
    endTurnButton.disabled = true;
    if (currentRound > 5) {
        gameOver();
    }
});
function gameOver() {
    document.getElementById("board").style.display = "none";
    document.getElementById("winner").style.display = "block";
    const winnerMessage = document.getElementById("winnerMessage");
    const loserMessage = document.getElementById("loserMessage");
    if (player1TotalPoints < player2TotalPoints) {
        winnerMessage.textContent = `${player1NameInput.value.trim()} wins with ${player1TotalPoints} points!`;
        loserMessage.textContent = `${player2NameInput.value.trim()} scored ${player2TotalPoints} points.`;
    } else if (player2TotalPoints < player1TotalPoints) {
        winnerMessage.textContent = `${player2NameInput.value.trim()} wins with ${player2TotalPoints} points!`;
        loserMessage.textContent = `${player1NameInput.value.trim()} scored ${player1TotalPoints} points.`;
    } else {
        winnerMessage.textContent = "It's a tie!";
        loserMessage.textContent = "";
    }
}
playAgainButton.addEventListener("click", () => {
    location.reload();
});

const state = {
    userScore: 0,
    computerScore: 0,
    lastUserChoice_div: null,
    lastComputerChoice_div: null,
    isGameOver: false,
    lastUserGlow: '',
    lastComputerGlow: ''
};
const SCORE_LIMIT = 15;
const userScore_span = document.getElementById("user-score")
const computerScore_span = document.getElementById("computer-score")
const scoreBoard_div = document.querySelector(".score-board")
const userHandImage = document.querySelector(".result .game-hands img:first-of-type")
const computerHandImage = document.querySelector(".result .game-hands img:last-of-type")
const gameHandsContainer = document.querySelector(".result .game-hands");
const playAgainContainer = document.getElementById("play-again-container");
const messageResult_div = document.querySelector(".message-result")
const rock_div = document.getElementById("rock")
const paper_div = document.getElementById("paper")
const scissors_div = document.getElementById("scissors")

const translations = {
    rock: "Pedra",
    paper: "Papel",
    scissors: "Tesoura"
};

const winActions = {
    rockscissors: "quebra",
    paperrock: "cobre",
    scissorspaper: "corta"
};

const imagePaths = {
    rock: 'src/images/rock.png',
    paper: 'src/images/paper.png',
    scissors: 'src/images/scissors.png',
};

const RESULTS = {
    WIN: "Você Venceu!",
    LOSE: "O Oponente Venceu!",
    DRAW: "Empate!"
};

function displayMessage(userChoice, computerChoice, result) {
    const userChoice_div = document.getElementById(userChoice);
    const computerChoice_div = document.getElementById(computerChoice);
    let message = "";
    let userGlow = "";
    let computerGlow = "";

    const userChoicePT = `<strong>${translations[userChoice]}</strong>`;
    const computerChoicePT = `<strong>${translations[computerChoice]}</strong>`;

    switch (result) {
        case RESULTS.WIN: {
            const winAction = winActions[userChoice + computerChoice];
            const resultText = `<span class="win-text">${RESULTS.WIN}</span>`;
            message = `${userChoicePT} ${winAction} ${computerChoicePT}. ${resultText}`;
            userGlow = 'green-glow';
            computerGlow = 'red-glow';
            break;
        }
        case RESULTS.LOSE: {
            const loseAction = winActions[computerChoice + userChoice];
            const resultText = `<span class="lose-text">${RESULTS.LOSE}</span>`;
            message = `${computerChoicePT} ${loseAction} ${userChoicePT}. ${resultText}`;
            userGlow = 'red-glow';
            computerGlow = 'green-glow';
            break;
        }
        case RESULTS.DRAW: {
            message = `${userChoicePT} empata com ${computerChoicePT}. ${RESULTS.DRAW}`;
            userGlow = 'gray-glow';
            computerGlow = 'gray-glow';
            break;
        }
    }

    messageResult_div.innerHTML = `<p>${message}</p>`;
    userChoice_div.classList.add(userGlow);
    computerChoice_div.classList.add(computerGlow);

    state.lastUserChoice_div = userChoice_div;
    state.lastComputerChoice_div = computerChoice_div;
    state.lastUserGlow = userGlow;
    state.lastComputerGlow = computerGlow;
}

function updateScores(result) {
    if (result === RESULTS.WIN) {
        state.userScore++;
    } else if (result === RESULTS.LOSE) {
        state.computerScore++;
    }
    userScore_span.innerHTML = state.userScore;
    computerScore_span.innerHTML = state.computerScore;

    if (state.userScore === SCORE_LIMIT || state.computerScore === SCORE_LIMIT) {
        endGame();
    }
}

function determineWinner(userChoice, computerChoice) {
    if (userChoice === computerChoice) {
        return RESULTS.DRAW;
    }

    switch (userChoice + computerChoice) {
        case "rockscissors":
        case "paperrock":
        case "scissorspaper":
            return RESULTS.WIN;
        default:
            return RESULTS.LOSE;
    }
}

function getComputerChoice() {
    const choices = ["rock", "paper", "scissors"];
    const randomIndex = Math.floor(Math.random() * choices.length);

    return choices[randomIndex];
}

function endGame() {
    state.isGameOver = true;
    const button = document.createElement('button');
    button.innerText = "Jogar Novamente";
    button.className = "play-again-button";
    button.addEventListener('click', resetGame);
    playAgainContainer.appendChild(button);
}

function resetGame() {
    state.userScore = 0;
    state.computerScore = 0;
    state.isGameOver = false;

    userScore_span.innerHTML = state.userScore;
    computerScore_span.innerHTML = state.computerScore;

    messageResult_div.innerHTML = `<p>Faça sua jogada para começar!</p>`;
    playAgainContainer.innerHTML = "";

    if (state.lastUserChoice_div) {
        state.lastUserChoice_div.classList.remove(state.lastUserGlow);
        state.lastComputerChoice_div.classList.remove(state.lastComputerGlow);
    }

    userHandImage.src = imagePaths.rock;
    computerHandImage.src = imagePaths.rock;
}

function game(userChoice) {
    if (state.isGameOver) return;

    if (state.lastUserChoice_div) {
        state.lastUserChoice_div.classList.remove(state.lastUserGlow);
        state.lastComputerChoice_div.classList.remove(state.lastComputerGlow);
    }

    gameHandsContainer.classList.add('animating');
    userHandImage.src = imagePaths.rock;
    computerHandImage.src = imagePaths.rock;
    messageResult_div.innerHTML = `<p>Oponente está escolhendo...</p>`;

    setTimeout(() => {
        gameHandsContainer.classList.remove('animating');

        const computerChoice = getComputerChoice();
        const result = determineWinner(userChoice, computerChoice);
        userHandImage.src = imagePaths[userChoice];
        computerHandImage.src = imagePaths[computerChoice];
        updateScores(result);
        displayMessage(userChoice, computerChoice, result);
    }, 1200);
}

function main() {
    [rock_div, paper_div, scissors_div].forEach(choice => {
        choice.addEventListener('click', () => game(choice.id));
    });
}

document.addEventListener('DOMContentLoaded', main);

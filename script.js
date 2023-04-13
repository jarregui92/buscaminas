const BOARD_SIZE = 10;
const NUM_MINES = 3;
document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('dblclick', event => event.preventDefault());
var board = [];
var gameOver = false;
var flagsRemaining = NUM_MINES;

function generateBoard() {
    // Crear tablero vacío
    for (var i = 0; i < BOARD_SIZE; i++) {
        board[i] = [];
        for (var j = 0; j < BOARD_SIZE; j++) {
            board[i][j] = {
                mine: false,
                revealed: false,
                flagged: false,
                count: 0
            };
        }
    }

    // Colocar minas aleatoriamente
    var numMinesPlaced = 0;
    while (numMinesPlaced < NUM_MINES) {
        var row = Math.floor(Math.random() * BOARD_SIZE);
        var col = Math.floor(Math.random() * BOARD_SIZE);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            numMinesPlaced++;
        }
    }

    // Contar minas adyacentes
    for (var i = 0; i < BOARD_SIZE; i++) {
        for (var j = 0; j < BOARD_SIZE; j++) {
            if (!board[i][j].mine) {
                var count = 0;
                for (var k = i - 1; k <= i + 1; k++) {
                    for (var l = j - 1; l <= j + 1; l++) {
                        if (k >= 0 && k < BOARD_SIZE && l >= 0 && l < BOARD_SIZE && board[k][l].mine) {
                            count++;
                        }
                    }
                }
                board[i][j].count = count;
            }
        }
    }
}

function renderBoard() {
    var boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    for (var i = 0; i < BOARD_SIZE; i++) {
        for (var j = 0; j < BOARD_SIZE; j++) {
            var button = document.createElement("button");
            button.dataset.row = i;
            button.dataset.col = j;
            button.addEventListener("click", handleButtonClick);
            button.addEventListener("contextmenu", handleButtonRightClick);
            boardDiv.appendChild(button);
        }
        boardDiv.appendChild(document.createElement("br"));
    }
}

function handleButtonClick(event) {
    if (gameOver) {
        return;
    }
    var row = parseInt(event.target.dataset.row);
    var col = parseInt(event.target.dataset.col);
    var cell = board[row][col];

    if (cell.flagged) {
        return;
    }

    if (cell.mine) {
        gameOver = true;
        event.target.classList.add("mine");
        revealMines();

        Swal.fire({
            icon: 'error',
            title: 'Lose!',
            text: 'Perdiste Wey!',
            confirmButtonText: 'Reintentar',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        })
    } else {
        revealCell(row, col);
        checkForWin();
    }
}

function handleButtonRightClick(event) {
    if (gameOver) {
        return;
    }
    event.preventDefault();

    var row = parseInt(event.target.dataset.row);
    var col = parseInt(event.target.dataset.col);
    var cell = board[row][col];

    if (!cell.revealed) {
        cell.flagged = !cell.flagged;
        if (cell.flagged && flagsRemaining > 0) {

            flagsRemaining--;
            event.target.classList.add("flagged");
        } else if (!cell.flagged && flagsRemaining < 3) {
            flagsRemaining++;
            event.target.classList.remove("flagged");
        }
        renderFlagsRemaining();
    }
}

function revealCell(row, col) {
    var cell = board[row][col];
    if (!cell.revealed && !cell.flagged) {
        cell.revealed = true;
        var button = document.querySelector("[data-row='" + row + "'][data-col='" + col + "']");
        button.classList.add("revealed");
        if (cell.count > 0) {
            button.innerText = cell.count;
        } else {
            for (var i = row - 1; i <= row + 1; i++) {
                for (var j = col - 1; j <= col + 1; j++) {
                    if (i >= 0 && i < BOARD_SIZE && j >= 0 && j < BOARD_SIZE) {
                        revealCell(i, j);
                    }
                }
            }
        }
    }
}

function revealMines() {
    for (var i = 0; i < BOARD_SIZE; i++) {
        for (var j = 0; j < BOARD_SIZE; j++) {
            if (board[i][j].mine) {
                var button = document.querySelector("[data-row='" + i + "'][data-col='" + j + "']");
                button.classList.add("mine");
            }
        }
    }
}

function checkForWin() {
    for (var i = 0; i < BOARD_SIZE; i++) {
        for (var j = 0; j < BOARD_SIZE; j++) {
            if (!board[i][j].mine && !board[i][j].revealed) {
                return;
            }
        }
    }
    gameOver = true;
    revealMines();
    Swal.fire({
        icon: 'success',
        title: 'Win!',
        text: 'Ganaste Wey!',
        confirmButtonText: 'Cool',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    })
}

function renderFlagsRemaining() {
    var resetButton = document.getElementById("reset");
    resetButton.innerText = "Jugar de nuevo (" + flagsRemaining + " banderas restantes)";
}

function resetGame() {
    gameOver = false;
    flagsRemaining = NUM_MINES;
    generateBoard();
    renderBoard();
    renderFlagsRemaining();
}

document.addEventListener("DOMContentLoaded", function () {
    generateBoard();
    renderBoard();
    renderFlagsRemaining();
    var resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", resetGame);
});
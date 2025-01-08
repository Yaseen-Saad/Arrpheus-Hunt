// Enhanced Minesweeper Game Logic
const options = document.querySelectorAll(".option");
const mainMenu = document.getElementById("main-menu");
const gameContainer = document.getElementById("game-container");
const gameBoard = document.getElementById("game-board");
const messageOverlay = document.getElementById("message-overlay");
const messageText = document.getElementById("message-text");
const restartButton = document.getElementById("restart-button");

let gridSize = 8;
let totalMines = 0;
let tiles = [];
let mines = new Set();
let revealedTiles = 0;
let safeTiles = 0;
let firstClick = true;

// Game Initialization
options.forEach(option => {
    option.addEventListener("click", () => {
        gridSize = parseInt(option.dataset.size);
        initializeGame(gridSize);
    });
});

restartButton.addEventListener("click", () => {
    location.reload();
});

function initializeGame(size) {
    mainMenu.classList.add("hidden");
    messageOverlay.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    setupBoard(size);
    firstClick = true;
    revealedTiles = 0;
    totalMines = Math.floor(size * size * 0.2); // 20% of tiles are mines
    safeTiles = size * size - totalMines;
    mines.clear();
}

function setupBoard(size) {
    gameBoard.innerHTML = "";
    gameBoard.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    tiles = Array.from({ length: size * size }, (_, i) => {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.dataset.index = i;
        tile.addEventListener("click", () => handleTileClick(tile, i));
        gameBoard.appendChild(tile);
        return tile;
    });
}

function placeMines(excludeIndex) {
    while (mines.size < totalMines) {
        const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
        if (randomIndex !== excludeIndex && !mines.has(randomIndex)) {
            mines.add(randomIndex);
        }
    }
}

function handleTileClick(tile, index) {
    if (tile.classList.contains("revealed")) return;

    if (firstClick) {
        firstClick = false;
        placeMines(index);
        revealTile(index);
        return;
    }

    revealTile(index);

    if (revealedTiles === safeTiles) {
        endGame("Congratulations! You cleared the field!");
    }
}

function revealTile(index) {
    const tile = tiles[index];
    if (tile.classList.contains("revealed")) return;

    tile.classList.add("revealed");

    if (mines.has(index)) {
        tile.classList.add("mine");
        endGame("Game Over! Hakkun!");
    } else {
        revealedTiles++;
        const nearbyMines = countAdjacentMines(index);
        if (nearbyMines > 0) {
            tile.textContent = nearbyMines;
            tile.style.color = getNumberColor(nearbyMines);
        } else {
            revealAdjacentTiles(index);
            tile.classList.add("Arrpheus")
        }
    }
}

function countAdjacentMines(index) {
    return getNeighbors(index).filter(neighbor => mines.has(neighbor)).length;
}

function getNeighbors(index) {
    const neighbors = [];
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            const newRow = row + dr;
            const newCol = col + dc;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                neighbors.push(newRow * gridSize + newCol);
            }
        }
    }

    return neighbors;
}

function revealAdjacentTiles(index) {
    const queue = [index];

    while (queue.length > 0) {
        const current = queue.pop();
        const neighbors = getNeighbors(current);

        neighbors.forEach(neighbor => {
            const neighborTile = tiles[neighbor];
            if (!neighborTile.classList.contains("revealed") && !mines.has(neighbor)) {
                neighborTile.classList.add("revealed");
                revealedTiles++;

                const nearbyMines = countAdjacentMines(neighbor);
                if (nearbyMines > 0) {
                    neighborTile.textContent = nearbyMines;
                    neighborTile.style.color = getNumberColor(nearbyMines);
                } else {
                    queue.push(neighbor);
                    neighborTile.classList.add("Arrpheus")
                }
            }
        });
    }
}

function getNumberColor(number) {
    const colors = [
        "", "blue", "green", "red", "darkblue", "darkred", "cyan", "black", "gray"
    ];
    return colors[number] || "black";
}

function endGame(message) {
    messageText.textContent = message;
    messageOverlay.classList.remove("hidden");
}
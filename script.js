import { Game } from "./Game.js";
import { TILE_COUNT } from "./Board.js";

const boardElement = document.getElementById("board");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const preGameOverlay = document.getElementById("overlay");
const playHeader = document.getElementById("overlay-play");
const pausedHeader = document.getElementById("overlay-pause");

const game = new Game();

function createTiles() {
  for (let i = 0; i < TILE_COUNT; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.id = "tile-" + i;
    tile.innerHTML = i === TILE_COUNT - 1 ? "" : i + 1 + "";

    tile.addEventListener("click", () => {
      if (game.timerRunning) {
        game.makeMove(i);
      }
    });
    boardElement.appendChild(tile);
  }
}

createTiles();
game.start();

playButton.addEventListener("click", () => {
  if (game.timerRunning) return;
  preGameOverlay.style.display = "none";
  game.startTimer();
});

pauseButton.addEventListener("click", () => {
  if (!game.timerRunning) return;
  preGameOverlay.style.display = "flex";
  playHeader.style.display = "none";
  pausedHeader.style.display = "inline";
  game.pauseTimer();
});

restartButton.addEventListener("click", () => {
  if (game.timerRunning) {
    game.restart();
  }
});

preGameOverlay.addEventListener("click", () => {
  if (!game.timerRunning) {
    preGameOverlay.style.display = "none";
    game.startTimer();
  }
});

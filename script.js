import { Game } from "./Game.js";
import { TILE_COUNT } from "./Board.js";
import { Solver } from "./Solver.js";

const boardElement = document.getElementById("board");
const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const solveButton = document.getElementById("solveButton");
const preGameOverlay = document.getElementById("overlay");
const playHeader = document.getElementById("overlay-play");
const pausedHeader = document.getElementById("overlay-pause");
let inAiMode = false;

const game = new Game();

function createTiles() {
  for (let i = 0; i < TILE_COUNT; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.id = "tile-" + i;
    tile.innerHTML = i === TILE_COUNT - 1 ? "" : i + 1 + "";

    tile.addEventListener("click", () => {
      if (inAiMode) return;
      if (game.timerRunning) {
        game.makeMove(i);
      }
    });
    boardElement.appendChild(tile);
  }
}

createTiles();
game.start();

solveButton.addEventListener("click", () => {
  if (inAiMode) return;

  inAiMode = true;
  preGameOverlay.style.display = "none";
  game.resetTimer();

  const solver = new Solver(game.board);
  solver.AStar();
  const moves = solver.solution;

  moves.forEach((move, index) => {
    setTimeout(() => {
      game.hashKeyMoves(move);
    }, index * 200);
  });
});

playButton.addEventListener("click", () => {
  if (inAiMode) return;
  if (game.timerRunning || game.isSolved()) return;

  preGameOverlay.style.display = "none";
  game.startTimer();
});

pauseButton.addEventListener("click", () => {
  if (inAiMode) return;
  if (!game.timerRunning) return;

  preGameOverlay.style.display = "flex";
  playHeader.style.display = "none";
  pausedHeader.style.display = "inline";
  game.pauseTimer();
});

restartButton.addEventListener("click", () => {
  if (!game.timerRunning && !game.isSolved()) return;

  inAiMode = false;
  game.restart();
});

preGameOverlay.addEventListener("click", () => {
  if (!game.timerRunning) {
    preGameOverlay.style.display = "none";
    game.startTimer();
  }
});

window.onload = function () {
  const time = localStorage.getItem("bestTime");
  const moves = localStorage.getItem("bestMoves");

  if (time) {
    document.getElementById("best-timer").innerHTML = game.formatTime(time);
  }
  if (moves) {
    document.getElementById("best-move").innerHTML = moves;
  }
};

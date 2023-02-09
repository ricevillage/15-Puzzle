import { Game } from "./Game.js";
import { TILE_COUNT } from "./Board.js";

const boardElement = document.getElementById("board");
const restartButton = document.getElementById("restartButton");

const game = new Game();

function createTiles() {
  for (let i = 0; i < TILE_COUNT; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.id = "tile-" + i;
    tile.innerHTML = i === TILE_COUNT - 1 ? "-1" : i + "";

    tile.onclick = function () {
      game.makeMove(i);
    };
    boardElement.appendChild(tile);
  }
}

restartButton.addEventListener("click", () => {
  game.restart();
});

createTiles();
game.start();

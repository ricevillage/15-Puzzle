import { Board } from "./Board.js";
import { TILE_COUNT } from "./Board.js";
const moveCounter = document.getElementById("numberOfMoves");

export class Game {
  constructor() {
    this.board = new Board();
    this.moves = 0;
    this.setupKeyboardListeners();
  }

  start() {
    this.board.shuffle();
    this.render();
  }

  restart() {
    this.board = new Board();
    this.moves = 0;
    moveCounter.innerText = `Moves: ${this.getMoves()}`;
    this.start();
  }

  quit() {
    this.board = null;
  }

  makeMove(tileIndex) {
    if (this.isSolved()) {
      moveCounter.innerText = `Solved in ${this.getMoves()} Moves`;
      return;
    }

    if (this.board.moveTile(tileIndex)) {
      this.moves++;
      moveCounter.innerText = `Moves: ${this.getMoves()}`;
      this.render();
    }
  }

  render() {
    for (let i = 0; i < TILE_COUNT; i++) {
      const tileNumber = this.board.tiles[i].getNumber();
      const tileElement = document.getElementById("tile-" + i);
      // Only update the tile if its value has changed
      if (tileNumber + "" !== tileElement.innerHTML) {
        tileElement.innerHTML =
          tileNumber === TILE_COUNT ? "" : tileNumber + "";
        const bgColor = tileNumber === TILE_COUNT ? "gray" : "#ffc107";
        tileElement.style.backgroundColor = bgColor;
      }
    }
  }

  isSolved() {
    return this.board.isSolved();
  }

  getBoard() {
    return this.board;
  }

  getMoves() {
    return this.moves;
  }

  setupKeyboardListeners() {
    document.addEventListener("keydown", (event) => {
      const emptyTileIndex = this.board.emptyTileIndex;

      switch (event.key) {
        case "ArrowUp":
          if (emptyTileIndex < 12) {
            this.makeMove(emptyTileIndex + 4);
          }
          break;
        case "ArrowDown":
          if (emptyTileIndex > 3) {
            this.makeMove(emptyTileIndex - 4);
          }
          break;
        case "ArrowLeft":
          // if emptyTileIndex is NOT at the right-most edge
          if (emptyTileIndex % 4 !== 3) {
            this.makeMove(emptyTileIndex + 1);
          }
          break;
        case "ArrowRight":
          // if emptyTileIndex is NOT at the left-most edge
          if (emptyTileIndex % 4 !== 0) {
            this.makeMove(emptyTileIndex - 1);
          }
          break;
        default:
          break;
      }
      this.render();
    });
  }
}

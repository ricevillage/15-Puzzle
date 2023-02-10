import { Board } from "./Board.js";
import { TILE_COUNT } from "./Board.js";

const movesSpan = document.getElementById("moves");

export class Game {
  constructor() {
    this.board = new Board();
    this.moves = 0;
    this.setupKeyboardListeners();
    this.intervalId;
    this.elapsedTime = 0;
    this.timerRunning = false;
  }

  start() {
    this.board.shuffle();
    this.render();
  }

  restart() {
    this.board = new Board();
    this.moves = 0;
    movesSpan.innerText = this.getMoves();
    this.resetTimer();
    this.startTimer();
    this.start();
  }

  quit() {
    this.board = null;
  }

  startTimer() {
    if (this.timerRunning) return;
    this.timerRunning = true;
    this.intervalId = setInterval(() => {
      this.elapsedTime++;
      const minutes = Math.floor(this.elapsedTime / 60);
      const seconds = this.elapsedTime % 60;
      const formattedTime = `Time: ${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
      document.querySelector(".timer").innerHTML = formattedTime;
    }, 1000);
  }

  resetTimer() {
    clearInterval(this.intervalId);
    this.timerRunning = false;
    this.intervalId = null;
    this.elapsedTime = 0;
  }

  pauseTimer() {
    clearInterval(this.intervalId);
    this.timerRunning = false;
  }

  makeMove(tileIndex) {
    if (this.board.moveTile(tileIndex)) {
      this.moves++;
      movesSpan.innerText = this.getMoves();
      this.render();
    }

    if (this.isSolved()) {
      movesSpan.innerText = `Solved in ${this.getMoves()} Moves`;
      this.pauseTimer();
      return;
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

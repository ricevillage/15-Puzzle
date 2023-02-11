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
    this.formattedTime = 0;
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
      this.formattedTime = this.formatTime(this.elapsedTime);
      document.getElementById("timer").innerHTML = this.formattedTime;
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
      const currentMoves = this.getMoves();
      const currentTime = this.unformatTime(this.getTime());

      const bestTime = localStorage.getItem("bestTime") || Infinity;
      const bestMoves = localStorage.getItem("bestMoves") || Infinity;

      if (
        currentTime < bestTime ||
        (currentTime === bestTime && currentMoves < bestMoves)
      ) {
        movesSpan.innerText = `Solved in ${currentMoves} Moves`;

        localStorage.setItem("bestTime", currentTime);
        localStorage.setItem("bestMoves", currentMoves);

        document.getElementById("best-timer").innerHTML =
          this.formatTime(currentTime);
        document.getElementById("best-move").innerHTML = currentMoves;
      }

      this.resetTimer();
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

  unformatTime(formattedTime) {
    const [minutes, seconds] = formattedTime
      .split(":")
      .map((val) => parseInt(val));
    return minutes * 60 + seconds;
  }

  formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
    return formattedTime;
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

  getTime() {
    return this.formattedTime;
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

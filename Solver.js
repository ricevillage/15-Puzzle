import { TILE_COUNT } from "./Board.js";

class PriorityQueue {
  queue = [];

  enqueue(element) {
    this.queue.push(element);
    this.sort();
  }

  dequeue() {
    return this.queue.shift();
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  sort() {
    this.queue.sort((a, b) => a.h - b.h);
  }

  contains(state) {
    return this.queue.some((element) => state.equals(element));
  }
}

class State {
  constructor(tiles, h, parent) {
    this.tiles = tiles;
    this.h = h;
    this.parent = parent;
    this.move = null;
  }

  equals(otherState) {
    return this.tiles.every(
      (tile, i) => tile.getNumber() === otherState.tiles[i].getNumber()
    );
  }
}

export class Solver {
  constructor(board) {
    this.heuristicCache = new Map();
    this.initialState = new State(
      board.tiles,
      this.heuristic(board.tiles),
      null
    );
    this.openList = new PriorityQueue();
    this.closedList = new Set();
    this.solution = [];
    this.emptyTileIndex = board.emptyTileIndex;
  }

  buildSolution(state) {
    let currentState = state;
    while (currentState.parent !== null) {
      this.solution.unshift(currentState.move);
      currentState = currentState.parent;
    }
  }

  isGoalState(tiles) {
    return tiles.every((tile, i) => tile.getNumber() === i + 1);
  }

  wrongPlace(tile) {
    let count = 0;

    tile.forEach((n, index) => {
      if (n.getNumber() - 1 !== index) count++;
    });

    return count;
  }

  manhattanDistance(tiles) {
    const key = tiles.map((tile) => tile.getNumber()).join("");
    if (this.heuristicCache.has(key)) {
      return this.heuristicCache.get(key);
    }

    const emptyTileIndex = this.findEmptyTile(tiles);
    let distance = 0;
    for (let i = 0; i < tiles.length; i++) {
      if (i === emptyTileIndex) continue;
      const tile = tiles[i].getNumber();
      const expectedRow = Math.floor((tile - 1) / 4);
      const expectedCol = (tile - 1) % 4;
      const currentRow = Math.floor(i / 4);
      const currentCol = i % 4;
      distance +=
        Math.abs(expectedRow - currentRow) + Math.abs(expectedCol - currentCol);
    }

    this.heuristicCache.set(key, distance);
    return distance;
  }

  heuristic = (tiles) => {
    return this.wrongPlace(tiles) + this.manhattanDistance(tiles);
  };

  hasState(list, state) {
    return [...list].some((someState) => someState.equals(state));
  }

  findEmptyTile(tiles) {
    return tiles.findIndex((tile) => tile.getNumber() === TILE_COUNT);
  }

  generateMoves(tiles) {
    const zeroIndex = this.findEmptyTile(tiles);
    const moves = [];
    if (zeroIndex >= 4)
      moves.push({ index: zeroIndex - 4, keystroke: "ArrowDown" });
    if (zeroIndex < 12)
      moves.push({ index: zeroIndex + 4, keystroke: "ArrowUp" });
    if (zeroIndex % 4 !== 0)
      moves.push({ index: zeroIndex - 1, keystroke: "ArrowRight" });
    if (zeroIndex % 4 !== 3)
      moves.push({ index: zeroIndex + 1, keystroke: "ArrowLeft" });
    return moves;
  }

  generateNextState(state, index) {
    let tiles = state.tiles.slice();
    let zeroIndex = this.findEmptyTile(tiles);

    [tiles[zeroIndex], tiles[index]] = [tiles[index], tiles[zeroIndex]];

    const hCost = this.heuristic(tiles);
    return new State(tiles, hCost, state);
  }

  AStar() {
    this.openList.enqueue(this.initialState);
    while (!this.openList.isEmpty()) {
      const currentState = this.openList.dequeue();
      this.closedList.add(currentState);
      if (this.isGoalState(currentState.tiles)) {
        // console.log(currentState);
        this.buildSolution(currentState);
        return;
      }
      const moves = this.generateMoves(currentState.tiles);
      for (const move of moves) {
        const nextState = this.generateNextState(currentState, move.index);
        if (this.hasState(this.closedList, nextState)) continue;
        nextState.move = move.keystroke;
        if (!this.openList.contains(nextState)) {
          this.openList.enqueue(nextState);
        }
      }
    }
  }
}

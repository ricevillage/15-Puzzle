import { Tile } from "./Tile.js";

export const TILE_COUNT = 16;

export class Board {
  // initializes the tiles array with Tile objects, and sets the emptyTileIndex to the last index in the array.
  constructor() {
    this.tiles = [];
    for (let i = 0; i < TILE_COUNT; i++) {
      this.tiles.push(new Tile(i + 1));
    }
    this.emptyTileIndex = TILE_COUNT - 1;
  }

  // randomly rearranges the tiles, and updates the emptyTileIndex accordingly
  shuffle() {
    for (let i = this.tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
    }
    this.emptyTileIndex = this.tiles.findIndex(
      (tile) => tile.getNumber() === TILE_COUNT
    );

    if (this.isSolvable() === 0) this.shuffle();
  }

  // moves a tile to the empty tile position if the move is valid (the tile is next to the empty tile).
  moveTile(tileIndex) {
    const [tileRow, tileCol] = this.tileIndexToCoordinates(tileIndex);
    const [emptyTileRow, emptyTileCol] = this.tileIndexToCoordinates(
      this.emptyTileIndex
    );

    const rowDiff = tileRow - emptyTileRow;
    const colDiff = tileCol - emptyTileCol;

    if (Math.abs(rowDiff) + Math.abs(colDiff) === 1) {
      [this.tiles[tileIndex], this.tiles[this.emptyTileIndex]] = [
        this.tiles[this.emptyTileIndex],
        this.tiles[tileIndex],
      ];
      this.emptyTileIndex = tileIndex;
      return true;
    }
    return false;
  }

  // checks if the puzzle is solved by checking if the numbers on the tiles are in the correct order
  isSolved() {
    for (let i = 0; i < this.tiles.length - 1; i++) {
      if (this.tiles[i].getNumber() !== i + 1) {
        return false;
      }
    }
    return true;
  }

  // Credits to https://codepen.io/unindented/pen/QNWdRQ
  isSolvable() {
    let product = 1;
    for (let i = 1, l = this.tiles.length - 1; i <= l; i++) {
      for (let j = i + 1, m = l + 1; j <= m; j++) {
        product *= (this.tiles[i - 1] - this.tiles[j - 1]) / (i - j);
      }
    }
    return Math.round(product) === 1;
  }

  tileIndexToCoordinates(tileIndex) {
    return [Math.floor(tileIndex / 4), tileIndex % 4];
  }

  coordinatesToTileIndex(coordinates) {
    return coordinates[0] * 4 + coordinates[1];
  }

  getTiles() {
    return this.tiles;
  }

  getEmptyTileIndex() {
    return this.emptyTileIndex;
  }
}
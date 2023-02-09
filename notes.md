Class: Tile

- number: number

* setNumber(number: number): void
* getNumber(): number

Class: Board

- tiles: Tile[]
- emptyTileIndex: number

* shuffle(): void
* moveTile(tileIndex: number): void
* isSolved(): boolean

Class: Game

- board: Board

* start(): void
* restart(): void
* quit(): void

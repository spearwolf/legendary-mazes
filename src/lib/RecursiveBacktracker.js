import {sample} from './utils.js';
import {WALL, UNVISITED, FLOOR} from './constants.js';

export class RecursiveBacktracker {

  constructor(grid) {
    this.grid = grid;
  }

  start() {
    this.isFinished = false;
    this.isHuntMode = false;

    this.grid.setAll(WALL);
    this.grid.setAllCells(UNVISITED);

    const cell = this.grid.randomCellAtBorder();
    cell.value = FLOOR;
    this.visitedCells = [cell];
  }

  get currentCell() {
    if (this.visitedCells) {
      return this.visitedCells[this.visitedCells.length - 1];
    }
  }

  set currentCell(cell) {
    this.visitedCells.push(cell);
  }

  nextStep() {

    if (this.isHuntMode) {

      let cell;
      while ((cell = this.visitedCells.pop())) {

        const unvisited = cell.filterNeighbors(UNVISITED);

        if (unvisited.length > 0) {
          this.currentCell = cell;
          this.isHuntMode = false;
          return;
        }
      }

      this.isFinished = true;
      return;

    } else {

      const cell = sample(this.currentCell.filterNeighbors(UNVISITED));
      if (cell) {

        cell.value = FLOOR;
        this.currentCell.setInterjacentValue(cell, FLOOR);
        this.currentCell = cell;

      } else {
        this.isHuntMode = true;
      }

    }
  }

  build() {
    this.start();
    while (!this.isFinished) {
      this.nextStep();
    }
  }

}

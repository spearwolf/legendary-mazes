import {MazeCell} from './MazeCell.js';

export class MazeGrid {

  constructor(rows, columns) {

    this.columns = columns;
    this.rows = rows;
    this.width = (columns << 1) + 1;
    this.height = (rows << 1) + 1;
    this.data = new Uint8Array(this.width * this.height);
    this.cells = [];

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        this.cells.push(new MazeCell(this, y, x));
      }
    }
  }

  cell(row, col) {
    return this.cells[(row * this.columns) + col];
  }

  cellAt(x, y) {
    return this.cells[((y >> 1) * this.columns) + (x >> 1)];
  }

  randomCell() {
    return this.cells[(Math.random() * this.cells.length) | 0];
  }

  randomCellAtBorder() {
    let cell;
    if (Math.random() > 0.5) {
      cell = this.cell(0, Math.floor(Math.random() * this.columns));
    } else {
      cell = this.cell(Math.floor(Math.random() * this.rows), 0);
    }
    return cell;
  }

  get centralCell() {
    return this.cell(this.rows >> 1, this.columns >> 1);
  }

  forEachCell(fn) {
    this.cells.forEachCell(fn);
  }

  setAllCells(val) {
    this.cells.forEach(cell => {
      cell.value = val;
    });
  }

  setAll(val) {
    if (typeof this.data.fill === 'function') {
      this.data.fill(val);
    } else {
      for (let i = this.data.length; --i;) {
        this.data[i] = val;
      }
    }
  }

  get(x, y) {
    return this.data[(y * this.width) + x];
  }

  set(x, y, val) {
    return (this.data[(y * this.width) + x] = val);
  }

  frame(val) {
    let x, y;
    for (y = 0, x = 0; x < this.width; x++) this.set(x, y, val);
    for (y = this.height - 1, x = 0; x < this.width; x++) this.set(x, y, val);
    for (y = 1, x = 0; y < this.height - 1; y++) this.set(x, y, val);
    for (y = 1, x = this.width - 1; y < this.height - 1; y++) this.set(x, y, val);
  }

}

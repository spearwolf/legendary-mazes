import {sample} from './utils.js';
import {MazeTile} from './MazeTile.js';

const $tile = Symbol('tile');
const $neighbors = Symbol('neighbors');

export class MazeCell {

  constructor(grid, row, col) {
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.id = (row * col) + col;
    this[$tile] = null;
    this[$neighbors] = null;
  }

  randomNeighbor() {
    return sample(this.neighbors);
  }

  filterNeighbors(value) {
    const filter = typeof value === 'function' ? value : (cell => cell.value === value);
    return this.neighbors.filter(filter);
  }

  filterLinkedNeighbors(value) {
    return this.neighbors.filter(cell => this.getInterjacentValue(cell) === value);
  }

  setInterjacentValue(neighbor, val) {
    if (neighbor instanceof MazeCell) {
      if (this.northCell === neighbor) this.northValue = val;
      else if (this.southCell === neighbor) this.southValue = val;
      else if (this.westCell === neighbor) this.westValue = val;
      else if (this.eastCell === neighbor) this.eastValue = val;
    }
  }

  getInterjacentValue(neighbor) {
    if (neighbor instanceof MazeCell) {
      if (this.northCell === neighbor) return this.northValue;
      else if (this.southCell === neighbor) return this.southValue;
      else if (this.westCell === neighbor) return this.westValue;
      else if (this.eastCell === neighbor) return this.eastValue;
    }
  }

  get tile() {
    if (!this[$tile]) {
      const x = (this.col << 1) + 1;
      const y = (this.row << 1) + 1;
      this[$tile] = new MazeTile(x, y);
    }
    return this[$tile];
  }

  get neighbors() {
    if (!this[$neighbors]) {

      this[$neighbors] = [];

      let cell;
      if ((cell = this.northCell)) this[$neighbors].push(cell);
      if ((cell = this.southCell)) this[$neighbors].push(cell);
      if ((cell = this.westCell)) this[$neighbors].push(cell);
      if ((cell = this.eastCell)) this[$neighbors].push(cell);
    }
    return this[$neighbors];
  }

  get northCell() {
    if (this.row > 0) return this.grid.cell(this.row - 1, this.col);
  }

  get southCell() {
    if (this.row < this.grid.rows - 1) return this.grid.cell(this.row + 1, this.col);
  }

  get eastCell() {
    if (this.col < this.grid.columns - 1) return this.grid.cell(this.row, this.col + 1);
  }

  get westCell() {
    if (this.col > 0) return this.grid.cell(this.row, this.col - 1);
  }

  get value() {
    const x = (this.col << 1) + 1;
    const y = (this.row << 1) + 1;
    return this.grid.get(x, y);
  }

  set value(val) {
    const x = (this.col << 1) + 1;
    const y = (this.row << 1) + 1;
    this.grid.set(x, y, val);
  }

  get northValue() {
    const x = (this.col << 1) + 1;
    const y = (this.row << 1);
    return this.grid.get(x, y);
  }

  set northValue(val) {
    const x = (this.col << 1) + 1;
    const y = (this.row << 1);
    this.grid.set(x, y, val);
  }

  get southValue() {
    const x = (this.col << 1) + 1;
    const y = (this.row << 1) + 2;
    return this.grid.get(x, y);
  }

  set southValue(val) {
    const x = (this.col << 1) + 1;
    const y = (this.row << 1) + 2;
    this.grid.set(x, y, val);
  }

  get westValue() {
    const x = (this.col << 1);
    const y = (this.row << 1) + 1;
    return this.grid.get(x, y);
  }

  set westValue(val) {
    const x = (this.col << 1);
    const y = (this.row << 1) + 1;
    this.grid.set(x, y, val);
  }

  get eastValue() {
    const x = (this.col << 1) + 2;
    const y = (this.row << 1) + 1;
    return this.grid.get(x, y);
  }

  set eastValue(val) {
    const x = (this.col << 1) + 2;
    const y = (this.row << 1) + 1;
    this.grid.set(x, y, val);
  }

}

//       01234
//     0 +-+-+
//     1 | | |
//     2 +-+-+
//     3 | | |
//     4 +-+-+

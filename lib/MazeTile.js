
export class MazeTile {

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getValue(grid) {
    return grid.get(this.x, this.y);
  }

  setValue(grid, value) {
    return grid.set(this.x, this.y, value);
  }

  getNeighbors(grid) {
    const neighbors = [];

    if (this.y > 0) neighbors.push(new MazeTile(this.x, this.y - 1));
    if (this.x < grid.width - 1) neighbors.push(new MazeTile(this.x + 1, this.y));
    if (this.y < grid.height - 1) neighbors.push(new MazeTile(this.x, this.y + 1));
    if (this.x > 0) neighbors.push(new MazeTile(this.x - 1, this.y));

    return neighbors;
  }
}

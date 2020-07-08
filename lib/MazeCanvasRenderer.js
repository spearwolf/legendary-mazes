const clamp = (val, min, max) => {
  if (val > max) {
    return max;
  }
  if (val < min) {
    return min;
  }
  return val;
};

const buildColor = ({ r, g, b }) => `rgb(${r},${g},${b})`;

export class MazeCanvasRenderer {
  constructor(grid, colors) {
    this.grid = grid;
    this.colors = colors;
  }

  setDistanceGrid(distances, fromColor, toColor) {
    this.distances = distances;
    this.floorValue = distances.floorValue;
    this.fromColor = fromColor;
    this.toColor = toColor;
    this.distanceColors = [buildColor(fromColor)];

    const len = distances.maxDistance + 1;
    const color = { r: fromColor.r, g: fromColor.g, b: fromColor.b };
    const delta = {
      r: (toColor.r - fromColor.r) / len,
      g: (toColor.g - fromColor.g) / len,
      b: (toColor.b - fromColor.b) / len,
    };

    for (let i = 1; i < len; i++) {
      color.r = clamp(color.r + delta.r);
      color.g = clamp(color.g + delta.g);
      color.b = clamp(color.b + delta.b);
      this.distanceColors.push(buildColor(color));
    }
  }

  getColor(x, y) {
    const value = this.grid.get(x, y);
    let color;

    if (value === this.floorValue && this.distanceColors) {
      let distance = this.distances.getDistanceAt(x, y);
      color =
        distance == null
          ? this.colors[this.floorValue]
          : this.distanceColors[distance];
    } else {
      color = this.colors[value];
    }

    return color;
  }

  render(ctx) {
    const { width, height } = this.grid;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        ctx.fillStyle = this.getColor(x, y);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
}

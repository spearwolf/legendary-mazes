import {
  DistanceGrid,
  MazeCanvasRenderer,
  MazeGrid,
  RecursiveBacktracker,
} from './legendary-mazes.js';

const maze = new MazeGrid(48, 32);
const builder = new RecursiveBacktracker(maze);
const distances = new DistanceGrid(maze);
const renderer = new MazeCanvasRenderer(maze, ["#111", "#765", "#aaa", "#f30", "#ff3", "#3f3", "#3ff", "#03f"]);

function build(showDistances = true) {

  builder.build();

  if (showDistances) {

    distances.build(maze.centralCell);
    renderer.setDistanceGrid(distances, { r: 256, g: 0, b: 32 }, { r: 230, g: 240, b: 255 });

  }

  console.log(`generated an ${maze.width}x${maze.height} pixels maze`);
}

build();

const canvas = document.getElementById('maze-canvas');

canvas.width = maze.width;
canvas.height = maze.height;

renderer.render(canvas.getContext('2d'));

import {
  DistanceGrid,
  MazeCanvasRenderer,
  MazeGrid,
  RecursiveBacktracker
} from "https://unpkg.com/legendary-mazes@1.2.0/legendary-mazes.js";

const maze = new MazeGrid(20, 30);

const canvas = document.getElementById("maze-canvas");
const ctx = canvas.getContext("2d");

canvas.width = maze.width;
canvas.height = maze.height;

let builder;
let distances;
let renderer;

const initializeMaze = () => {
  builder = new RecursiveBacktracker(maze);
  distances = new DistanceGrid(maze);
  renderer = new MazeCanvasRenderer(maze, [
    "#012",
    "#346",
    "#679",
    "#f30",
    "#ff3",
    "#3f3",
    "#3ff",
    "#03f"
  ]);
};

const nearColor = { r: 128, g: 0, b: 32 };
const farColor = { r: 255, g: 250, b: 230 };

const DELAY_BETWEEN_STEPS_MS = 20;
const DELAY_AFTER_FINISHED_MS = 1500;

let buildMode = "backtracker";

const buildNextStep = () => {
  switch (buildMode) {
    case "backtracker":
      if (!builder.isFinished) {
        builder.nextStep();
        renderer.render(ctx);
        setTimeout(buildNextStep, DELAY_BETWEEN_STEPS_MS);
      } else {
        setTimeout(() => {
          buildMode = "distances";
          distances.start(maze.centralCell);
          buildNextStep();
        }, DELAY_BETWEEN_STEPS_MS);
      }
      break;

    case "distances":
      if (!distances.isFinished) {
        distances.nextStep();
        renderer.setDistanceGrid(distances, nearColor, farColor);
        renderer.render(ctx);
        setTimeout(buildNextStep, DELAY_BETWEEN_STEPS_MS);
      } else {
        setTimeout(() => {
          buildMode = "backtracker";
          initializeMaze();
          builder.start();
          buildNextStep();
        }, DELAY_AFTER_FINISHED_MS);
      }
  }
};

initializeMaze();
builder.start();
buildNextStep();

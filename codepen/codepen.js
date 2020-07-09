import {
  DistanceGrid,
  MazeCanvasRenderer,
  MazeGrid,
  RecursiveBacktracker
} from "https://unpkg.com/legendary-mazes@1.2.0/legendary-mazes.js";

const maze = new MazeGrid(20, 30);

const canvas = document.getElementById("maze-canvas");
canvas.width = maze.width;
canvas.height = maze.height;
const ctx = canvas.getContext("2d");

let builder;
let distances;
let renderer;

function initializeMaze() {
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
}

const nearColor = { r: 128, g: 0, b: 32 };
const farColor = { r: 255, g: 250, b: 230 };

let buildMode;

function startMazeBuild() {
  initializeMaze();
  buildMode = "backtracker";
  builder.start();
  buildNextStep();
}

function renderMazeStep() {
  builder.nextStep();
  renderer.render(ctx);
}

function startDistancesBuild() {
  buildMode = "distances";
  distances.start(maze.centralCell);
  buildNextStep();
}

function renderDistancesStep() {
  distances.nextStep();
  renderer.setDistanceGrid(distances, nearColor, farColor);
  renderer.render(ctx);
}

function buildNextStep() {
  switch (buildMode) {
    case "backtracker":
      if (!builder.isFinished) {
        renderMazeStep();
        setTimeout(buildNextStep, 20);
      } else {
        setTimeout(startDistancesBuild, 20);
      }
      break;

    case "distances":
      if (!distances.isFinished) {
        renderDistancesStep();
        setTimeout(buildNextStep, 20);
      } else {
        setTimeout(startMazeBuild, 1500);
      }
  }
}

startMazeBuild();

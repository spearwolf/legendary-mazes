import {
  DistanceGrid,
  MazeCanvasRenderer,
  MazeGrid,
  RecursiveBacktracker,
} from "./legendary-mazes.js";

const maze = new MazeGrid(16, 16);

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
    "#03f",
  ]);
};

const nearColor = { r: 128, g: 0, b: 32 };
const farColor = { r: 255, g: 250, b: 230 };

const DELAY_BETWEEN_STEPS_MS = 20;
const DELAY_AFTER_FINISHED_MS = 1500;

let buildMode = "backtracker";

const nextStepReady = () => window.postMessage({ type: "nextStepReady" });

const buildNextStep = () => {
  switch (buildMode) {
    case "backtracker":
      if (!builder.isFinished) {
        builder.nextStep();
        renderer.render(ctx);
        nextStepReady();
      } else {
        buildMode = "distances";
        distances.start(maze.centralCell);
        buildNextStep();
      }
      break;

    case "distances":
      if (!distances.isFinished) {
        distances.nextStep();
        distances.maxDistance = distances.currentDistance;
        renderer.setDistanceGrid(distances, nearColor, farColor);
        renderer.render(ctx);
        nextStepReady();
      } else {
        window.postMessage({ type: "mazeReady" });
        // buildMode = "backtracker";
        // initializeMaze();
        // builder.start();
        // buildNextStep();
      }
  }
};

initializeMaze();
builder.start();
buildNextStep();

window.addEventListener("message", ({ data }) => {
  if (data.type === "buildNextStep") {
    buildNextStep();
  }
});

document.getElementById("nextStep").addEventListener("pointerdown", () => {
  window.postMessage({ type: "buildNextStep" });
});

document.addEventListener("keydown", ({ which }) => {
  if (which === 78) {
    // 'n'
    window.postMessage({ type: "buildNextStep" });
  }
});

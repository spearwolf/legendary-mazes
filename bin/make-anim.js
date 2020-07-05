import fs from "fs";
import path from "path";
import http from "http";
import serve from "serve-handler";
import puppeteer from "puppeteer";
import GIFEncoder from "gif-encoder-2";
import canvasPkg from "canvas";

const { createCanvas, Image } = canvasPkg;

const width = parseInt(process.env.MAZE_WIDTH || 320, 10);
const height = parseInt(process.env.MAZE_HEIGHT || width, 10);

const imagesPath = path.join(process.cwd(), "tmp");
fs.mkdirSync(imagesPath, { recursive: true });
console.log("Output directory is", imagesPath);

// const encoder = new GIFEncoder(width, height, "neuquant", true);
const encoder = new GIFEncoder(width, height, "octree", false);
encoder.start();
// encoder.setQuality(1);
encoder.setFrameRate(60);
encoder.setRepeat(0);

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.src = src;
  });

const server = http.createServer((request, response) =>
  serve(request, response)
);

server.listen(async () => {
  const { port } = server.address();
  console.log(`Using viewport size of ${width}x${height} pixels`);

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width, height });

  let shotId = 0;

  const workQueue = [];

  await page.exposeFunction("onNextStepReady", async () => {
    const shotFile = `screenshot-${(shotId++).toString().padStart(5, "0")}.png`;
    const fullShotPath = `${imagesPath}/${shotFile}`;
    console.log("Render frame", shotId);
    await page.screenshot({ path: fullShotPath });
    workQueue.push(
      loadImage(fullShotPath).then(() => {
        encoder.addFrame(ctx);
        fs.unlinkSync(fullShotPath);
      })
    );
  });

  await page.exposeFunction("onMazeReady", async () => {
    console.log("mazeReady.");
    await Promise.all(workQueue);
    encoder.finish();
    const animFile = path.join(process.cwd(), "legendary-maze.gif");
    console.log("Writing", animFile);
    fs.writeFileSync(animFile, encoder.out.getData());
    console.log("Thank you and have a nce day!");
    process.exit(0);
  });

  await page.evaluateOnNewDocument(() => {
    window.addEventListener("message", async (event) => {
      if (event.data.type === "nextStepReady") {
        await onNextStepReady();
        window.postMessage({ type: "buildNextStep" });
      } else if (event.data.type === "mazeReady") {
        onMazeReady();
      }
    });
  });

  await page.goto(`http://localhost:${port}/anim.html`);
});

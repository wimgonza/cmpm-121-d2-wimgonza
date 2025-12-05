import "./style.css";

// --- Title Setup ---
const title = document.createElement("h1");
title.textContent = "My Cool Drawing App";
document.body.append(title);

// --- Canvas Setup ---
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.classList.add("drawing-area");
document.body.append(canvas);

const ctx = canvas.getContext("2d")!;

// --- UI Setup ---
const clearButton = document.createElement("button");
clearButton.textContent = "Clear";
document.body.appendChild(clearButton);

type Point = { x: number; y: number };
let strokes: Point[][] = [];
let currentStroke: Point[] | null = null;

// --- Drawing State ---
let isDrawing = false;

// --- Helpers ---
function notifyDrawingChanged() {
  canvas.dispatchEvent(new Event("drawing-changed"));
}

canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const stroke of strokes) {
    if (stroke.length < 2) continue;

    ctx.beginPath();
    ctx.moveTo(stroke[0].x, stroke[0].y);

    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i].x, stroke[i].y);
    }

    ctx.stroke();
  }
});

function startDrawing(e: MouseEvent) {
  isDrawing = true;

  currentStroke = [{ x: e.offsetX, y: e.offsetY }];
  strokes.push(currentStroke);

  notifyDrawingChanged();
}

function draw(e: MouseEvent) {
  if (!isDrawing || !currentStroke) return;

  currentStroke.push({ x: e.offsetX, y: e.offsetY });

  notifyDrawingChanged();
}

function stopDrawing() {
  isDrawing = false;
  currentStroke = null;
}

function clearCanvas() {
  strokes = [];
  notifyDrawingChanged();
}

// --- Event Wiring ---
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
clearButton.addEventListener("click", clearCanvas);

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

// --- Drawing State ---
let isDrawing = false;
let lastPoint = { x: 0, y: 0 };

// --- Helpers ---
function startDrawing(e: MouseEvent) {
  isDrawing = true;
  lastPoint = { x: e.offsetX, y: e.offsetY };
}

function draw(e: MouseEvent) {
  if (!isDrawing) return;

  ctx.beginPath();
  ctx.moveTo(lastPoint.x, lastPoint.y);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();

  lastPoint = { x: e.offsetX, y: e.offsetY };
}

function stopDrawing() {
  isDrawing = false;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// --- Event Wiring ---
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
clearButton.addEventListener("click", clearCanvas);

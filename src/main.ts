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

const undoButton = document.createElement("button");
undoButton.textContent = "Undo";

const redoButton = document.createElement("button");
redoButton.textContent = "Redo";

document.body.append(clearButton, undoButton, redoButton);

// --- Types ---
type Point = { x: number; y: number };

// --- Display + Redo Stacks ---
let strokes: Point[][] = [];
let redoStack: Point[][] = [];
let currentStroke: Point[] | null = null;

// --- Drawing State ---
let isDrawing = false;

// --- Helpers ---
function notifyDrawingChanged() {
  canvas.dispatchEvent(new Event("drawing-changed"));
}

// --- Observer for Redraw ---
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

// --- Drawing Logic ---
function startDrawing(e: MouseEvent) {
  isDrawing = true;
  redoStack = [];

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

// --- Canvas tools ---
function clearCanvas() {
  strokes = [];
  redoStack = [];
  notifyDrawingChanged();
}

function undo() {
  if (strokes.length === 0) return;

  const lastStroke = strokes.pop()!;
  redoStack.push(lastStroke);
  notifyDrawingChanged();
}

function redo() {
  if (redoStack.length === 0) return;

  const restoredStroke = redoStack.pop()!;
  strokes.push(restoredStroke);
  notifyDrawingChanged();
}

// --- Event Wiring ---
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

clearButton.addEventListener("click", clearCanvas);
undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);

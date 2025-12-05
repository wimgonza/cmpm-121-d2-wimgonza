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

// --- Display Command Interface ---
interface DisplayCommand {
  drag(x: number, y: number): void;
  display(ctx: CanvasRenderingContext2D): void;
}

// --- Marker Line Command ---
class MarkerLineCommand implements DisplayCommand {
  private points: Point[] = [];

  constructor(startX: number, startY: number) {
    this.points.push({ x: startX, y: startY });
  }

  drag(x: number, y: number) {
    this.points.push({ x, y });
  }

  display(ctx: CanvasRenderingContext2D) {
    if (this.points.length < 2) return;

    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    ctx.stroke();
  }
}

// --- Display + Redo Stacks ---
let commands: DisplayCommand[] = [];
let redoStack: DisplayCommand[] = [];
let currentCommand: DisplayCommand | null = null;

// --- Drawing State ---
let isDrawing = false;

// --- Helpers ---
function notifyDrawingChanged() {
  canvas.dispatchEvent(new Event("drawing-changed"));
}

// --- Observer for Redraw ---
canvas.addEventListener("drawing-changed", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const cmd of commands) {
    cmd.display(ctx);
  }
});

// --- Drawing Logic ---
function startDrawing(e: MouseEvent) {
  isDrawing = true;
  redoStack = [];

  currentCommand = new MarkerLineCommand(e.offsetX, e.offsetY);
  commands.push(currentCommand);

  notifyDrawingChanged();
}

function draw(e: MouseEvent) {
  if (!isDrawing || !currentCommand) return;

  currentCommand.drag(e.offsetX, e.offsetY);
  notifyDrawingChanged();
}

function stopDrawing() {
  isDrawing = false;
  currentCommand = null;
}

// --- Canvas tools ---
function clearCanvas() {
  commands = [];
  redoStack = [];
  notifyDrawingChanged();
}

function undo() {
  if (commands.length === 0) return;

  const last = commands.pop()!;
  redoStack.push(last);
  notifyDrawingChanged();
}

function redo() {
  if (redoStack.length === 0) return;

  const restored = redoStack.pop()!;
  commands.push(restored);
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

import "./style.css";

const title = document.createElement("h1");
title.textContent = "My Cool Drawing App";
document.body.appendChild(title);

const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.classList.add("drawing-area");
document.body.appendChild(canvas);

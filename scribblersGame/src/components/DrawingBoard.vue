<script setup>
import { ref, onMounted } from "vue";

//define the emit function to send events to parent
const emit = defineEmits();

const canvasRef = ref(null);
let context = null;
let undoHistory = [];
let draw_color = "black";
let is_drawing = false;
let draw_width = 1;
const start_background_color = "white";

onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }

    // Set up canvas size
    canvas.width = 1201;
    canvas.height = 400;
    context = canvas.getContext("2d");
    context.fillStyle = start_background_color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Event Listeners
    canvas.addEventListener("mousedown", saveState);
    canvas.addEventListener("touchstart", start, false);
    canvas.addEventListener("touchmove", draw, false);
    canvas.addEventListener("mousedown", start, false);
    canvas.addEventListener("mousemove", draw, false);
    canvas.addEventListener("touchend", stop, false);
    canvas.addEventListener("mouseup", stop, false);
    canvas.addEventListener("mouseout", stop, false);

    document.querySelectorAll(".color-field").forEach((div) => {
        div.addEventListener("click", () => {
            draw_color = div.style.background;
        });
    });

    document.querySelector(".pen-range").addEventListener("input", function () {
        draw_width = this.value;
    });

    document.querySelector(".Cbutton").addEventListener("click", clear_canvas);
    document.querySelector(".Ubutton").addEventListener("click", undo_action);
});

//  Pushes current canvas state onto undo stack
function saveState() {
    if (context) {
        undoHistory.push(context.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
    }
}

//  Start new drawing stroke
function start(event) {
    if (!context) return;

    const rect = canvasRef.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    emit("startDrawData", x, y, draw_color, draw_width);
    //console.log("Drawing started");

    is_drawing = true;
    context.beginPath(); // Start a new path
    context.moveTo(x, y); // Set starting point at the cursor
}

//  Function to draw on canvas while mouse moves
function draw(event) {
    if (!is_drawing || !context) return;

    const rect = canvasRef.value.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    emit("addDrawData", x, y);
    //console.log("Drawing...");

    context.lineTo(x, y);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();

    event.preventDefault();
}

function stop(event) {
    if (!context) return;

    emit("endDrawData");
    //console.log("Drawing ended");

    is_drawing = false;
    context.closePath();
}

function clear_canvas() {
    if (context) {
        context.fillStyle = start_background_color;
        context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        context.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        emit("canvasClear");
    }
}

function undo_action() {
    if (context && undoHistory.length > 0) {
        let previousState = undoHistory.pop();
        context.putImageData(previousState, 0, 0);
        emit("canvasUndo", previousState);
    }
}
</script>

<template>
    <body>
        <div class="field" >
            <canvas id="canvas" ref="canvasRef"></canvas>
            <div class="tools"> 
                <!--creates buttons for undo and clear-->
                <button type="Ubutton" class="Ubutton">Undo</button>
                <button type="Cbutton" class="Cbutton">Clear</button>
                
                <!--creates buttons for colors-->
                    <div   class="color-field" style="background: red;"></div>
                    <div   class="color-field" style="background: orange;"></div>
                    <div   class="color-field" style="background: yellow;"></div>
                    <div   class="color-field" style="background: green;"></div>
                    <div   class="color-field" style="background: blue;"></div>
                    <div   class="color-field" style="background: indigo;"></div>
                    <div   class="color-field" style="background: violet;"></div>
                    <div   class="color-field" style="background: black;"></div>
                    <div   class="color-field" style="background: gray;"></div>
                    <div   class="color-field" style="background: rgb(114, 24, 24);"></div>

                    <input type="range" min="1" max="100" class="pen-range" value="1">
                </div>
            </div>
        
        <div id="app"></div>
    </body>
</template>

<style scoped>
    :root {
        font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-weight: 400;

        color-scheme: light dark;
        color: rgba(255, 255, 255, 0.87);
        background-color: #242424;

        font-synthesis: none;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    a {
        font-weight: 500;
        color: #646cff;
        text-decoration: inherit;
    }
    a:hover {
        color: #535bf2;
    }

    body {
        margin: 0;
        display: flex;
        place-items: top center;
        min-width: 320px;
        min-height: 100vh;
    }

    h1 {
        font-size: 3.2em;
        line-height: 1.1;
    }

    button {
        border-radius: 8px;
        border: 2px solid;
        padding: 0.6em 1.2em;
        font-size: 1em;
        font-weight: 500;
        font-family: inherit;
        background-color: #f6f3f3;
        cursor: pointer;
        transition: border-color 0.25s;
    }
    button:hover {
        border-color: #646cff;
    }
    button:focus,
    button:focus-visible {
        outline: 4px auto -webkit-focus-ring-color;
    }

    .card {
        padding: 2em;
    }

    #app {
        max-width: 1280px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
    }

    @media (prefers-color-scheme: light) {
    :root {
        color: #213547;
        background-color: #ffffff;
    }
    a:hover {
        color: #747bff;
    }
    button {
        background-color: #f9f9f9;
    }
    }

    /* style for canvas */
    canvas {
        /*box-shadow: -3px 2px 9px 6px black;*/
        border: 2px solid #05080b;
        border-color: #05080b;
        cursor: pointer;
        background-color: white;
    }

    .tools {
        display: flex;
        justify-content: center;
        flex-direction: row;
        margin-top: 15px;
    }

    /* style for color buttons */
    .tools .color-field{
        height: 40px;
        width: 40px;
        min-height: 40px;
        min-width: 40px;
        cursor: pointer;
        display: inline-block;
        cursor: pointer;
        box-sizing: border-box;
        border-radius: 25%;
        border: 2px solid white;
        align-self: center;
        margin: 0 3px;
    }

    /* style for buttons */
    .tools .button{
        border-radius: 0;
        align-self: center;
        width: 100px;
        height: 40px;
        border: 2px solid white;
        cursor: pointer;
        color: white;
        background: #222;
        font-weight: bold;
        margin: 0 3px;

    }

    .color-picker {
        align-self: center;
        margin: 0 5px;
        height: 50px;

    }
    /* style for stroke width range */
        .pen-range {
        align-self: center;
        margin: 0 5px;
    }

</style>
<script setup>
import { ref, onMounted, watch } from "vue";

//define the emit function to send events to parent
const emit = defineEmits();
const props = defineProps(['isDrawer']);

const canvasRef = ref(null);
let context = null;
let undoHistory = [];
let draw_color = "black";
let is_drawing = false;
let draw_width = 1;
const start_background_color = "white";

// React to player role changes
watch(() => props.isDrawer, (currentValue) => {

    //  Hide drawing tools for non-drawers
    if (currentValue == true)
        document.querySelector(".tools").style.display = 'inline';
    else
        document.querySelector(".tools").style.display = 'none';
});

onMounted(() => {
    const canvas = canvasRef.value;

    // Set up canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    //const canvas = canvasRef.value;
    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }

    canvasRef.value.width = canvasRef.value.offsetWidth;
    canvasRef.value.height = canvasRef.value.offsetHeight;

    context = canvas.getContext("2d");
    context.fillStyle = start_background_color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Drawing Event Listeners
    canvas.addEventListener("mousedown", saveState);
    canvas.addEventListener("touchstart", start, false);
    canvas.addEventListener("touchmove", draw, false);
    canvas.addEventListener("mousedown", start, false);
    canvas.addEventListener("mousemove", draw, false);
    canvas.addEventListener("touchend", stop, false);
    canvas.addEventListener("mouseup", stop, false);
    canvas.addEventListener("mouseout", stop, false);
   
    // Button Event Listeners
    document.querySelector(".Cbutton").addEventListener("click", clear_canvas);
    document.querySelector(".Ubutton").addEventListener("click", undo_action);   
    document.querySelectorAll(".color-field").forEach((div) => {
        div.addEventListener("click", () => {
            draw_color = div.style.background;
        });
    });
    document.querySelector(".pen-range").addEventListener("input", function () {
        draw_width = this.value;
    });

    // Drawing tools disabled by default
    document.querySelector(".tools").style.display = 'none';
});

//  Pushes current canvas state onto undo stack
function saveState() {
    if (context) {
        undoHistory.push(context.getImageData(0, 0, canvasRef.value.width, canvasRef.value.height));
    }
}

//  Start new drawing stroke
function start(event) {
    if (!context || !props.isDrawer) return;

    const rect = canvasRef.value.getBoundingClientRect();

    const scaleX = canvasRef.value.width / rect.width;
    const scaleY = canvasRef.value.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    
    emit("startDrawData", x, y, draw_color, draw_width);

    is_drawing = true;
    context.beginPath(); // Start a new path
    context.moveTo(x, y); // Set starting point at the cursor
}

//  Function to draw on canvas while mouse moves
function draw(event) {
    if (!is_drawing || !context || !props.isDrawer) return;

    const rect = canvasRef.value.getBoundingClientRect();

    const scaleX = canvasRef.value.width / rect.width;
    const scaleY = canvasRef.value.height / rect.height;

    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    emit("addDrawData", x, y);

    context.lineTo(x, y);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
    event.preventDefault();
}

function stop(event) {
    if (!context || !props.isDrawer) return;

    emit("endDrawData");

    is_drawing = false;
    context.closePath();
}

function clear_canvas() {
    if (context && props.isDrawer) {
        context.fillStyle = start_background_color;
        context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        context.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height);
        emit("canvasClear");
    }
}

function undo_action() {
    if (context && undoHistory.length > 0 && props.isDrawer) {
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
                <button type="button" class="Ubutton">↩️ Undo</button> 
                <button type="button" class="Cbutton">🧽 Clear</button>

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
        /* margin: inherit; */
        height: 88%;
        width: 93%;
        display: flex;
        place-items: top center;
        /* 
        min-height: 100vh; */
        border: solid black;
        border-radius: 25px;
    }

    h1 {
        font-size: 3.2em;
        line-height: 1.1;
    }

    button {
        border-radius: 8px;
        border: 2px solid;
        width: 120px; /* Optional: fixed width */
        height: 40px; /* Set your desired button height */
        font-size: 25px;
        font-weight: 600;
        font-family: inherit;
        background-color: #f6f3f3;
        cursor: pointer;
        transition: border-color 0.25s;

        display: flex;
        align-items: center;
        justify-content: center;

        overflow: hidden; /* Just in case text overflows */
        line-height: 1.1; /* Controls spacing inside text */
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
        margin: inherit;
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
        width: 99.9%;
        height: 270px;
        border: 10px solid #0481ff;
        border-radius: 20px;
        border-color: #1676d6;
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
import {generate2DGridAdjacencyList, addNode, removeNode } from "./grid";
import {bfs} from "./bfs";
import {dfs} from "./dfs";
import {aStar} from "./a-star";

// Get the canvas element by its ID
export const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Get the 2D rgoalering context
const ctx = canvas.getContext('2d');

// grid definitions
const fillColor = '#FF0000'; // Fill color for the squares
export const gridOrigin = canvas.height * 0.2;
const gridEnd = canvas.height * 0.8;
const nOfSquares = 20;
export const gridSize = (gridEnd - gridOrigin) / nOfSquares;
export const rows = 20;
const cols = 20;
let grid = generate2DGridAdjacencyList(20, 20);


let start = {
    placed: false,
    row: -1,
    col: -1,
}
let startGridNode: number = 20;
let goal = {
    placed: false,
    row: -1,
    col: -1,
}
let goalGridNode: number = 203;


/**
 * Draws a rectangular grid of squares on a canvas.
 * @param {number} nOfSquares - The number of squares in each row/column of the grid.
 * @param {string} gridColor - The color of the grid lines.
 * @throws {Error} If the canvas 2D context cannot be obtained.
 */
function drawGrid(nOfSquares: number, gridColor: string) {  

    // check there is a canvas
    if (!ctx) {
        console.error('Failed to get the canvas 2D context');
        return;
    }
  
  
    // Draw grid lines
    console.log("run");
    for (let gridX = 0; gridX < nOfSquares; gridX++) {
        for (let gridY = 0; gridY < nOfSquares; gridY++) {
            const x = gridX * gridSize + gridOrigin;
            const y = gridY * gridSize + gridOrigin;
            fillSquare(x, y, gridSize, "white");
        }
    }
}


/**
 * Draws a canvas square on specified place on canvas with black border.
 * @param {number} x - x-coordinate for top right corner of rectangle including border
 * @param {number} y - y-coord
 * @param {number} gridSize -  size of rectangle in pixels
 * @param {string} color - inside color
 */
export function fillSquare(x: number, y: number, gridSize: number, color: string): void {
    if(ctx) {
        const borderWidth = 2;
        ctx.clearRect(x, y, gridSize, gridSize);
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, gridSize, gridSize);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, gridSize-borderWidth, gridSize-borderWidth);

    }
}


/**
 * Toggles the fill state of a square in a grid on the canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {number} row - The row index of the square to toggle.
 * @param {number} col - The column index of the square to toggle.
 * @param {number} nOfSquares - The number of squares in each row/column of the grid.
 * @param {string} fillColor - The color to fill the square with.
 * @param {boolean} isFilled - Whether the square is already filled a color.
 */
canvas.addEventListener('mousedown', (event: MouseEvent) => {
    function isFilled(): boolean {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        // Get the pixel color data of the clicked position
        if(ctx) {
            const imageData = ctx.getImageData(mouseX, mouseY, 1, 1).data;
            // Check if the clicked pixel is not white
            if(mouseX > gridOrigin && mouseX < gridEnd + gridSize && mouseY > gridOrigin && mouseY < gridEnd + gridSize) {
                const imageColor = (ctx.getImageData(mouseX, mouseY, 1, 1));
                console.log(imageColor.data);
                if (!(
                    // if not white or black
                    imageData[0] === 255 &&
                    imageData[1] === 255 &&
                    imageData[2] === 255
                ) && !  (imageData[0] === 0 &&
                    imageData[1] === 0 &&
                    imageData[2] === 0)) {
                    console.log("true");
                    return true;
                } else {
                    console.log("false");
                    return false;
                }
            }
        }
        console.log("error");
        return false;
    }

    function placeBlock(isFilled: boolean) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
         // Calculate the row and column in the grid based on the mouse position
         const row = Math.floor((mouseY - gridOrigin) / gridSize);
         const col = Math.floor((mouseX - gridOrigin) / gridSize);
         console.log(row * 20 + col, "node");
         console.log(col, "col");
         console.log(row, "row");
         if(mouseX > gridOrigin && mouseX < gridEnd&& mouseY > gridOrigin && mouseY < gridEnd) {

         switch (currentMode) {
            case 'start':
                // if block is already placed at cursor, remove block
                if (isFilled) {
                    toggleFill(canvas, row, col, nOfSquares, "yellow", true, "start");
                    // if block at cursor was the start block, mark it as removed
                    if(row === start.row && col === start.col) {
                        start.placed = false;
                        startGridNode = -1;
                        console.log("hello1");

                    } else {
                        // if it was another block, place a start block there instead
                        toggleFill(canvas, start.row, start.col, nOfSquares, "yellow", true, "start");
                        startGridNode = col+20*row;
                        console.log("hello2");

                    }
                    // else if there is no block at cursor
                } else {
                    // remove old start block and place new start block on new place
                    if (start.placed === true) {
                        toggleFill(canvas, start.row, start.col, nOfSquares, "yellow", true, "start");
                        toggleFill(canvas, row, col, nOfSquares, "yellow", false, "start");
                        startGridNode = col+20*row;
                        console.log("hello3");

                        // if no start block is placed anywhere and cursor on blank space place start.
                    } else {
                        toggleFill(canvas, row, col, nOfSquares, "yellow", false, "start");
                        start.placed = true;
                        startGridNode = col+20*row;
                        console.log("hello4");

                    }
                }
                start.row = row;
                start.col = col;
                break;
            case 'goal':
                if (isFilled) {
                    toggleFill(canvas, row, col, nOfSquares, "green", true, "goal");
                    if(row === goal.row && col === goal.col) {
                        goal.placed = false;
                        goalGridNode = -1;
                    } else {
                        toggleFill(canvas, goal.row, goal.col, nOfSquares, "green", true, "goal");
                        goalGridNode = col+20*row;
                    }
                } else {
                    if (goal.placed === true) {
                        toggleFill(canvas, goal.row, goal.col, nOfSquares, "green", true, "goal");
                        toggleFill(canvas, row, col, nOfSquares, "green", false, "goal");
                        goalGridNode = col+20*row;
                    } else {
                        toggleFill(canvas, row, col, nOfSquares, "green", false, "goal");
                        goal.placed = true;
                        goalGridNode = col+20*row;
                    }
                }
                goal.row = row;
                goal.col = col;
                break;
            case 'wall':
                if (isFilled) {
                    toggleFill(canvas, row, col, nOfSquares, "red", true, "wall");
                } else {
                    toggleFill(canvas, row, col, nOfSquares, "red", false, "wall");
                }
                break;
            default:
                console.error('No mode selected');
        }
    }
    }

    placeBlock(isFilled());

});


function toggleFill(canvas: HTMLCanvasElement, row: number, col: number, nOfSquares: number, fillColor: string, isFilled: boolean, type: string) {
    // Get the 2D rgoalering context for the canvas
    const ctx = canvas.getContext('2d');

    // Check there is a canvas
    if (!ctx) {
        console.error('Failed to get the canvas 2D context');
        return;
    }
    // Calculate coordinates of the clicked square
    const x = col * gridSize + gridOrigin;
    const y = row * gridSize + gridOrigin;

    // Get the color data of the clicked square

    if (isFilled) {
        // Clear the square if it's already filled with the target color
        fillSquare(x, y, gridSize, "white");
        const gridNode = col+20*row;
        if(type === "wall") {
            addNode(grid, gridNode, rows, cols);
            console.log("node added");
        }
    } else {
        // Fill the square with the specified color if it's not filled
        const gridNode = col+20*row;
        if (type === "wall") {
            removeNode(grid, gridNode, rows, cols)
            console.log("node removed");
        }
        fillSquare(x, y, gridSize, fillColor);
    }
}

/**
 * Fills a path of squares on the canvas with a specified color.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {number[]} path - An array containing indices of squares in the path.
 * @param {number} rows - The number of rows in the grid.
 * @param {number} cols - The number of columns in the grid.
 * @param {string} fillColor - The color to fill the squares with.
 */
export function fillPath(canvas: HTMLCanvasElement, path: number[], fastestPath: number[], rows: number, cols: number, fillColor: string, fastestPathColor: string, delay: number) {
    // Get the 2D rgoalering context for the canvas
    const ctx = canvas.getContext('2d');
    // Check there is a canvas
    if (!ctx) {
        console.error('Failed to get the canvas 2D context');
        return;
    }


    // draw out all visited squares
    // draw out all visited squares with fillColor
    for(let i = 0; i < path.length; i++) {
        const xPos = (path[i] % rows) * gridSize + gridOrigin;
        const yPos = Math.floor(path[i] / rows) * gridSize + gridOrigin;

        setTimeout(() => {
            fillSquare(xPos, yPos, gridSize, fillColor);
        }, delay * i);
    }

    // Apply fastestPathColor with delay
    for(let i = 0; i < fastestPath.length; i++) {
        const xPos = (fastestPath[i] % rows) * gridSize + gridOrigin;
        const yPos = Math.floor(fastestPath[i] / rows) * gridSize + gridOrigin;

        setTimeout(() => {
            fillSquare(xPos, yPos, gridSize, fastestPathColor);
        }, delay * (path.length + i));
    }
        
}


let currentMode: 'start' | 'goal' | 'wall' | null = null;
let currentAlgorithm: "bfs" | "dfs" | "aStar" | null = null;

document.getElementById('startButton')?.addEventListener('click', () => {
    currentMode = 'start';
    console.log("start");
});

document.getElementById('goalButton')?.addEventListener('click', () => {
    currentMode = 'goal';
    console.log("goal");
});

document.getElementById('wallButton')?.addEventListener('click', () => {
    currentMode = 'wall';
    console.log("wall");
});

document.getElementById('resetButton')?.addEventListener('click', () => {
    resetSim();
});

document.getElementById('runButton')?.addEventListener('click', () => {
    if (currentAlgorithm === "bfs") {
        let [fastestPath, visited] = bfs(startGridNode, goalGridNode, grid);
        runSim(fastestPath, visited);
    } else if (currentAlgorithm === "dfs") {
        let [fastestPath, visited] = dfs(startGridNode, goalGridNode, grid);
        runSim(fastestPath, visited);
    } else if (currentAlgorithm === "aStar") {
        let [fastestPath, visited] = aStar(startGridNode, goalGridNode, grid);
        runSim(fastestPath, visited);
    } else {
        return null;
    }
});

document.getElementById("dfsButton")?.addEventListener("click", () => {
    currentAlgorithm = "dfs";
})
document.getElementById("bfsButton")?.addEventListener("click", () => {
    currentAlgorithm = "bfs";
})
document.getElementById("aStarButton")?.addEventListener("click", () => {
    currentAlgorithm = "aStar";
})

function runSim(fastestPath: number[], visited: number[]) {
    if (fastestPath && fastestPath.length > 0) {
        fillPath(canvas, visited, fastestPath, 20, 20, "gray", "blue", 50);
    } else {
        console.error("No valid path found.");
    }
    console.log(currentAlgorithm);
}

function startSim() {
    drawGrid(20, "black");
}

function resetSim() {
    // reset nodes
    grid = generate2DGridAdjacencyList(20, 20);

    // reset grid graphics
    drawGrid(20, "black");
}

startSim();
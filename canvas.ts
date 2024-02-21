import {generate2DGridAdjacencyList, addNode, removeNode } from "./grid";
import {bfs} from "./bfs";
// Get the canvas element by its ID
const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// Get the 2D rgoalering context
const ctx = canvas.getContext('2d');

// grid definitions
const fillColor = '#FF0000'; // Fill color for the squares
const gridOrigin = canvas.height * 0.2;
const gridEnd = canvas.height * 0.8;
const nOfSquares = 20;
const gridSize = (gridEnd - gridOrigin) / nOfSquares;
const rows = 20;
const cols = 20;
let grid = generate2DGridAdjacencyList(20, 20);
console.log(grid);

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


// Function to draw a rectangular grid of squares on a canvas
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
  
    // Set the color for the grid lines
    ctx.strokeStyle = gridColor;
  
  
    // Draw grid lines
    for (let gridX = 0; gridX <= nOfSquares; gridX++) {
        for (let gridY = 0; gridY <= nOfSquares; gridY++) {
            const x = gridX * gridSize + gridOrigin;
            const y = gridY * gridSize + gridOrigin;
            ctx.strokeStyle = "black";
            ctx.strokeRect(x, y, gridSize, gridSize);
            ctx.fillStyle = "white";
            ctx.fillRect(x,y, gridSize, gridSize);
        }
    }
}

/**
 * Toggles the fill state of a square in a grid on the canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {number} row - The row index of the square to toggle.
 * @param {number} col - The column index of the square to toggle.
 * @param {number} nOfSquares - The number of squares in each row/column of the grid.
 * @param {string} fillColor - The color to fill the square with.
 * @param {boolean} isFilled - Whether the square is already filled with the target color.
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
                if (!(
                    // if not white
                    imageData[0] === 255 &&
                    imageData[1] === 255 &&
                    imageData[2] === 255
                )) {
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
         if(mouseX > gridOrigin && mouseX < gridEnd + gridSize && mouseY > gridOrigin && mouseY < gridEnd + gridSize) {

         switch (currentMode) {
            case 'start':
                if (isFilled) {
                    toggleFill(canvas, row, col, nOfSquares, "yellow", true, "start");
                    if(row === start.row && col === start.col) {
                        start.placed = false;
                        startGridNode = -1;

                    } else {
                        toggleFill(canvas, start.row, start.col, nOfSquares, "yellow", true, "start");
                        startGridNode = col+20*row;

                    }
                } else {
                    if (start.placed === true) {
                        toggleFill(canvas, start.row, start.col, nOfSquares, "yellow", true, "start");
                        toggleFill(canvas, row, col, nOfSquares, "yellow", false, "start");
                    } else {
                        toggleFill(canvas, row, col, nOfSquares, "yellow", false, "start");
                        start.placed = true;
                        startGridNode = col+20*row;

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
    // Get the color data of the clicked square

    if (isFilled) {
        // Clear the square if it's already filled with the target color
    // Clear the square if it's already filled with the target color
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, gridSize, gridSize);
    // Redraw the square border if necessary
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, gridSize, gridSize);
    const gridNode = col+20*row;
    if(type === "wall") {
        addNode(grid, gridNode+1, rows, cols);
        console.log("node added");

    }
 
    } else {
        // Fill the square with the specified color if it's not filled
        const gridNode = col+20*row;
        if (type === "wall") {
            removeNode(grid, gridNode, rows, cols)
            console.log("node removed");
        }
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, gridSize, gridSize);

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
function fillPath(canvas: HTMLCanvasElement, path: number[], rows: number, cols: number, fillColor: string) {
    // Get the 2D rgoalering context for the canvas
    const ctx = canvas.getContext('2d');

    // Check there is a canvas
    if (!ctx) {
        console.error('Failed to get the canvas 2D context');
        return;
    }


    // Fill each cell in the path
    for(let i = 0; i < path.length; i++) {
        const xPos = (path[i] % rows) * gridSize + gridOrigin;
        const yPos = Math.floor(path[i] / rows) * gridSize + gridOrigin;
        
        // Fill the cell with the specified color
        ctx.fillStyle = fillColor;
        ctx.fillRect(xPos, yPos, gridSize, gridSize);
    }
}

let currentMode: 'start' | 'goal' | 'wall' | null = null;

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



drawGrid(20, "black");
document.addEventListener('keydown', (event: KeyboardEvent) => {
    console.log(goalGridNode);
    console.log(startGridNode);
    if (event.key === 'e' && startGridNode !== -1 && goalGridNode !== -1) {
        let visited = bfs(startGridNode, goalGridNode, grid)[1];
        let fastestPath = bfs(startGridNode, goalGridNode, grid)[0];
        if (fastestPath && fastestPath.length > 0) {
            fillPath(canvas, visited, 20, 20, "gray");
            fillPath(canvas, fastestPath, 20, 20, "blue");
        } else {
            console.error("No valid path found.");
        }
    }
});
import {generate_2d_grid_adjacency_list, add_node, remove_node(} from "./grid";
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
export const grid_origin = canvas.height * 0.2;
const grid_end = canvas.height * 0.8;
const n_of_squares = 20;
export const grid_size = (grid_end - grid_origin) / n_of_squares;
export const rows = 20;
const cols = 20;
let grid = generate_2d_grid_adjacency_list(20, 20);


const start = {
    placed: false,
    row: -1,
    col: -1,
};
let start_grid_node = 20;
const goal = {
    placed: false,
    row: -1,
    col: -1,
};
let goal_grid_node = 203;


/**
 * Draws a rectangular grid of squares on a canvas.
 * @param {number} n_of_squares - The number of squares in each row/column of the grid.
 * @throws {Error} If the canvas 2D context cannot be obtained.
 */
function draw_grid(n_of_squares: number): void {  

    // check there is a canvas
    if (!ctx) {
        console.error('Failed to get the canvas 2D context');
        return;
    }
  
  
    // Draw grid lines
    console.log("run");
    for (let grid_x = 0; grid_x < n_of_squares; grid_x++) {
        for (let grid_y = 0; grid_y < n_of_squares; grid_y++) {
            const x = grid_x * grid_size + grid_origin;
            const y = grid_y * grid_size + grid_origin;
            fill_square(x, y, grid_size, "white");
        }
    }
}


/**
 * Draws a canvas square on specified place on canvas with black border.
 * @param {number} x - x-coordinate for top right corner of rectangle including border
 * @param {number} y - y-coord
 * @param {number} grid_size -  size of rectangle in pixels
 * @param {string} color - inside color
 */
export function fill_square(x: number, y: number, grid_size: number, color: string): void {
    if(ctx) {
        const border_width = 2;
        ctx.clearRect(x, y, grid_size, grid_size);
        ctx.fillStyle = "black";
        ctx.fillRect(x, y, grid_size, grid_size);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, grid_size-border_width, grid_size-border_width);

    }
}


/**
 * Toggles the fill state of a square in a grid on the canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {number} row - The row index of the square to toggle.
 * @param {number} col - The column index of the square to toggle.
 * @param {number} n_of_squares - The number of squares in each row/column of the grid.
 * @param {string} fill_color - The color to fill the square with.
 * @param {boolean} is_filled - Whether the square is already filled a color.
 */
canvas.addEventListener('mousedown', (event: MouseEvent) => {
    function is_filled(): boolean {
        const rect = canvas.getBoundingClientRect();
        const mouse_x = event.clientX - rect.left;
        const mouse_y = event.clientY - rect.top;
        // Get the pixel color data of the clicked position
        if(ctx) {
            const image_data = ctx.getimage_data(mouse_x, mouse_y, 1, 1).data;
            // Check if the clicked pixel is not white
            if(mouse_x > grid_origin && mouse_x < grid_end + grid_size && mouse_y > grid_origin && mouse_y < grid_end + grid_size) {
                const imageColor = (ctx.getimage_data(mouse_x, mouse_y, 1, 1));
                console.log(imageColor.data);
                if (!(
                    // if not white or black
                    image_data[0] === 255 &&
                    image_data[1] === 255 &&
                    image_data[2] === 255
                ) && !  (image_data[0] === 0 &&
                    image_data[1] === 0 &&
                    image_data[2] === 0)) {
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

    function place_block(is_filled: boolean): void {
        const rect = canvas.getBoundingClientRect();
        const mouse_x = event.clientX - rect.left;
        const mouse_y = event.clientY - rect.top;
         // Calculate the row and column in the grid based on the mouse position
         const row = Math.floor((mouse_y - grid_origin) / grid_size);
         const col = Math.floor((mouse_x - grid_origin) / grid_size);
         console.log(row * 20 + col, "node");
         console.log(col, "col");
         console.log(row, "row");
         if(mouse_x > grid_origin && mouse_x < grid_end&& mouse_y > grid_origin && mouse_y < grid_end) {

         switch (current_mode) {
            case 'start':
                // if block is already placed at cursor, remove block
                if (is_filled) {
                    toggle_fill(canvas, row, col, "yellow", true, "start");
                    // if block at cursor was the start block, mark it as removed
                    if(row === start.row && col === start.col) {
                        start.placed = false;
                        start_grid_node = -1;
                        console.log("hello1");

                    } else {
                        // if it was another block, place a start block there instead
                        toggle_fill(canvas, start.row, start.col, "yellow", true, "start");
                        start_grid_node = col+20*row;
                        console.log("hello2");

                    }
                    // else if there is no block at cursor
                } else {
                    // remove old start block and place new start block on new place
                    if (start.placed === true) {
                        toggle_fill(canvas, start.row, start.col, "yellow", true, "start");
                        toggle_fill(canvas, row, col, "yellow", false, "start");
                        start_grid_node = col+20*row;
                        console.log("hello3");

                        // if no start block is placed anywhere and cursor on blank space place start.
                    } else {
                        toggle_fill(canvas, row, col, "yellow", false, "start");
                        start.placed = true;
                        start_grid_node = col+20*row;
                        console.log("hello4");

                    }
                }
                start.row = row;
                start.col = col;
                break;
            case 'goal':
                if (is_filled) {
                    toggle_fill(canvas, row, col, "green", true, "goal");
                    if(row === goal.row && col === goal.col) {
                        goal.placed = false;
                        goal_grid_node = -1;
                    } else {
                        toggle_fill(canvas, goal.row, goal.col, "green", true, "goal");
                        goal_grid_node = col+20*row;
                    }
                } else {
                    if (goal.placed === true) {
                        toggle_fill(canvas, goal.row, goal.col, "green", true, "goal");
                        toggle_fill(canvas, row, col, "green", false, "goal");
                        goal_grid_node = col+20*row;
                    } else {
                        toggle_fill(canvas, row, col, "green", false, "goal");
                        goal.placed = true;
                        goal_grid_node = col+20*row;
                    }
                }
                goal.row = row;
                goal.col = col;
                break;
            case 'wall':
                if (is_filled) {
                    toggle_fill(canvas, row, col, "red", true, "wall");
                } else {
                    toggle_fill(canvas, row, col, "red", false, "wall");
                }
                break;
            default:
                console.error('No mode selected');
        }
    }
    }

    place_block(is_filled());

});


function toggle_fill(canvas: HTMLCanvasElement, row: number,
    col: number, fill_color: string,
    is_filled: boolean, type: string): void {
    // Get the 2D rgoalering context for the canvas
    const ctx = canvas.getContext('2d');

    // Check there is a canvas
    if (!ctx) {
        console.error('Failed to get the canvas 2D context');
        return;
    }
    // Calculate coordinates of the clicked square
    const x = col * grid_size + grid_origin;
    const y = row * grid_size + grid_origin;

    // Get the color data of the clicked square

    if (is_filled) {
        // Clear the square if it's already filled with the target color
        fill_square(x, y, grid_size, "white");
        const grid_node = col+20*row;
        if(type === "wall") {
            add_node(grid, grid_node, rows, cols);
            console.log("node added");
        }
    } else {
        // Fill the square with the specified color if it's not filled
        const grid_node = col+20*row;
        if (type === "wall") {
            remove_node(grid, grid_node, rows, cols);
            console.log("node removed");
        }
        fill_square(x, y, grid_size, fill_color);
    }
}

/**
 * Fills a path of squares on the canvas with a specified color.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {Array<number>} path - An array containing indices of squares in the path.
 * @param {number} rows - The number of rows in the grid.
 * @param {number} cols - The number of columns in the grid.
 * @param {string} fill_color - The color to fill the squares with.
 */
export function fill_path(canvas: HTMLCanvasElement, path: Array<number>, 
    fastest_path: Array<number>, rows: number, 
    fill_color: string, fastest_path_color: string, 
    delay: number): void {
    // Get the 2D rgoalering context for the canvas
    const ctx = canvas.getContext('2d');
    // Check there is a canvas
    if (!ctx) {
        console.error('Failed to get the canvas 2D context');
        return;
    }


    // draw out all visited squares
    // draw out all visited squares with fill_color
    for(let i = 0; i < path.length; i++) {
        const x_pos = (path[i] % rows) * grid_size + grid_origin;
        const y_pos = Math.floor(path[i] / rows) * grid_size + grid_origin;

        setTimeout(() => {
            fill_square(x_pos, y_pos, grid_size, fill_color);
        }, delay * i);
    }

    // Apply fastest_path_color with delay
    for(let i = 0; i < fastest_path.length; i++) {
        const x_pos = (fastest_path[i] % rows) * grid_size + grid_origin;
        const y_pos = Math.floor(fastest_path[i] / rows) * grid_size + grid_origin;

        setTimeout(() => {
            fill_square(x_pos, y_pos, grid_size, fastest_path_color);
        }, delay * (path.length + i));
    }
        
}


let current_mode: 'start' | 'goal' | 'wall' | null = null;
let current_algorithm: "bfs" | "dfs" | "aStar" | null = null;

document.getElementById('startButton')?.addEventListener('click', () => {
    current_mode = 'start';
    console.log("start");
});

document.getElementById('goalButton')?.addEventListener('click', () => {
    current_mode = 'goal';
    console.log("goal");
});

document.getElementById('wallButton')?.addEventListener('click', () => {
    current_mode = 'wall';
    console.log("wall");
});

document.getElementById('resetButton')?.addEventListener('click', () => {
    reset_sim();
});

document.getElementById('runButton')?.addEventListener('click', () => {
    if (current_algorithm === "bfs") {
        const [fastest_path, visited] = bfs(start_grid_node, goal_grid_node, grid);
        run_sim(fastest_path, visited);
    } else if (current_algorithm === "dfs") {
        const [fastest_path, visited] = dfs(start_grid_node, goal_grid_node, grid);
        run_sim(fastest_path, visited);
    } else if (current_algorithm === "aStar") {
        const [fastest_path, visited] = aStar(start_grid_node, goal_grid_node, grid);
        run_sim(fastest_path, visited);
    } else {
        return null;
    }
});

document.getElementById("dfsButton")?.addEventListener("click", () => {
    current_algorithm = "dfs";
});
document.getElementById("bfsButton")?.addEventListener("click", () => {
    current_algorithm = "bfs";
});
document.getElementById("aStarButton")?.addEventListener("click", () => {
    current_algorithm = "aStar";
});

function run_sim(fastest_path: Array<number>, visited: Array<number>): void {
    if (fastest_path && fastest_path.length > 0) {
        fill_path(canvas, visited, fastest_path, 20, "gray", "blue", 50);
    } else {
        console.error("No valid path found.");
    }
    console.log(current_algorithm);
}

function start_sim(): void {
    draw_grid(20);
}

function reset_sim(): void {
    // reset nodes
    grid = generate_2d_grid_adjacency_list(20, 20);

    // reset grid graphics
    draw_grid(20);
}

start_sim();
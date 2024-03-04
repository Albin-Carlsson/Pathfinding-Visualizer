
import {AdjacencyList} from "./grid";
import {  empty, is_empty, head, dequeue, enqueue} from '../lib/queue_array';



/**
 * Calculates the shortest path according to the bfs-algorithm
 * @param {number} start start node
 * @param {number} goal  goal node
 * @param {AdjacencyList} grid  The grid as an adjacencyList
 * 
 * @returns {Array<number[]>} an array of two values. First the shortest path. 
 * Second, all the visited nodes. If no path is found the function returns an empty array.
 * 
 * @example
 * // Assuming a predefined AdjacencyList for a 3x3 grid
 * const result = bfs(0, 8, grid); // Find path from top-left to bottom-right
 * console.log(result[0]); // Logs the path from start to goal
 * console.log(result[1]); // Logs the visited nodes
 */
export function bfs(start: number, goal: number, grid: AdjacencyList): Array<Array<number>> {
    const visited = new Set<number>(); // Set to keep track of visited nodes
    const queue = empty<number>();
    enqueue(start, queue);
    
    const predecessors: Map<number, number> = new Map(); // To reconstruct the path

    while (!is_empty(queue)) {
        const current = head(queue);
        dequeue(queue);

        if (visited.has(current)) {
            continue; // Skip if already visited
        }

        visited.add(current); // Mark as visited

        if (current === goal) { // Goal check
            // Reconstruct the path from goal to start
            const path = [goal];
            let step = goal;
            while (predecessors.has(step) && step !== start) {
                step = predecessors.get(step)!;
                path.unshift(step); // Add step to the beginning of the path
            }
            const arr_visited = Array.from(visited);
            return [path, arr_visited];
        }

        const neighbors = grid.get(current) || [];
        neighbors.forEach(neighbor => {
            if (!visited.has(neighbor)) {
                predecessors.set(neighbor, current); // Set predecessor for path reconstruction
                enqueue(neighbor, queue);
            }
        });
    }
    
    return []; // Return null if the goal is not reachable from the start
}

/*
// Usage example with the grid from your previous code
const grid = generate2DGridAdjacencyList(20, 43);

const start = 0; // Start node
const goal = 17; // Goal node

const adjList = generate2DGridAdjacencyList(6, 5);
const path = bfs(start, goal, adjList);

console.log(path); // Log the path from start to goal
*/
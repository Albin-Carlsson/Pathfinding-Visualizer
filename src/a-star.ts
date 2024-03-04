import { AdjacencyList} from "./grid";
import { grid_origin, grid_size, rows } from './canvas';
type NodeInfo = {f: number, g: number, h: number}; // distances. g = to goal, h = from start, f = sum of g and h


/**
 * Calculates distance between two nodes with manhattan distance, using
 * the global variables of the grid size
 * @param n1 current node
 * @param n2 goal node
 * @returns distance between "n1" and "n2"
 */
function dist_to_node(n1: number , n2: number): number {
    const current_x_pos = (n1 % rows) * grid_size + grid_origin;
    const current_y_pos = Math.floor(n1 / rows) * grid_size + grid_origin;
    
    const goal_x_pos = (n2 % rows) * grid_size + grid_origin;
    const goal_y_pos = Math.floor(n2 / rows) * grid_size + grid_origin;
    
    const x = Math.abs(goal_x_pos - current_x_pos);
    const y = Math.abs(goal_y_pos - current_y_pos);
    
    const distance: number = x + y;

    return distance;
}

/**
 * Calculates the shortest path according to the a* algorithm
 * @param {number} start start node
 * @param {number} goal  goal node
 * @param {AdjacencyList} grid  The grid as an adjacencyList
 * 
 * @returns {Array<number[]>} an array of two values. First the shortest path. 
 * Second, all the visited nodes. If no path is found the function returns an empty array
 * 
 * @example
 * // Assuming a predefined AdjacencyList for a 3x3 grid
 * const result = a_star(0, 8, grid); // Find path from top-left to bottom-right
 * console.log(result[0]); // Logs the path from start to goal
 * console.log(result[1]); // Logs the visited nodes
 */
export function a_star(start: number, goal: number, grid: AdjacencyList): Array<Array<number>> {
    const visited = new Set<number>(); // Evaluated nodes
    const next = new Set<number>(); // Nodes to be evaluated
    
    
    const predecessors: Map<number, number> = new Map(); // To reconstruct the path
    const distance: Map<number, NodeInfo> = new Map(); // Store the f, g, and h values for each node
    
    // Initialize the start node
    next.add(start);
    distance.set(start, {f: 0, g: 0, h: dist_to_node(start, goal)});

    while (next.size > 0) {
        // Consider the node with the lowest f score in the open list
        let current = Array.from(next).reduce((a, b) => distance.get(a)!.f < distance.get(b)!.f ? a : b);

       if (current === goal) { // Goal check
            // Construct the path
            const path = [];
            while (current !== undefined) {
                path.unshift(current);
                current = predecessors.get(current)!;
            }

            const arr_visited: Array<number> = Array.from(visited); 
            return [path, arr_visited]; // Return the path and all visited nodes
        }

        // Move the current node from the to visited
        next.delete(current);
        visited.add(current);

        // Look at all neighbors of the current node
        const neighbors = grid.get(current) || [];
        neighbors.forEach(neighbor => {
            // G value for neighbor
            const new_g = distance.get(current)!.g + 1; 

            // Skip if neighbor is in the closed list, but allow reconsideration if a shorter path is found
            if (visited.has(neighbor) && (distance.get(neighbor)?.g ?? Infinity) <= new_g) return;

            if (!next.has(neighbor) || new_g < (distance.get(neighbor)?.g ?? Infinity)) {
                // If an equal or better path is found, replace it
                predecessors.set(neighbor, current);
                distance.set(neighbor, { f: new_g + dist_to_node(neighbor, goal), // Update f, g, and h values
                                         g: new_g,
                                         h: dist_to_node(neighbor, goal) });

                // Add the neighbor to the open list if it's not already there
                if (!next.has(neighbor)) {
                    next.add(neighbor);
                } else if (visited.has(neighbor)) {
                    // If the neighbor is in the closed list but a better path is found, it needs to be reconsidered
                    visited.delete(neighbor);
                    next.add(neighbor);
                }
            }
        });
    }

    // Return an empty array if the goal is not reachable
    return [];
}

import { AdjacencyList } from "./grid";
/**
 * Performs a Depth-First Search (DFS) on a grid represented as an adjacency list, to find a path from a start node to a goal node.
 * This function uses a stack to manage the nodes to be visited, marking each visited node to avoid revisiting them. If the goal node
 * is reached, the function reconstructs and returns the path from the start node to the goal node, along with the list of visited nodes.
 * If the goal is not reachable from the start, the function returns an empty array.
 * 
 * @param {number} start - The identifier of the start node in the grid.
 * @param {number} goal - The identifier of the goal node in the grid.
 * @param {AdjacencyList} grid - The adjacency list representing the grid, where each key is a node identifier, and the value is an array
 * of identifiers for adjacent nodes.
 * @returns {Array<Array<number>>} - A 2-element array where the first element is an array representing the path from the start node to the goal
 * node (inclusive), and the second element is an array of all visited nodes' identifiers. Returns an empty array if the goal is not reachable.
 *
 * @example
 * // Assuming a predefined AdjacencyList for a 3x3 grid
 * const pathAndVisited = dfs(0, 8, grid); // Find path from top-left to bottom-right
 * console.log(pathAndVisited[0]); // Logs the path from start to goal
 * console.log(pathAndVisited[1]); // Logs the visited nodes
 */
export function dfs(start: number, goal: number, grid: AdjacencyList): Array<Array<number>> {
    const visited = new Set<number>(); // Set to keep track of visited nodes
    const stack: Array<number> = [start]; // Use an array as a stack, push to add, pop to remove

    const predecessors: Map<number, number> = new Map(); // To reconstruct the path

    while (stack.length > 0) {
        const current = stack.pop()!; // Remove and get the last element of the stack

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
                stack.push(neighbor); // Add neighbor to the stack
            }
        });
    }

    return []; // Return empty array if the goal is not reachable from the start
}

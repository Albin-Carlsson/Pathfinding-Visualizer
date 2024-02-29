import { AdjacencyList, generate2DGridAdjacencyList } from "./grid";
import { gridOrigin, gridSize, rows } from './canvas';
import { includes } from "lodash";
type nodeInfo = {f: number, g: number, h: number}; // distances. g = to goal, h = from start, f = sum of g and h


/**
 * Calculates distance between two nodes using pythagoras using 
 * the global variables of the grid size
 * @param n1 current node
 * @param n2 goal node
 * @returns distance between "n1" and "n2"
 */
function distToNode(n1: number , n2: number): number {
    let distance: number;
    let CurrentXPos = (n1 % rows) * gridSize + gridOrigin;
    let CurrentYPos = Math.floor(n1 / rows) * gridSize + gridOrigin;
    
    let GoalXPos = (n2 % rows) * gridSize + gridOrigin;
    let GoalYPos = Math.floor(n2 / rows) * gridSize + gridOrigin;

    let x = Math.abs(GoalXPos - CurrentXPos);
    let y = Math.abs(GoalYPos - CurrentYPos);
    distance = x + y;

    return distance;
}


export function aStar(start: number, goal: number, grid: AdjacencyList): Array<number[]> {
    let next = new Set<number>(); // Nodes to be evaluated
    next.add(start);

    let visited = new Set<number>(); // Evaluated nodes

    let predecessors: Map<number, number> = new Map(); // To reconstruct the path
    let distance: Map<number, nodeInfo> = new Map(); // Store the f, g, and h values for each node

    // Initialize the start node
    distance.set(start, {f: 0, g: 0, h: distToNode(start, goal)});

    while (next.size > 0) {
        // Consider the node with the lowest f score in the open list
        let current = Array.from(next).reduce((a, b) => distance.get(a)!.f < distance.get(b)!.f ? a : b);

       if (current === goal) { // Goal check
            // Construct the path
            let path = [];
            while (current !== undefined) {
                path.unshift(current);
                current = predecessors.get(current)!;
            }
            return [path, Array.from(visited)]; // Return the path and all visited nodes
        }

        // Move the current node from the open list to the closed list
        next.delete(current);
        visited.add(current);

        // Look at all neighbors of the current node
        let neighbors = grid.get(current) || [];
        neighbors.forEach(neighbor => {
            // Skip if neighbor is in the closed list, but allow reconsideration if a shorter path is found
            if (visited.has(neighbor) && (distance.get(neighbor)?.g ?? Infinity) <= distance.get(current)!.g + 1) return;

            // G value for neighbor
            let newG = distance.get(current)!.g + 1; 

            if (!next.has(neighbor) || newG < (distance.get(neighbor)?.g ?? Infinity)) {
                // If an equal or better path is found, replace it
                predecessors.set(neighbor, current);
                distance.set(neighbor, {
                    f: newG + distToNode(neighbor, goal), // Update f, g, and h values
                    g: newG,
                    h: distToNode(neighbor, goal)
                });

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

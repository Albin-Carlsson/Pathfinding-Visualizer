
import { AdjacencyList, generate2DGridAdjacencyList } from "./grid";
import {  empty, is_empty, head, dequeue, enqueue} from '../lib/queue_array';
import { gridOrigin, gridSize, rows } from './canvas';
import { curry } from "lodash";

/**
 * Calculates distance between two nodes using pythagoras assuming 
 * the size of the grid to be 20x20
 * @param n1 current node
 * @param n2 goal node
 * @returns distance between "n1" and "n2"
 */
function distance(n1: number , n2: number): number {
    let distance: number;
    let CurrentXPos = (n1 % rows) * gridSize + gridOrigin;
    let CurrentYPos = Math.floor(n1 / rows) * gridSize + gridOrigin;
    
    let GoalXPos = (n2 % rows) * gridSize + gridOrigin;
    let GoalYPos = Math.floor(n2 / rows) * gridSize + gridOrigin;

    let x = GoalXPos - CurrentXPos;
    let y = GoalYPos - CurrentYPos;
    distance = Math.sqrt(y * y + x * x);

    return distance;
}

export function aStar(start: number, goal: number, grid: AdjacencyList): Array<number[]> {
    let visited = new Set<number>(); // Visited nodes
    let queue = empty<number>(); 
    
    let distToGoal: Map<number, number> = new Map(); // Distance from node to goal
    let distFromStart: Map<number, number> = new Map(); // Distance from the start node
     
    distFromStart.set(start, 0);
    distToGoal.set(start, distance(start, goal));
    enqueue(start, queue);
    
    let predecessors: Map<number, number> = new Map(); // To reconstruct the path

    function constructPath(node: number): Array<number> {
        // Reconstruct the path from goal to start
        let path = [node];
        let step = node;
        while (predecessors.has(step) && step !== start) {
            step = predecessors.get(step)!;
            path.unshift(step); // Add step to the beginning of the path
        }
        return path;
    }
    function comparison(n1: number, n2: number): number { // Compare distances (for sorting the list of neighbors later in the code)
        let distStartn1 = distFromStart.get(n1) || 0;
        let distGoaln1 = distToGoal.get(n1) || 0;
        
        let distStartn2 = distFromStart.get(n2) || 0;
        let distGoaln2 = distToGoal.get(n2) || 0;
        
        let distn1 = distStartn1 + distGoaln1;
        let distn2 = distStartn2 + distGoaln2;

        return distn1 > distn2
                ? 1
                : distn1 === distn2 
                    ? 0
                    : -1;
    }

    while (!is_empty(queue)) {
        const current = head(queue);
        dequeue(queue);

        if (visited.has(current)) {
            continue; // Skip if already visited
        }

        visited.add(current); // Mark as visited

        if (current === goal) { // Goal check
            const arrVisited = Array.from(visited);
            return [constructPath(goal), arrVisited];
        }

        const neighbors = grid.get(current) || [];
        neighbors.forEach(neighbor => {
            // Set distance to/from start for each neighbor
            let distGoal = distance(neighbor, goal);
            let distStart = constructPath(neighbor).length;
            distToGoal.set(neighbor, distGoal);
            distFromStart.set(neighbor, distStart);
        });

        // Sort list so it enqueues the node with least distance first 
        neighbors.sort((n1, n2) => comparison(n1, n2));

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
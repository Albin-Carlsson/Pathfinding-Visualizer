
import { AdjacencyList, generate2DGridAdjacencyList } from "./grid";
import {  empty, is_empty, head, dequeue, enqueue} from '../lib/queue_array';


const grid = generate2DGridAdjacencyList(20, 43);



/* function bfs(start: number, goal: number, grid: AdjacencyList) {
    let visited = empty<number>();
    let queue = empty<number>();
    enqueue(start, queue);

    function visit(node: number) {
        enqueue(node, visited);

    }


    while(!is_empty(queue)) {
        const current = head(queue);
        dequeue(queue);
        
        const adjList = grid.get(current);
        adjList.forEach(node => {enqueue(node, queue)});


    }
} */

export function bfs(start: number, goal: number, grid: AdjacencyList): Array<number[]> {
    let visited = new Set<number>(); // Set to keep track of visited nodes
    let queue = empty<number>();
    enqueue(start, queue);

    let predecessors: Map<number, number> = new Map(); // To reconstruct the path

    while (!is_empty(queue)) {
        const current = head(queue);
        dequeue(queue);

        if (visited.has(current)) {
            continue; // Skip if already visited
        }

        visited.add(current); // Mark as visited

        if (current === goal) { // Goal check
            // Reconstruct the path from goal to start
            let path = [goal];
            let step = goal;
            while (predecessors.has(step) && step !== start) {
                step = predecessors.get(step)!;
                path.unshift(step); // Add step to the beginning of the path
            }
            const arrVisited = Array.from(visited);
            return [path, arrVisited];
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

// Usage example with the grid from your previous code
const start = 0; // Start node
const goal = 17; // Goal node

const adjList = generate2DGridAdjacencyList(6, 5);
const path = bfs(start, goal, adjList);

console.log(path); // Log the path from start to goal
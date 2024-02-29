import { aStar } from "../src/a-star";
import { bfs } from "../src/bfs";
import { dfs } from "../src/dfs";
import { generate2DGridAdjacencyList, removeNode, addNode } from "../src/grid";

test("Generating a 3x3 grid", () => {
    const grid = generate2DGridAdjacencyList(3, 3);
    const neighbors: number[] = [0, 6, 4];
    
    expect(grid.get(3)).toEqual(neighbors);
});

test("Remove node from grid", () => {
    const grid = generate2DGridAdjacencyList(3, 3);
    removeNode(grid, 4, 3, 3);

    // Removing node "4" should changne the adjacent nodes for 
    // node 3 from [0, 6, 4] to [0, 6]
    const neighbors: number[] = [0, 6];
    expect(grid.get(3)).toEqual(neighbors);
});

test("Adding a node back", () => {
    const grid = generate2DGridAdjacencyList(3, 3);
    removeNode(grid, 4, 3, 3);
    addNode(grid, 4, 3, 3);

    const neighbors: number[] = [0, 6, 4];
    expect(grid.get(3)).toEqual(neighbors);
});

// End of grid.ts tests

test("BFS: finds expected path", () => {
    const grid = generate2DGridAdjacencyList(3, 3);
    const start = 0; 
    const goal = 6; 

    const path = bfs(start, goal, grid)[0];

    const expectedPath: number[] = [0, 3, 6];
    expect(path).toEqual(expectedPath);
});

test("DFS: finds expected path", () => {
    const grid = generate2DGridAdjacencyList(3, 3);
    const start = 0; 
    const goal = 6; 

    const path = dfs(start, goal, grid)[0];

    const expectedPath: number[] = [0, 1, 2, 5, 4, 3, 6];
    expect(path).toEqual(expectedPath);
});
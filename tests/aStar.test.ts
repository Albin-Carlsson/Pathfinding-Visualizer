import { generate2DGridAdjacencyList, removeNode, addNode } from "../src/grid";
import { aStar } from "../src/a-star";

test("AStar: finds expected path", () => {
    const grid = generate2DGridAdjacencyList(3, 3);
    const start = 0; 
    const goal = 6; 

    const path = aStar(start, goal, grid)[0];

    const expectedPath: number[] = [0, 3, 6];
    expect(path).toEqual(expectedPath);
});
/**
 * Generates a 2D grid represented as an adjacency list, where each node is connected
 * to its immediate neighbors in the cardinal directions (North, South, East, West).
 * This function assumes a rectangular grid layout. Each node in the grid is assigned
 * a unique identifier, starting from 0 at the top-left corner, moving left to right
 * and top to bottom. The adjacency list is implemented as a Map, where each key is
 * a node identifier, and the corresponding value is an array of identifiers for
 * adjacent nodes.
 *
 * @param {number} rows - The number of rows in the grid.
 * @param {number} cols - The number of columns in the grid. Together with rows, it defines the size of the grid.
 * @returns {AdjacencyList} - The adjacency list representing the 2D grid. The type `AdjacencyList` is a Map
 *                            where the key is a number (node identifier) and the value is an array of numbers
 *                            (identifiers for adjacent nodes).
 *
 * @example
 * // Generate a 3x3 grid
 * const adjList = generate2DGridAdjacencyList(3, 3);
 * console.log(adjList);
 * // Map(9) {
 * //   0 => [ 1, 3 ],
 * //   1 => [ 0, 2, 4 ],
 * //   2 => [ 1, 5 ],
 * //   3 => [ 0, 4, 6 ],
 * //   4 => [ 1, 3, 5, 7 ],
 * //   5 => [ 2, 4, 8 ],
 * //   6 => [ 3, 7 ],
 * //   7 => [ 4, 6, 8 ],
 * //   8 => [ 5, 7 ]
 * // }
 *
 * Notes:
 * - Nodes at the edges of the grid will have fewer adjacent nodes since they cannot connect outside the grid boundaries.
 * - This function can be used to represent graphs for various applications such as pathfinding, grid-based games, and network simulations.
 */
export type AdjacencyList = Map<number, number[]>;
export function generate2DGridAdjacencyList(rows: number, cols: number): AdjacencyList {
    let adjList: AdjacencyList = new Map();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            let nodeId = row * cols + col; // Unique ID for each node
            let edges: number[] = [];

            // North
            if (row > 0) edges.push(nodeId - cols);
            // South
            if (row < rows - 1) edges.push(nodeId + cols);
            // East
            if (col < cols - 1) edges.push(nodeId + 1);
            // West
            if (col > 0) edges.push(nodeId - 1);

            adjList.set(nodeId, edges);
        }
    }

    return adjList;
}
// access grid position by writing console.log(adjList.get(gridNr));

export function removeNode(adjList: AdjacencyList, nodeId: number, rows: number, cols: number): void {
    // Remove the node itself
    adjList.delete(nodeId);

    // Potential neighbors
    const neighbors = [
        nodeId - 1,    // West
        nodeId + 1,    // East
        nodeId - cols, // North
        nodeId + cols  // South
    ];

    // Remove the node from its neighbors' adjacency lists
    neighbors.forEach(neighborId => {
        if (adjList.has(neighborId)) {
            const updatedEdges = adjList.get(neighborId)!.filter(edge => edge !== nodeId);
            adjList.set(neighborId, updatedEdges);
        }
    });
}

export function addNode(adjList: AdjacencyList, nodeId: number, rows: number, cols: number): void {
    const row = Math.floor(nodeId / cols);
    const col = nodeId % cols;
    const edges: number[] = [];

    // Determine valid adjacent nodes based on the grid structure
    if (row > 0) edges.push(nodeId - cols);    // North
    if (row < rows - 1) edges.push(nodeId + cols); // South
    if (col > 0) edges.push(nodeId - 1);       // West
    if (col < cols - 1) edges.push(nodeId + 1);   // East

    // Add the node back with its edges
    adjList.set(nodeId, edges);

    // Add this node back to its neighbors' adjacency lists
    edges.forEach(neighborId => {
        if (adjList.has(neighborId) && !adjList.get(neighborId)!.includes(nodeId)) {
            adjList.get(neighborId)!.push(nodeId);
        }
    });
}

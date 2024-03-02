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
 * const adj_list = generate_2d_grid_adjacencyList(3, 3);
 * console.log(adj_list);
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
 */
export type AdjacencyList = Map<number, Array<number>>;
export function generate_2d_grid_adjacency_list(rows: number, cols: number): AdjacencyList {
    const adj_list: AdjacencyList = new Map();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const node_id = row * cols + col; // Unique ID for each node
            const edges: Array<number> = [];

            // North
            if (row > 0) edges.push(node_id - cols);
            // South
            if (row < rows - 1) edges.push(node_id + cols);
            // East
            if (col < cols - 1) edges.push(node_id + 1);
            // West
            if (col > 0) edges.push(node_id - 1);

            adj_list.set(node_id, edges);
        }
    }

    return adj_list;
}
// access grid position by writing console.log(adj_list.get(gridNr));

export function remove_node(adj_list: AdjacencyList, node_id: number, rows: number, cols: number): void {
    // Remove the node itself
    adj_list.delete(node_id);

    // Potential neighbors
    const neighbors = [
        node_id - 1,    // West
        node_id + 1,    // East
        node_id - cols, // North
        node_id + cols  // South
    ];

    // Remove the node from its neighbors' adjacency lists
    neighbors.forEach(neighbor_id => {
        if (adj_list.has(neighbor_id)) {
            const updated_edges = adj_list.get(neighbor_id)!.filter(edge => edge !== node_id);
            adj_list.set(neighbor_id, updated_edges);
        }
    });
}

export function add_node(adj_list: AdjacencyList, node_id: number, rows: number, cols: number): void {
    const row = Math.floor(node_id / cols);
    const col = node_id % cols;
    const edges: Array<number> = [];

    // Determine valid adjacent nodes based on the grid structure
    if (row > 0) edges.push(node_id - cols);    // North
    if (row < rows - 1) edges.push(node_id + cols); // South
    if (col > 0) edges.push(node_id - 1);       // West
    if (col < cols - 1) edges.push(node_id + 1);   // East

    // Add the node back with its edges
    adj_list.set(node_id, edges);

    // Add this node back to its neighbors' adjacency lists
    edges.forEach(neighbor_id => {
        if (adj_list.has(neighbor_id) && !adj_list.get(neighbor_id)!.includes(node_id)) {
            adj_list.get(neighbor_id)!.push(node_id);
        }
    });
}

To install:
Run npm init to install node modules.
Then run the HTML file in /dist

Visualization of interactive
Pathfinding algorithms in
TypeScript.

The purpose of this project is to develop an interactive 2D visualization tool for exploring and understanding various 
pathfinding algorithms within the context of a grid-based environment. The tool aims to provide users with a hands-on 
experience to interactively experiment with pathfinding algorithms, including A* (A-star), Breadth-First Search (BFS), 
and Depth-First Search (DFS), by placing start and end waypoints and obstacles (walls) within the grid.

Usage

The application is accessible via a web browser, such as Chrome, Firefox or Edge, designed to be intuitive and user-friendly. 
Upon loading the application, users are presented with a grid, which serves as the environment for pathfinding simulation, 
alongside a set of controls to interact with the tool.

 1. Grid: The central component where pathfinding algorithms are visualized. It consists of cells that can be designated as start points, goal points, or obstacles (walls).
    
    2. Control Buttons: A set of buttons allowing users to select the type of cell to place on the grid
       (Start, Goal, Wall) and to choose the pathfinding algorithm to visualize (BFS, DFS, A*).
    
    4. Run Button: Initiates the pathfinding algorithm based on the current grid configuration and selected algorithm.
    
    5. Reset Button: Clears the grid, removing all start points, goal points, walls, and paths, resetting the tool to its initial state.

    Using the tool:
    
    1. Selecting and Placing Cells:
    
    Click on the "Start" button and then click on a cell within the grid to designate it as the start point.
     It will be filled in with a blue color.
    
    Click on the "Goal" button and then click on a different cell to set it as the goal point.
    It will be filled in with a green color.
    
    Select the "Wall" button to activate the wall placement mode. Click on any cell(s) to create
     obstacles that the pathfinding algorithm must navigate around. It will be filled in with a dark color.

    Clicking on the same square again will remove the previous placement. 

    2. Choosing a pathfinding algorithm:

    Select the desired algorithm for visualization by clicking on the corresponding button:
    "BFS" for Breadth-First Search, "DFS" for Depth-First Search, or "A*" for the A-star algorithm.

    3. Running the Simulation:

    With the start and goal points set and obstacles (if any) placed, click the "Run" button to initiate the pathfinding process.
    The tool will then visualize the algorithm's exploration of the grid and the resulting path from the start to the goal.

    4. Resetting the Grid:
    
    To perform a new simulation with a different configuration or algorithm, click the "Reset" button to clear the grid and start afresh.

    Oberserving the simulation:
    As the selected algorithm runs, the tool visually distinguishes between visited cells and the final path. Visited cells are highlighted to show the algorithm's exploration,
     and the resulting path is distinctly marked in blue, illustrating the route from the start to the goal point. If the endpoint is unreachable from the start,
     an errror message will appear, informing the user. 

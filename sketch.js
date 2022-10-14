let rows = 25, cols = 25;
let grid = new Array(cols);
let w, h;

let openSet = [];
let closedSet = [];
let path = [];

let diagonals = true;
let showSets = true;
let wallDensity = 0.4;

let noSolution = false;

class Spot {

  constructor(i, j) {

    this.f = 0;
    this.g = 0;
    this.h = 0;

    this.i = i;
    this.j = j;

    this.previous = undefined;
    this.neighbors = [];
    this.wall = false;

    this.impNode = false;

    if (random() < wallDensity) {
      this.wall = true;
    }



  }

  show(col) {
    fill(col);
    if (this.wall) {
      fill(50, 40, 30);
      //ellipse((this.i * w) + w/2, (this.j * h) +  h/2, 10, 10);
      rect(this.i * w, this.j * h, w - 1, h - 1);
    } else {
      noStroke();
      ellipse((this.i * w) + w/2, (this.j * h) +  h/2, 7, 7);
      //rect(this.i * w, this.j * h, w - 1, h - 1);
    }

  }

  addNeighbors(grid) {

    let i = this.i, j = this.j;

    if (i < cols - 1) { this.neighbors.push(grid[i+1][j]) }  
    if (i > 0) { this.neighbors.push(grid[i-1][j]) }
    if (j < rows - 1) { this.neighbors.push(grid[i][j+1]) }
    if (j > 0) { this.neighbors.push(grid[i][j-1]) }

    if (diagonals) {
      if (i > 0 && j > 0) { this.neighbors.push(grid[i-1][j-1]) }
      if (i < cols - 1 && j > 0) { this.neighbors.push(grid[i+1][j-1]) }
      if (i > 0 && j < rows - 1) { this.neighbors.push(grid[i-1][j+1]) }
      if (i < cols - 1 && j < rows - 1) { this.neighbors.push(grid[i+1][j+1]) }
    }


    

  } 

}

function setup() {
  createCanvas(500, 500);
  console.log('A*');

  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors(grid);
    }
  }

  //startNode = grid[floor(random(1, cols-1))][floor(random(1, rows-1))];
  startNode = grid[0][rows-1];
  startNode.wall = false;
  //endNode = grid[floor(random(1, cols-1))][floor(random(1, rows-1))];
  endNode = grid[cols-1][0];
  endNode.wall = false;

  openSet.push(startNode);


}

function draw() {

  //frameRate(20);

  let current;

  if (openSet.length > 0) {
    // go!

    let winner = 0; // this dude has the lowest index
    for (let index = 0; index < openSet.length; index++) {
      if (openSet[index].f < openSet[winner].f) {
        winner = index;
      }
    }

    current = openSet[winner];

    if (current === endNode) {

      noLoop();
      console.log("DONE!");
      location.reload();
    }

    removeFromArray(openSet, current);
    closedSet.push(current);

    let neighbors = current.neighbors;
    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor) && !neighbor.wall) {
        let tempG = current.g + 1;

        let betterPath = false
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            betterPath = true;
          }
        } else {
          neighbor.g = tempG;
          betterPath = true;
          openSet.push(neighbor);
        }
        
        if (betterPath) {
          neighbor.h = heuristic(neighbor, endNode);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = current;
        }


      }

      


    }

  } else {
    console.error("NO SOLUTION DIE!");
    noSolution = true;
    noLoop();
    location.reload();
  }

  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(255));

    }
  }

  if (showSets) {
    for (let i = 0; i < openSet.length; i++) {
      openSet[i].show(color(0, 50, 50));
    }
  
    for (let i = 0; i < closedSet.length; i++) {
      closedSet[i].show(color(50, 50, 0));
    }
  }



  if (!noSolution) {
    path = [];  
    let temp = current;
    path.push(temp)
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  }

  for (let i = 0; i < path.length; i++ ) {
    path[i].show(color(0, 0, 200));
  }

  noFill();
  strokeWeight(2);
  stroke(0, 0, 200);
  beginShape();
  for (let i = 0; i < path.length; i++ ) {
    vertex(path[i].i * w + w/2, path[i].j * h + h/2)
  }
  endShape();

  startNode.show(color(0, 200, 0));
  endNode.show(color(0, 200, 0));
}

function heuristic(a, b) {
  let d;
  if (diagonals) { d = dist(a.i, a.j, b.i, b.j) }
  else { d = abs(a.i - b.i) + abs(a.j - b.j) }
  return d;
}

function removeFromArray(arr, el) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == el) {
      arr.splice(i, 1);
    }
  }
}
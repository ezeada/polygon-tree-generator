var leaf;
var corners = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  leaf = new Leaf(corners);
}

function draw() {
  background('#F1E3D3');
  if (corners.length > 1) {
    stroke('#F2D0A9');
    strokeWeight(4);
    fill('#F1E3D3');
    beginShape()
    for (var i = 0; i < corners.length; i++) {
      vertex(corners[i].x, corners[i].y);
    }
    endShape(CLOSE);
  } 
  noStroke();
  leaf.show();
  leaf.grow();
}

 function mousePressed() {
    corners.push(createVector(mouseX, mouseY))
  }
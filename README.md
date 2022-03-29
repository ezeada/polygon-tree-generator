


# Polygon Tree Generator
## Video: https://drive.google.com/file/d/1GmBXGzPtFTzXiVw1hW0Yu0tPvyHh0fjH/view?usp=sharing
Adaeze Chukwuka
For CS248--a p5.js implementation of space colonization using tree crowns represented by polygons created by the user. More detailed write-up below.

This project implements a cross between two very similar algorithms from “Modeling and visualization of leaf venation patterns” (which uses 2D coordinates) and “Modeling Trees with a Space Colonization Algorithm” (which uses 3D coordinates), both by Adam Runions, Brendan Lane, and Przemyslaw Prusinkiewicz at the University of Calgary. From the leaf paper, I omit the iterative polygon leaf growth aspect of the algorithm in exchange for the crown definition aspect of the tree paper algorithm. From the tree paper, I omit the branch count aspect of the algorithm in exchange for the node addition aspect of the leaf paper.

For my project, I used p5.js so that I would not have to handle any rendering or GUI. It is interactive; the user defines a polygon on screen with their mouse by clicking at each desired vertex (my implementation currently works best for triangles, quadrilaterals, and pentagons), and then a 2D tree (not including leaves) are grown with the branches constrained by the user-drawn polygon. 

I will describe my implementation in more detail by walking through each file and corresponding function below. 

## Sketch.js – set-up file for p5.js
In this file, I implemented the user interactivity and polygon creation. I created a vector to store the x and y coordinates of the user click, and then a polygon from lines that connect these vertices.


## Vein.js – branches of the tree
Each vein node stores an ending position (vein.pos), an array of influencing auxins (vein.relatedAuxins), a parent vein that is often the starting point for the branch (vein.parent), and an array of  “children”--all of the branches that sprout from this node or have this node as a parent (vein.children). Veins are represented as lines drawn from vein.parent to vein.pos.

## Auxin.js – influences of the tree
Each auxin stores a position (auxin.pos), a closestVein (auxin.closestVein), and a boolean telling whether the auxin should be marked for deletion (auxin.del). Auxins are represented as circles centered at auxin.pos. 

## Leaf.js
#### Setting up the Tree 

In this file, I implemented the two algorithms. I created two arrays: veins and auxins. (Although I am creating trees as my final product, I’m using the object names from the leaf paper because I am using 2D coordinates.)  Regardless of user input, the tree starts as one vein node (a line segment) at the bottom of the screen. (This is from the tree paper). Then, auxins are placed at random in the polygon using modified a dart-throwing algorithm (sample auxin point, check if it’s within a polygon using a point-in-polygon test, test it against all other points in the set to make sure they’re a safe distance apart, continue to sample until conditions are met). For my demo video, the number of auxins was set to 800 and the predetermined “safe distance” between all auxins points was 5 pixels. I then grew the trunk of the tree upwards (by creating vein nodes vertically) until the end of the branch was the minimum possible distance from the auxins (called the “kill distance” in the leaf paper). This was set to 15px in my demo video.

#### Growing the Tree

I first looped through my array of auxins to find the closest vein node for each one (a vein could be connected to multiple auxins but an auxin could not be connected to multiple veins). This closest vein was only stored in the auxin if they were at or closer to the influence distance from one another (my influence distance was 50px in the demo video). For each vein node that had multiple auxins influencing, I summed and normalized the directions of all of the auxins, and then “grew the branch” in that direction (by pushing another vein node) onto the array. I then looped through all of the auxins, measured the distance between them and their closest vein, and then removed the auxin from the array if this distance was less than the kill distance. This process is placed in a function that’s called repeatedly, giving the “animated” effect when the program runs. 

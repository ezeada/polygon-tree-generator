function Leaf(corners) {

    const LEAFNUMBER = 500;

    this.veins = [];
    var growLength = 5; // how long each segment is
    // start with one vein node (starting vein)
    let pos = createVector(width/2, (height - growLength));
    lastVein = new Vein(pos, new Vein(createVector(width/2, height), createVector(width/2, height)));
    this.veins.push(lastVein);

    // place auxins -- 2 parts
    this.auxins = [];

    // part 1: polygon creation
    // check if point is in polygon -- Lionel Radisson [2020]
    function isPointInPolygon(corners, pt) {
      var answer = false;
      for (let i = 0, j = corners.length - 1; i < corners.length; j = i++) {
        if (((corners[i].y > pt.y) != (corners[j].y > pt.y)) && (pt.x < 
          (corners[j].x - corners[i].x) * (pt.y - corners[i].y) / 
          (corners[j].y - corners[i].y) + corners[i].x)) {
            answer = answer ? false : true;
          }
      }
      return answer;
    } 
  
    // produce a point that is in the polygon
    function givePointInPoly(corners) {
      let inPoly = false;
      while (!inPoly) {
        var pos = createVector(random(width), random(height)); 
        if (isPointInPolygon(corners, pos))  {
          inPoly = true;
        }
      } 
      return pos;
    }

  // set up tree before growth
  this.start = function() {  
    // part 2: equal placement
    for (var i = 0; i < LEAFNUMBER; i++) {

      // arranging auxins --> create position, test against eveything in set, and redo if necessary (darththrowing algorithm --> cook 1986)
      // now adding point-in-polygon aspect --> create a random position and keep testing it until it's in polygon
      var newPos = givePointInPoly(corners);
      let safe = false; // to check whether auxins are sufficient distance
      let bs = 5; // min distance from other auxins
      
      while (!safe) {
        safe = true; // assume all auxins are an appropriate distance
        for (var i = 0; i < this.auxins.length; i++) {
            var distAux = p5.Vector.dist(newPos, this.auxins[i].pos); // calculate distance from auxin
            if (abs(distAux) <= bs) {
                newPos = givePointInPoly(corners); // recalc + restart
                safe = false;
            }
        }
      }
      this.auxins.push(new Auxin(newPos, 0, false));
    }

   // then keep growing vein until we're too close to auxins
    var kd = 15; // influence distance
    minDistance = 100;
    while (minDistance > kd) {
      // place a vein node above the one we've created
      let newPos = createVector(lastVein.pos.x, lastVein.pos.y - growLength);
      var temp = new Vein(newPos, lastVein);
      temp.parent = lastVein;
      lastVein.children.push(temp);
      this.veins.push(temp);
      lastVein = temp;
      // test the kd between it and any auxins 
      for (var i = 0; i < this.auxins.length; i++) {
        minDistance = min(minDistance, p5.Vector.dist(lastVein.pos, this.auxins[i].pos));
      }
    } 
 
  }  
    this.grow = function() {
      // FIRST: loop through auxins and find closest vein node -- but only save if vein node is closer than or at influence distance
      var infDist = 50; // influence distance
      for (var i = 0; i < this.auxins.length; i++) { // choose auxin
        var minDistance = width; // reset distance
        var closestVein = 0; // reset closest vein
        for (var j = 0; j < this.veins.length; j++) { // loop through veins 
          let dist = p5.Vector.dist(this.auxins[i].pos, this.veins[j].pos); // calculate distance between auxin and vein
          if (dist < minDistance && dist <= infDist) { // if vein is closest we've encountered and is within inf distance
            closestVein = this.veins[j]; // set closest vein to this vein
            minDistance = dist; // set min distance
          } 
        }
        if (closestVein) { // if we found a closest vein
          this.auxins[i].closestVein = closestVein; // set the closest vein of auxin to this vein 
          closestVein.relatedAuxins.push(this.auxins[i]); // add this auxin to related auxins of vein
        }
      }

      // SECOND: add and normalize the sum of vectors to related auxins so there's one per vein node
      this.sumAuxins = [];
      for (var i = 0; i < this.veins.length; i++) { 
        if (this.veins[i].relatedAuxins.length > 1) { // only if there's more than one auxin related to a vein node
          var sum = createVector(0,0); 
          for (var j = 0; j < this.veins[i].relatedAuxins.length; j++) { // sum all auxin dirs
            sum.add(createVector(this.veins[i].relatedAuxins[j].pos.x - this.veins[i].pos.x, this.veins[i].relatedAuxins[j].pos.y - this.veins[i].pos.y));
          }
          sum.normalize(); 
          sum.mult(growLength);
          sumAuxin = new Auxin(sum.add(this.veins[i].pos), this.veins[i], false); 
          //console.log(sumAuxin.pos);
          this.sumAuxins.push(sumAuxin);
          this.veins[i].relatedAuxins = []; // empty related auxins of this vein
          this.veins[i].relatedAuxins.push(sumAuxin); // push auxin to related auxin
        } if (this.veins[i].relatedAuxins.length == 1) {
          this.sumAuxins.push(this.veins[i].relatedAuxins[0]); // else, just add that single auxin
        }
      }

      // THIRD: add new vein node in dir of these sum auxins
      for (var i = 0; i < this.sumAuxins.length; i++) {
        newVein = new Vein(this.sumAuxins[i].pos, this.sumAuxins[i].closestVein); 
        newVein.parent = this.sumAuxins[i].closestVein;
        this.sumAuxins[i].closestVein.children.push(newVein);
        this.veins.push(newVein);
      } 

    // FOURTH: delete auxins that are too close to vein
      for (var i = 0; i < this.auxins.length; i++) {
        for (var j = 0; j < this.veins.length; j++) {
          let dist = p5.Vector.dist(this.auxins[i].pos, this.veins[j].pos);
          if (dist <= 5) {
            this.auxins[i].del = true;
          }
        }
      }  
      
      for (var i = 0; i < this.auxins.length; i++) {
        if (this.auxins[i].del) {
            this.auxins.splice(i, 1);
          }
      } 
    } // end of grow function

    this.show = function() {
      if (corners.length == 15) {
        this.start();
        for (var i = 0; i < this.auxins.length; i++) {
          this.auxins[i].show();
        } 
        for (var i = 0; i < this.veins.length; i++) {
          this.veins[i].show();
        }
      }
    }
}
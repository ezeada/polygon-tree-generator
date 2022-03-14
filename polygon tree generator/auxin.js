function Auxin(pos, closestVein, del) {
    
    this.pos = pos;
    this.closestVein = closestVein;
    this.del = del;

    this.show = function() {
        fill('#79B791');
        noStroke();
        circle(this.pos.x, this.pos.y, 3);
    }
}
function Vein(pos, prevVain) { // makes vein nodes
    var defaultThick = 0.6;

    this.pos = pos; // position of end of vein
    this.relatedAuxins = []; 
    this.thickness = defaultThick;
    this.parent = null;
    this.children = []
    this.prevVain = prevVain; // end of previous vein (start of this vein)

    this.show = function() {
        stroke('#773C2C');
        line(prevVain.pos.x, prevVain.pos.y, pos.x, pos.y);
        strokeWeight(this.thickness);
        noStroke();
    }
    
}
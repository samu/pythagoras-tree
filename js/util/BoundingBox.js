var BoundingBox = new Class({
  
  initialize: function (p1, p2, line, tolerance) {
    this.p1 = new Point(Math.min(p1.x, p2.x) - tolerance, Math.min(p1.y, p2.y) - tolerance);
    this.p2 = new Point(Math.max(p1.x, p2.x) + tolerance, Math.max(p1.y, p2.y) + tolerance);
    this.line = line;
    this.width = this.p2.x - this.p1.x;
    this.height = this.p2.y - this.p1.y;
  },
  
  draw: function(canvas) {
    canvas.strokeRect(this.p1.x, this.p1.y, this.width, this.height);
  }
    
});
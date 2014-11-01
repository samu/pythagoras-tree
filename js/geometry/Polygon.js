var Polygon = new Class({
  initialize: function(edges) {
    this.edges = edges;
  },

  rotate: function(matrix) {
    var newedges = new Array();
    for (var i = 0; i < this.edges.length; i++) {
      newedges[i] = this.edges[i].rotate(matrix);
    }
    return new Polygon(newedges);
  },

  rotateAt: function(matrix, point) {
    return this.transform(new Array(-point.x, -point.y)).rotate(matrix).transform(new Array(point.x, point.y));
  },

  transform: function(vector) {
    var newedges = new Array();
    for (var i = 0; i < this.edges.length; i++) {
      newedges[i] = this.edges[i].transform(vector);
    }
    return new Polygon(newedges);
  },

  transformTo: function(from, to) {
    var newedges = new Array();
    for (var i = 0; i < this.edges.length; i++) {
      newedges[i] = this.edges[i].transformTo(from, to);
    }
    return new Polygon(newedges);
  },

  scale: function(vector) {
    var newedges = new Array();
    for (var i = 0; i < this.edges.length; i++) {
      newedges[i] = this.edges[i].scale(vector);
    }
    return new Polygon(newedges);
  },

  scaleCentered: function(vector) {
    var center = BasicMath.calculateCentroid(this);
    return this.transformTo(center, new Point(0,0)).scale(vector).transformTo(new Point(0,0), center);
  },

  draw: function(canvas) {
    canvas.beginPath();
    canvas.moveTo(this.edges[0].x, this.edges[0].y);
    for (var i = 1; i < this.edges.length; i++) {
      canvas.lineTo(this.edges[i].x, this.edges[i].y);
    }
    canvas.fill();
    canvas.closePath();
  }
});

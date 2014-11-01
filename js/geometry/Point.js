var Point = new Class({

  initialize: function(x, y) {
    this.x = x;
    this.y = y;
  },

  equals: function(point) {
    return this.x == point.x && this.y == point.y;
  },

  rotate: function(matrix) {
    return new Point(this.x * matrix[0] + this.y * matrix[1], this.x * matrix[2] + this.y * matrix[3]);
  },

  transform: function(vector) {
    return new Point(this.x + vector[0], this.y + vector[1]);
  },

  transformTo: function(from, to) {
    return this.transform(new Array(to.x - from.x, to.y - from.y));
  },

  scale: function(vector) {
    return this.transform(new Array(-(this.x - this.x * vector[0]), -(this.y - this.y * vector[1])));
  }
});

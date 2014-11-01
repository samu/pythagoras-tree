var Line = new Class({
  initialize: function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
  },

  equals: function(line) {
    return this.p1.equals(line.p1) && this.p2.equals(line.p2);
  }
});

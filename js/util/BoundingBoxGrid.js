var BoundingBoxGrid = new Class({

  initialize: function(divCount, gridArea, boundingBoxes) {
    this.divCount = divCount;
    this.grid = multiDimensionalArray(divCount, divCount);
    this.divWidth = gridArea.width / divCount;
    this.divHeight = gridArea.height / divCount;

    for (var i = 0; i < boundingBoxes.length; i++) {
      var bb = boundingBoxes[i];
      var startIdxX = this.getGridPosition(bb.p1.x - gridArea.p1.x, this.divWidth);
      var startIdxY = this.getGridPosition(bb.p1.y - gridArea.p1.y, this.divHeight);
      var endIdxX   = this.getGridPosition(bb.p1.x - gridArea.p1.x + bb.width, this.divWidth);
      var endIdxY   = this.getGridPosition(bb.p1.y - gridArea.p1.y + bb.height, this.divHeight);
      for (var x = startIdxX; x <= endIdxX; x++) {
        for (var y = startIdxY; y <= endIdxY; y++) {
          this.fillGrid(x, y, bb);
        }
      }
    }
  },

  getGridPosition: function(position, gridDimension) {
    var value = Math.floor(position / gridDimension);
    if (value < 0) {
      return 0;
    }
    if (value > this.divCount - 1) {
      return this.divCount - 1;
    }
    return value;
  },

  fillGrid: function(gridIndexX, gridIndexY, bb) {
    var arr = this.grid[gridIndexX][gridIndexY];
    if (jq.inArray(bb, arr) == -1) {
      arr.push(bb);
    }
  }

});

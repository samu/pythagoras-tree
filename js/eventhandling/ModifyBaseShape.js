var ModifyBaseShape = new Class({

  initialize: function(mainMouseListener) {
    this.designatedBoundingBoxes = new Array();
    this.selectedPoint = null;    
    this.involvedLine = null;
    this.isExistingPoint = false;
    this.mousePoint = new Point(0,0);
    
    this.drawSelectedPoint = new DrawSelectedPoint(this);
    this.drawDesignatedBoundingBoxes = new DrawDesignatedBoundingBoxes();
    this.drawDesignatedBoundingBoxesCount = new DrawDesignatedBoundingBoxesCount();
    
    this.mouseDown = false;
    
    this.mainMouseListener = mainMouseListener;
  },
  
  onRepaint: function() {
    this.mainMouseListener.treeCanvas.addDrawingStrategy(this.drawSelectedPoint);
  },
  
  onMouseDown: function(mouseEvent) {
    this.mouseDown = true;
    
    this.updateSelectedPoint(this.mousePoint);
    
    if (mouseEvent.button == 2 && this.isExistingPoint && this.mainMouseListener.treeCanvas.basePolygon.edges.length > 4) {
      var newEdges = new Array();
      var counter = 0;
      var edges = this.mainMouseListener.treeCanvas.basePolygon.edges;
      for (var e = 0; e < edges.length; e++) {
        var point = edges[e];
        if (point != this.selectedPoint) {
          newEdges[counter] = new Point(point.x, point.y);
          counter++;
        } else {
          for (var i = 0; i < 4; i++) {
            if (this.mainMouseListener.treeCanvas.corners[i] >= counter) {
              var idx = this.mainMouseListener.treeCanvas.corners[i] - 1;
              if (idx < 0) {
                this.mainMouseListener.treeCanvas.corners[i] = this.mainMouseListener.treeCanvas.basePolygon.edges.length - 2;
              } else {
                this.mainMouseListener.treeCanvas.corners[i] = idx;
              }
            }
          }
        }
      }
      this.mainMouseListener.treeCanvas.basePolygon = new Polygon(newEdges);
      this.mainMouseListener.treeCanvas.dirty = true;
    } else {
      if (this.selectedPoint != null && !this.isExistingPoint) {
        var newEdges = new Array();
        var counter = 0;
        var edges = this.mainMouseListener.treeCanvas.basePolygon.edges;
        for (var e = 0; e < edges.length; e++) {
          var point = edges[e];
          newEdges[counter] = new Point(point.x, point.y);
          if (point == this.involvedLine.p1) {
            newEdges[++counter] = new Point(this.mousePoint.x, this.mousePoint.y);
            this.selectedPoint = newEdges[counter]; 
            for (var i = 0; i < 4; i++) {
              if (this.mainMouseListener.treeCanvas.corners[i] >= counter) {
                this.mainMouseListener.treeCanvas.corners[i] = this.mainMouseListener.treeCanvas.corners[i] + 1;
              }
            }
          }
          counter++;
        }
        this.mainMouseListener.treeCanvas.basePolygon = new Polygon(newEdges);
        this.mainMouseListener.treeCanvas.dirty = true;
      }
    }
  },
  
  onMouseUp: function(mouseEvent) {
    this.mouseDown = false;
  },
  
  onMouseDrag: function(mouseEvent) {
    if (this.selectedPoint != null) {
      this.selectedPoint.x = this.mousePoint.x;
      this.selectedPoint.y = this.mousePoint.y;
      if (this.mainMouseListener.treeCanvas.snapToGrid) { //-----CHECK SHIFT-----
        var before = null;
        var after = null;
        for (var i = 0; i < this.mainMouseListener.treeCanvas.basePolygon.edges.length; i++) {
          var point = this.mainMouseListener.treeCanvas.basePolygon.edges[i]; 
          if (point != this.selectedPoint) {
            if (point.x - this.mainMouseListener.tolerance < this.selectedPoint.x && point.x + this.mainMouseListener.tolerance > this.selectedPoint.x) {
              this.selectedPoint.x = point.x;            
            }
            if (point.y - this.mainMouseListener.tolerance < this.selectedPoint.y && point.y + this.mainMouseListener.tolerance > this.selectedPoint.y) {
              this.selectedPoint.y = point.y;  
            }
          } else {
            before = this.mainMouseListener.treeCanvas.basePolygon.edges[getIndex(i - 1, this.mainMouseListener.treeCanvas.basePolygon.edges.length)];
            after = this.mainMouseListener.treeCanvas.basePolygon.edges[getIndex(i + 1, this.mainMouseListener.treeCanvas.basePolygon.edges.length)];
          }
        }
        /*
        if (before != null && after != null) {//if statement can probably be removed...
          var nearest = BasicMath.getClosestPoint(new Line(before, after), this.selectedPoint);
          if (BasicMath.calculateDistance(this.selectedPoint, nearest) < this.mainMouseListener.tolerance) {
            this.selectedPoint.x = nearest.x;
            this.selectedPoint.y = nearest.y;
          }
        }*/
      }
      this.mainMouseListener.treeCanvas.dirty = true;
    } else {
      this.updateSelectedPoint(mousePoint);
    }
  },

  onMouseMove: function(mouseEvent) {
    this.mousePoint.x = mouseEvent.offsetX;
    this.mousePoint.y = mouseEvent.offsetY;
    if (!this.mouseDown) {
      this.updateDesignatedBoundingBoxes();
      this.updateSelectedPoint(this.mousePoint);
    }
  },
  
  updateDesignatedBoundingBoxes: function() {
    this.designatedBoundingBoxes = new Array();
    var indexX = Math.floor((this.mousePoint.x - this.mainMouseListener.bigBB.p1.x) / this.mainMouseListener.boundingBoxGrid.divWidth);
    var indexY = Math.floor((this.mousePoint.y - this.mainMouseListener.bigBB.p1.y) / this.mainMouseListener.boundingBoxGrid.divHeight);
    
    if (indexX >= 0 && indexX < this.mainMouseListener.gridDivs && indexY >= 0 && indexY < this.mainMouseListener.gridDivs && this.mainMouseListener.boundingBoxGrid.grid[indexX][indexY] != null) {
      this.designatedBoundingBoxes = this.mainMouseListener.boundingBoxGrid.grid[indexX][indexY];
    }
  },
  
  updateSelectedPoint: function(mousePoint) {    
    var smallestDistance = this.mainMouseListener.tolerance;
    var finalClosestPoint = null;
    for (var i = 0; i < this.designatedBoundingBoxes.length; i++) {
      var line = this.designatedBoundingBoxes[i].line;
      var closestPoint = BasicMath.getClosestPoint(line, this.mousePoint);
      var distance = BasicMath.calculateDistance(closestPoint, this.mousePoint);
      if (distance < smallestDistance) {
        this.involvedLine = line;
        smallestDistance = distance;
        finalClosestPoint = closestPoint;
        if (BasicMath.liesInRadius(line.p1, finalClosestPoint, this.mainMouseListener.tolerance)) {
          this.isExistingPoint = true;
          finalClosestPoint = line.p1;
        } else if (BasicMath.liesInRadius(line.p2, finalClosestPoint, this.mainMouseListener.tolerance)) {
          this.isExistingPoint = true;
          finalClosestPoint = line.p2;
        } else {
          this.isExistingPoint = false;
        }
      }    
    }
    var distance = BasicMath.calculateDistance(this.mainMouseListener.treeCanvas.edge, this.mousePoint);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      finalClosestPoint = this.mainMouseListener.treeCanvas.edge;
      this.isExistingPoint = true;
    }
    this.selectedPoint = finalClosestPoint;
  },
  
  getIndex: function(unsafeIndex, length) {
    if (unsafeIndex < 0) {
      return length + unsafeIndex - 1;
    } else if (unsafeIndex > length - 1) {
      return unsafeIndex - length;
    } else {
      return unsafeIndex;
    }
  }

});

var DrawSelectedPoint = new Class({    
  initialize: function(obj) {
    this.obj = obj;
  },
  
  draw: function(canvas) {
    if (this.obj.selectedPoint != null) {        
      canvas.fillStyle = "rgba(255, 0, 0, 1)";
      var r = 3;
      canvas.beginPath();
      canvas.arc(Math.round(this.obj.selectedPoint.x), Math.round(this.obj.selectedPoint.y), r, 0, 360, false);
      canvas.fill();
      canvas.closePath();
    }
  }
});

var DrawDesignatedBoundingBoxes = new Class({      
  draw: function(canvas) {
    canvas.fillStyle = "rgba(255, 0, 0, 1)";
    canvas.strokeStyle = "red";
    for (var i = 0; i < designatedBoundingBoxes.length; i++) {
      designatedBoundingBoxes[i].draw(canvas);
    }
  }
});

var DrawDesignatedBoundingBoxesCount = new Class({      
  draw: function(canvas) {
    canvas.fillStyle = "rgba(255, 0, 0, 1)";
    canvas.strokeStyle = "red";
    canvas.fillText(designatedBoundingBoxes.length, 2,30);
    
  }
});

var MoveTree = new Class({

  initialize: function(mainMouseListener) {
    this.mainMouseListener = mainMouseListener;
    this.mousePoint = new Point(0,0);
    this.previousMousePoint = null;
  },

  onRepaint: function() {
  },

  onMouseUp: function(mouseEvent) {
    this.previousMousePoint = null;
    this.mainMouseListener.treeCanvas.dirty = true;
  },

  onMouseDrag: function(mouseEvent) {
    if (this.previousMousePoint == null) {
      this.previousMousePoint = new Point(this.mousePoint.x, this.mousePoint.y);
    }
    this.mainMouseListener.treeCanvas.basePolygon = this.mainMouseListener.treeCanvas.basePolygon.transformTo(this.previousMousePoint, this.mousePoint);
    this.mainMouseListener.treeCanvas.edge.x = this.mainMouseListener.treeCanvas.edge.x + this.mousePoint.x - this.previousMousePoint.x;
    this.mainMouseListener.treeCanvas.edge.y = this.mainMouseListener.treeCanvas.edge.y + this.mousePoint.y - this.previousMousePoint.y;
    this.previousMousePoint = new Point(this.mousePoint.x, this.mousePoint.y);
    this.mainMouseListener.treeCanvas.dirty = true;
  },

  onMouseDown: function(mouseEvent) {

  },

  onMouseMove: function(mouseEvent) {
    this.mousePoint.x = mouseEvent.offsetX;
    this.mousePoint.y = mouseEvent.offsetY;
  }
});

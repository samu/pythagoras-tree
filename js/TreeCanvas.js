var TreeCanvas = new Class({
  initialize: function(canvasElement) {
    var vector = new Array(600, 200);

    this.basePolygon = new Polygon(BasicMath.calculateRectangleEdges(0,0,50,50)).transform(vector);
    this.edge = new Point(25,-30).transform(vector);
    this.corners = new Array(0,1,2,3);
    this.branchCount = 4;

    this.tree = null;

    this.bufferedImage = null;

    this.drawingStrategies = new Array();

    this.dirty = true;

    this.canvasElement = canvasElement;
    this.canvas = this.canvasElement.getContext("2d");

    this.mainMouseListener = new MainMouseListener(this);

    this.highlightEdges = false;
    this.showDebugInfo = false;

    this.background = "#FFFFFF";
    this.startColor = "#000000";
    this.endColor = "#FFFFFF";

    this.mainMouseListener.onMouseUp();
  },

  onMouseMove: function(e) {
    this.mainMouseListener.onMouseMove(e);
  },

  onMouseDown: function(e) {
    this.mainMouseListener.onMouseDown(e);
  },

  onMouseUp: function(e) {
    this.mainMouseListener.onMouseUp(e);
  },

  onRepaint: function() {
    this.mainMouseListener.onRepaint();

    this.canvas.fillStyle = this.background;

    if (this.dirty) {
      this.tree = new PythagorasTree(this.branchCount, this.basePolygon, this.corners, this.edge, true, 3);
      this.dirty = false;
      this.canvas.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
      this.tree.draw(this.canvas, this.startColor, this.endColor, this.highlightEdges);
    } else {
      this.canvas.fillRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
      this.tree.draw(this.canvas, this.startColor, this.endColor, this.highlightEdges);
    }

    for (var i = 0; i < this.drawingStrategies.length; i++) {
      this.drawingStrategies[i].draw(this.canvas);
    }
    this.drawingStrategies = new Array();
  },

  onResize: function(mainDiv) {
    this.canvas.canvas.width = mainDiv.width();
    this.canvas.canvas.height = mainDiv.height();
    this.dirty = true;
    this.onRepaint();
  },

  addDrawingStrategy: function(drawingStrategy) {
    this.drawingStrategies.push(drawingStrategy);
  }
});

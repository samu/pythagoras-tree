var MainMouseListener = new Class({
  initialize: function(treeCanvas) {
    this.treeCanvas = treeCanvas;

    this.mouseDown = false;

    this.bigBB = null;
    this.boundingBoxes = new Array();
    this.designatedBoundingBoxes = new Array();
    this.lines = new Array();

    this.boundingBoxGrid = null;
    this.tolerance = 10;
    this.split = 1;
    this.gridDivs = 50;

    this.resizeArea = null;
    this.moveArea = null;

    this.modifyBaseShape = new ModifyBaseShape(this);
    this.moveTree = new MoveTree(this);
    this.scaleTree = new ScaleTree(this);
    this.mouseListener = this.modifyBaseShape;
    this.mouseDown = false;

    this.snapToGrid = false;

    this.resizeAreaWidth = 9;
    this.resizeAreaRadius = Math.round(BasicMath.calculateDistance(new Point(0, 0), new Point(this.resizeAreaWidth, this.resizeAreaWidth)));
    this.moveAreaWidth = 10;
    this.moveAreaRadius = Math.round(BasicMath.calculateDistance(new Point(0, 0), new Point(this.moveAreaWidth, this.moveAreaWidth)));

    this.drawResizeAreaLight = new DrawResizeArea(this, treeCanvas, false);
    this.drawResizeAreaStrong = new DrawResizeArea(this, treeCanvas, true);
    this.drawMoveAreaLight = new DrawMoveArea(this, treeCanvas, false);
    this.drawMoveAreaStrong = new DrawMoveArea(this, treeCanvas, true);
  },

  onRepaint: function() {
    this.mouseListener.onRepaint();
  },

  onMouseMove: function(e) {
    if (!this.mouseDown) {
      if (BasicMath.liesInRadius(getMousePoint(e), this.moveArea, this.moveAreaRadius * 3 + this.resizeAreaRadius)) {
        this.treeCanvas.addDrawingStrategy(this.drawMoveAreaLight);
        this.treeCanvas.addDrawingStrategy(this.drawResizeAreaLight);
        if (BasicMath.liesInRadius(getMousePoint(e), this.moveArea, this.moveAreaRadius)) {
          this.mouseListener = this.moveTree;
          this.treeCanvas.addDrawingStrategy(this.drawMoveAreaStrong);
        } else if (BasicMath.liesInRadius(getMousePoint(e), this.resizeArea, this.resizeAreaRadius)) {
          this.mouseListener = this.scaleTree;
          this.treeCanvas.addDrawingStrategy(this.drawResizeAreaStrong);
        }
      } else {
        this.mouseListener = this.modifyBaseShape;
      }
    } else {
      this.mouseListener.onMouseDrag(e);
    }

    this.mouseListener.onMouseMove(e);
    this.treeCanvas.onRepaint();
  },

  onMouseDown: function(e) {
    this.mouseDown = true;
    this.mouseListener.onMouseDown(e);
    this.treeCanvas.onRepaint();
  },

  onMouseUp: function(e) {
    this.mouseDown = false;
    this.updateLines();
    this.updateBoundingBoxes();
    this.updateBigBoundingBox();
    this.boundingBoxGrid = new BoundingBoxGrid(this.gridDivs, this.bigBB, this.boundingBoxes);
    this.updateResizeArea();
    this.updateMoveArea();
    this.mouseListener.onMouseUp(e);
    this.treeCanvas.onRepaint();
  },

  updateLines: function(){
    this.lines = new Array();
    for (var i = 0; i < this.treeCanvas.basePolygon.edges.length - 1; i++) {
      this.lines[i] = new Line(this.treeCanvas.basePolygon.edges[i], this.treeCanvas.basePolygon.edges[i + 1]);
    }
    this.lines[this.treeCanvas.basePolygon.edges.length - 1] = new Line(this.treeCanvas.basePolygon.edges[this.treeCanvas.basePolygon.edges.length - 1], this.treeCanvas.basePolygon.edges[0]);
  },

  updateBoundingBoxes: function() {
    this.boundingBoxes = new Array();
    for (var i = 0; i < this.lines.length; i++) {
      var line = this.lines[i];

      var p1 = line.p1;
      var p2 = line.p2;

      var splitWidth = (p2.x - p1.x) / this.split;
      var splitHeight = (p2.y - p1.y) / this.split;

      for (var j = 0; j < this.split; j++) {
        var bb = new BoundingBox(new Point(p1.x + j * splitWidth,            p1.y + j * splitHeight, this.tolerance),
                     new Point(p1.x + j * splitWidth + splitWidth, p1.y + j * splitHeight + splitHeight), line, this.tolerance);
        this.boundingBoxes.push(bb);
      }
    }
  },

  updateBigBoundingBox: function() {
    var bigBBData = BasicMath.getBoundingBox(this.treeCanvas.basePolygon);
    this.bigBB = new BoundingBox(new Point(bigBBData[0], bigBBData[1]), new Point(bigBBData[0] + bigBBData[2], bigBBData[1] + bigBBData[3]), null, this.tolerance);
  },

  updateResizeArea: function() {
    this.resizeArea = new Point(this.bigBB.p2.x + this.resizeAreaWidth, this.bigBB.p2.y + this.resizeAreaWidth);
  },

  updateMoveArea: function() {
    this.moveArea = new Point(this.bigBB.p2.x + this.moveAreaWidth + 2 * this.resizeAreaWidth + 2, this.bigBB.p2.y + this.moveAreaWidth + 2 * this.resizeAreaWidth + 2);
  }
});

var AreaDrawingStrategy = new Class({
  initialize: function(listener, treeCanvas, strong) {
    this.listener = listener;
    this.treeCanvas = treeCanvas;
    this.strong = strong;
  },

  inv: function(val) {
    val += 128;
    if (val > 255) {
      val -= 255;
    }
    return val;
  },

  draw: function(canvas) {
    var rs = hexToR(this.treeCanvas.background);
    var gs = hexToG(this.treeCanvas.background);
    var bs = hexToB(this.treeCanvas.background);

    rs = this.inv(rs);
    gs = this.inv(gs);
    bs = this.inv(bs);

    if (this.strong) {
      canvas.strokeStyle = "rgba(" + rs + ", " + gs + ", " + bs + ", 1)";
    } else {
      canvas.strokeStyle = "rgba(" + rs + ", " + gs + ", " + bs + ", 0.5)";
    }
    canvas.lineWidth = 3;
    canvas.beginPath();
    this.customDraw(canvas);
    canvas.stroke();
    canvas.closePath();
  }
});

var DrawResizeArea = new Class({
  Extends: AreaDrawingStrategy,
  customDraw: function(canvas) {
    canvas.arc(this.listener.resizeArea.x, this.listener.resizeArea.y, this.listener.resizeAreaRadius, 0, 360, false);
  }
});

var DrawMoveArea = new Class({
  Extends: AreaDrawingStrategy,
  customDraw: function(canvas) {
    canvas.arc(this.listener.moveArea.x, this.listener.moveArea.y, this.listener.moveAreaRadius, 0, 360, false);
  }
});

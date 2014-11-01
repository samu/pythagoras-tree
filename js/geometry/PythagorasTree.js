var PythagorasTree = new Class({
  initialize: function(branches, basePolygon, corners, edge, alternating, alternatingStepsMax) {
    this.branches = branches;
    this.corners = corners;
    this.alternating = alternating;
    this.alternatingStepsMax = alternatingStepsMax;


    this.bottomLength = BasicMath.calculateDistance(basePolygon.edges[corners[2]], basePolygon.edges[corners[3]]);
    this.leftLength = BasicMath.calculateDistance(basePolygon.edges[corners[0]], edge);
    this.rightLength = BasicMath.calculateDistance(basePolygon.edges[corners[1]], edge);

    this.bottomAngle =  90 - BasicMath.calculateAngle(basePolygon.edges[corners[3]], basePolygon.edges[corners[2]], basePolygon.edges[corners[1]]);
    this.topAngle = 90 - BasicMath.calculateAngle(basePolygon.edges[corners[2]], basePolygon.edges[corners[1]], basePolygon.edges[corners[0]]);

    this.leftRotationmatrix = BasicMath.getRotationmatrix(BasicMath.calculateAngle(edge, basePolygon.edges[corners[0]], basePolygon.edges[corners[1]]) + this.topAngle + this.bottomAngle);
    this.leftRotationmatrixNeg = BasicMath.getRotationmatrix(-BasicMath.calculateAngle(edge, basePolygon.edges[corners[0]], basePolygon.edges[corners[1]]) + this.topAngle + this.bottomAngle);
    this.leftRatio = this.leftLength / this.bottomLength;

    this.rightRotationmatrix = BasicMath.getRotationmatrix(-BasicMath.calculateAngle(edge, basePolygon.edges[corners[1]], basePolygon.edges[corners[0]]) + this.topAngle + this.bottomAngle);
    this.rightRotationmatrixNeg = BasicMath.getRotationmatrix(BasicMath.calculateAngle(edge, basePolygon.edges[corners[1]], basePolygon.edges[corners[0]]) + this.topAngle + this.bottomAngle);
    this.rightRatio = this.rightLength / this.bottomLength;

    this.bodies = new Array();

    this.addToList(basePolygon, 0);
    this.calculate(basePolygon, branches, 1, false, 0);
  },

  addToList: function(polygon, layer) {
    var list = this.bodies[layer];
    if (list == null) {
      list = new Array();
      this.bodies[layer] = list;
    }
    list.push(polygon);
    },

  calculate: function(basePolygon, branches, layer, alternate, alternatingSteps) {
    if (layer <= branches) {
      var rightPolygon, leftPolygon;

      if (alternate) {
        rightPolygon = basePolygon.scale(new Array(this.leftRatio, this.leftRatio));
        rightPolygon = rightPolygon.transformTo(rightPolygon.edges[this.corners[2]], basePolygon.edges[this.corners[1]]);
        rightPolygon = rightPolygon.rotateAt(this.leftRotationmatrixNeg, rightPolygon.edges[this.corners[2]]);

        leftPolygon = basePolygon.scale(new Array(this.rightRatio, this.rightRatio));
        leftPolygon = leftPolygon.transformTo(leftPolygon.edges[this.corners[3]], basePolygon.edges[this.corners[0]]);
        leftPolygon = leftPolygon.rotateAt(this.rightRotationmatrixNeg, leftPolygon.edges[this.corners[3]]);
      } else {
        rightPolygon = basePolygon.scale(new Array(this.rightRatio, this.rightRatio));
        rightPolygon = rightPolygon.transformTo(rightPolygon.edges[this.corners[2]], basePolygon.edges[this.corners[1]]);
        rightPolygon = rightPolygon.rotateAt(this.rightRotationmatrix, rightPolygon.edges[this.corners[2]]);

        leftPolygon = basePolygon.scale(new Array(this.leftRatio, this.leftRatio));
        leftPolygon = leftPolygon.transformTo(leftPolygon.edges[this.corners[3]], basePolygon.edges[this.corners[0]]);
        leftPolygon = leftPolygon.rotateAt(this.leftRotationmatrix, leftPolygon.edges[this.corners[3]]);
      }

      if (this.alternating) {
        alternatingSteps++;
        if (alternatingSteps == this.alternatingStepsMax) {
          alternate = !alternate;
          alternatingSteps = 0;
        }
      }

      var maximum = 10;
      var rightBoundingBox = BasicMath.getBoundingBox(rightPolygon);
      var leftBoundingBox = BasicMath.getBoundingBox(leftPolygon);
      if (rightBoundingBox[2] > maximum && rightBoundingBox[3] > maximum) {
        this.calculate(rightPolygon, branches, layer + 1, alternate, alternatingSteps);
      }
      if (leftBoundingBox[2] > maximum && leftBoundingBox[3] > maximum) {
        this.calculate(leftPolygon, branches, layer + 1, alternate, alternatingSteps);
      }

      this.addToList(rightPolygon, layer);
      this.addToList(leftPolygon, layer);
    }
  },

  draw: function(canvas, startColor, endColor, highlightEdges) {

    var rs = hexToR(startColor);
    var gs = hexToG(startColor);
    var bs = hexToB(startColor);

    var re = hexToR(endColor);
    var ge = hexToG(endColor);
    var be = hexToB(endColor);

    var rf = re - rs;
    var gf = ge - gs;
    var bf = be - bs;

    rf = Math.round(rf / this.branches - 1);
    gf = Math.round(gf / this.branches - 1);
    bf = Math.round(bf / this.branches - 1);

    canvas.lineWidth = 2;

    for (var i = 0; i < this.bodies.length; i++) {
      var list = this.bodies[i];
      var fillStyleString = "rgba(" + (rs + i * rf) + ", " + (gs + i * gf) + ", " + (bs + i * bf) + ", 1)";
      canvas.fillStyle = fillStyleString;
      for (var j = 0; j < list.length; j++) {
        var body = list[j];
        if (body != null) {
          body.draw(canvas);
        }
      }
    }

    if (highlightEdges) {
        canvas.fillStyle = "rgba(0, 0, 0, 1)";
        var edges = this.bodies[0][0].edges;
        for (var i = 0; i < edges.length; i++) {
          canvas.beginPath();
        canvas.arc(Math.round(edges[i].x), Math.round(edges[i].y), 3, 0, 360, false);
        canvas.fill();
        canvas.closePath();
        }
        canvas.beginPath();
      canvas.arc(Math.round(edge.x), Math.round(edge.y), 3, 0, 360, false);
      canvas.fill();
      canvas.closePath();
    }
  }
});

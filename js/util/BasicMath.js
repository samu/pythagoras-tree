function BasicMath() {
}

BasicMath.liesInRadius = function(p1, p2, radius) {
  return BasicMath.calculateDistance(p1, p2) <= radius;
}

BasicMath.calculateDistance = function(from, to) {
  return Math.sqrt((to.x - from.x) * (to.x - from.x) + (to.y - from.y) * (to.y - from.y));
}

BasicMath.calculateAngle = function(p1, p2, p3) {
  var a = BasicMath.calculateDistance(p1, p2);
  var b = BasicMath.calculateDistance(p2, p3);
  var c = BasicMath.calculateDistance(p1, p3);
  return BasicMath.toDegrees(Math.acos((a * a + b * b - c * c) / (2 * a * b)));
}

BasicMath.getClosestPoint = function(line, p3) {
  var xDelta = line.p2.x - line.p1.x;
  var yDelta = line.p2.y - line.p1.y;

  if ((xDelta == 0) && (yDelta == 0)) {
    throw new IllegalArgumentException("line.p1 and line.p2 cannot be the same point");
  }

  var u = ((p3.x - line.p1.x) * xDelta + (p3.y - line.p1.y) * yDelta) / (xDelta * xDelta + yDelta * yDelta);

  var closestPoint;
  if (u < 0) {
    closestPoint = line.p1;
  } else if (u > 1) {
    closestPoint = line.p2;
  } else {
    closestPoint = new Point(line.p1.x + u * xDelta, line.p1.y + u * yDelta);
  }

  return closestPoint;
}

BasicMath.getCrossProduct = function(p0, p1, p2){
    var x0 = p0.x;
    var y0 = p0.y;
    var x1 = p1.x;
    var y1 = p1.y;
    var x2 = p2.x;
    var y2 = p2.y;
    var crossproduct = (x1 - x0) * (y2 - y1) - (y1 - y0) * (x2 - x1);
    return crossproduct;
}

BasicMath.liesInPolygon = function(point, polygon) {
  var lines = polygon.getLines();
  for (var i = 0; i < lines.length; i++) {
    line = lines[i];
    if (BasicMath.getCrossProduct(line.p1, line.p2, point) < 0) {
      return false;
    }
  }
  return true;
}

BasicMath.getRotationmatrix = function(angle) {
  return new Array(Math.cos(BasicMath.toRadians(angle)),
           Math.sin(BasicMath.toRadians(angle)),
            -Math.sin(BasicMath.toRadians(angle)),
           Math.cos(BasicMath.toRadians(angle)));
}

BasicMath.calculateArea = function(polygon) {
  sum = 0;
  edges = polygon.edges;
  for (var i = 0; i < edges.length; i++) {
    edge1 = edges[getSaveIndex(i, edges.length)];
    edge2 = edges[getSaveIndex(i + 1, edges.length)];
    sum += edge1.x * edge2.y - edge2.x * edge1.y;
  }
  return sum * 0.5;
}

BasicMath.calculateCentroid = function(polygon) {
  area = BasicMath.calculateArea(polygon);
  x = 0;
  y = 0;
  edges = polygon.edges;
  for (var i = 0; i < edges.length; i++) {
    edge1 = edges[getSaveIndex(i, edges.length)];
    edge2 = edges[getSaveIndex(i + 1, edges.length)];
    x += (edge1.x + edge2.x) * (edge1.x * edge2.y - edge2.x * edge1.y);
    y += (edge1.y + edge2.y) * (edge1.x * edge2.y - edge2.x * edge1.y);
  }
  return new Point(x * (1 / (6 * area)), y * (1 / (6 * area)));
}

function getSaveIndex(index, length) {
  return index < length ? index : 0;
}

BasicMath.getBoundingBox = function(polygon) {
  var mostLeft, mostRight, mostTop, mostBottom;
  mostLeft = polygon.edges[0].x;
  mostRight = polygon.edges[0].x;
  mostTop = polygon.edges[0].y;
  mostBottom = polygon.edges[0].y;
  for (var i = 1; i < polygon.edges.length; i++) {
    var x = polygon.edges[i].x;
    var y = polygon.edges[i].y;
    if (mostLeft > x) {
      mostLeft = x;
    } else if (mostRight < x) {
      mostRight = x;
    }
    if (mostTop > y) {
      mostTop = y;
    } else if (mostBottom < y) {
      mostBottom = y;
    }
  }
  return new Array(mostLeft, mostTop, mostRight - mostLeft, mostBottom - mostTop);
}

BasicMath.calculateRectangleEdges = function(x, y, width, height) {
  var edges = new Array();
    edges[0] = new Point(x, y);
    edges[1] = new Point(x + width,y);
    edges[2] = new Point(x + width,y + height);
    edges[3] = new Point(x,y + height);
    return edges;
}

BasicMath.getColorValue = function(currentValue, add) {
  var value = currentValue + add;
  if (value < 0) {
    return 0;
  } else if (value > 255) {
    return 255;
  } else {
    return value;
  }
}

var toDegVal = 180 / Math.PI;
BasicMath.toDegrees = function(radians) {
  return radians * toDegVal;
}

var toRadVal = Math.PI / 180;
BasicMath.toRadians = function(degrees) {
  return degrees * toRadVal;
}

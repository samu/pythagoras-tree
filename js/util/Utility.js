function multiDimensionalArray(rows, columns) {
  var a = new Array(rows);
  for (var i = 0; i < rows; i++) {
    a[i] = new Array(columns);
      for (var j = 0; j < columns; j++) {
        a[i][j] = new Array();
      }
  }
  return(a);
}

function getMousePoint(mouseEvent) {
  var mousePoint = new Point(0,0);
  mousePoint.x = mouseEvent.offsetX;
  mousePoint.y = mouseEvent.offsetY;
  return mousePoint;
}

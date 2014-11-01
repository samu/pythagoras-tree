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

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}

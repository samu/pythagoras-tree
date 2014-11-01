var ScaleTree = new Class({

	initialize: function(mainMouseListener) {
		this.mainMouseListener = mainMouseListener;
		this.mousePoint = new Point(0,0);
		this.originalMousePoint = null;
	},
		
	onRepaint: function() {
		
	},
	
	onMouseUp: function(mouseEvent) {
		this.originalMousePoint = null;
	},
	
	onMouseDrag: function(mouseEvent) {
		if (this.originalMousePoint == null) {
			this.originalMousePoint = new Point(this.mousePoint.x, this.mousePoint.y);
		}

		var basePolygon = this.mainMouseListener.treeCanvas.basePolygon;
		var rectangle = this.mainMouseListener.bigBB;
		var center = new Point(rectangle.p1.x + rectangle.width / 2, rectangle.p1.y + rectangle.height / 2);
		//var center = new Point(rectangle.p1.x, rectangle.p1.y);
		var origin = new Point(0, 0);
		var scaleY = (this.mousePoint.y - this.originalMousePoint.y) / 100;
		//TODO check shift! var scaleX = keyStates.get(KeyEvent.VK_SHIFT) ? scaleY : (mousePoint.x - originalMousePoint.x) / 100;
		var scaleX = (this.mousePoint.x - this.originalMousePoint.x) / 100;
		basePolygon = basePolygon.transformTo(center, origin).scale(new Array(1 + scaleX, 1 + scaleY)).transformTo(origin, center);
		this.mainMouseListener.treeCanvas.basePolygon = basePolygon;
		var edge = new Point(this.mainMouseListener.treeCanvas.edge.x, this.mainMouseListener.treeCanvas.edge.y);
		edge = this.mainMouseListener.treeCanvas.edge.transformTo(center, origin).scale(new Array(1 + scaleX, 1 + scaleY)).transformTo(origin, center);
		this.mainMouseListener.treeCanvas.edge = edge;
				
		this.originalMousePoint.x = this.mousePoint.x;
		this.originalMousePoint.y = this.mousePoint.y;
		
		this.mainMouseListener.treeCanvas.dirty = true;
	},

	onMouseDown: function(mouseEvent) {
		
	},
	
	onMouseMove: function(mouseEvent) {
		this.mousePoint.x = mouseEvent.offsetX;
		this.mousePoint.y = mouseEvent.offsetY;
	}
	
});

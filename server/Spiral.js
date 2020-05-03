var Indexes = [],
	List = [],
	shape = [],
	SpiralSize, s1, s2, cnv, ctx;
var deb = true;
var gridOptions = {boxSize: 5,gridColor: '#f0f0f0', gridSize: 800, matchColor: "#505050", firstColor: "#00ff00", lastColor: "#ff0000"};

/**
 * set the type of shape ("Springer" or "Cross")
 * @param  {Integer} a x coordinate of the offset of the shape
 * @param  {Integer} b y coordinate of the offset of the shape
 * @param  {String} type type of shape ("Springer" or "Cross")
 */
function setShape(a, b, type) {
	
	if (type == "Springer") {setSpringerShape(a, b)} else if (type == "Cross") {setCrossShape(a, b)} 
}

/**
 * set the coordinates of the "Springer"
 * @param  {Integer} a x coordinate of the offset of the springer
 * @param  {Integer} b y coordinate of the offset of the springer
 */
function setSpringerShape(a, b) {
	s1 = a; s2 = b; shape = [ [s1, s2], [s1, -s2], [-s1, s2], [-s1, -s2], [s2, s1], [s2, -s1], [-s2, s1], [-s2, -s1] ];
}

/**
 * @param  {Integer} a x coordinate of the offset of the cross
 * @param  {Integer} b y coordinate of the offset of the cross
 */
function setCrossShape(a, b) {
	s1 = a; s2 = b; shape = [ [s1, s2], [-s1, -s2], [-s1, s2], [s1, -s2] ];
}
/**
 * console output (only if global variable is set to "true")
 * @param  {} msg
 */
function log(msg) { if (deb) console.log(msg)}

/*
 *  initialize main  attributes of the grid
 */
function initGrid() {
	cnv = document.getElementById("cnv");
	cnv.width = gridOptions.gridSize;
	cnv.height = gridOptions.gridSize;
	cnv.style.marginTop = "10px";
	cnv.parentElement.style.textAlign = "center";
	ctx = cnv.getContext('2d');
	SpiralSize = Math.floor(cnv.width / gridOptions.boxSize);
}
/**
 * @param  {} c
 * @param  {} pX
 * @param  {} pY
 * @param  {} fillStyle
 * @param  {} bSize
 * @param  {} border
 */
function drawBox(c, pX, pY, fillStyle, bSize, border) {
	c.fillStyle = fillStyle;
	c.fillRect(pX * bSize, pY * bSize, Math.max(bSize - border, 1), Math.max(bSize - border, 1));
}

/**
 */
function drawGrid() {
	for (var i = 1; i <= SpiralSize; i++) {
		for (var j = 1; j <= SpiralSize; j++) {
			drawBox(ctx, i, j, gridOptions.gridColor, gridOptions.boxSize, 0);
		}
	}
}

/**
 */
function fillIndices() {
	Indexes=[]
	SpiralSize = Math.floor(cnv.width / gridOptions.boxSize);
	var from = -Math.floor((SpiralSize / 2) + 1);
	var to = -from + (SpiralSize % 2) - 2;
	var val = 0;
	for (var xx = to; xx > from; xx--) {
		var Row = [];
		for (yy = to; yy > from; yy--) {
			var val = Math.pow((Math.abs(Math.abs(xx) - Math.abs(yy)) + Math.abs(xx) + Math.abs(yy)), 2) + Math.abs(xx + yy + 0.1) / (xx + yy + 0.1) * (Math.abs(Math.abs(xx) - Math.abs(yy)) + Math.abs(xx) + Math.abs(yy) + xx - yy) + 1;
			Row.push(val);
		}
		Indexes.push(Row);
	}
}
/**
 * @param  {} Row
 * @param  {} Column
 */
function getMinimumIndex(Row, Column) {
	var min = -1, newRow = Row, newColumn = Column, found = null, c = gridOptions.matchColor, bS = gridOptions.boxSize;
	shape.forEach(function (el) {
		if (Row + el[0] >= 0 && Row + el[0] < SpiralSize && Column + el[1] >= 0 && Column + el[1] < SpiralSize) {
			val = Indexes[Row + el[0]][Column + el[1]];
			if ((min > val || min == -1) && !List.includes(val)) {
				min = val;
				newRow = Row + el[0];
				newColumn = Column + el[1];
				found = [newRow, newColumn];
			}
		}
	});
	if (found != null) {List.push(Indexes[newRow][newColumn]); c = gridOptions.matchColor;} 
	else { log("Punkte:"+List.length); c = gridOptions.lastColor;}
	drawBox(ctx, newRow + 1, newColumn + 1, c, bS, 1);
	return found;
}
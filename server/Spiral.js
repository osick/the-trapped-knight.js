var Indexes = [],
	List = [],
	shape = [],
	SpiralSize, s1, s2, cnv, ctx;
var deb = true;
var gridOptions = {boxSize: 6, gridColor: '#f0f0f0', gridSize: 1800, matchColor: "#ff0000", firstColor: "#ffff00", lastColor: "#00ff00"};

$(document).ready(function () {
	initGrid();
	setShape(17, 4, "Springer");
	fillIndices();
	drawGrid();
	/*pair is the starting point*/
	var pair = [Math.floor((SpiralSize) / 2) - ((SpiralSize - 1) % 2), Math.floor((SpiralSize) / 2) - ((SpiralSize - 1) % 2)];
	List.push(Indexes[pair[0]][pair[1]]);
	log("1: " + Indexes[pair[0]][pair[1]]);
	drawBox(ctx, pair[0] + 1, pair[1] + 1, gridOptions.firstColor, gridOptions.boxSize, 0);
	while (pair != null) {pair = getMinimumIndex(pair[0], pair[1]);}
	document.getElementById("number").innerHTML = List.length + " Steps";
});

/**
 * set the type of shape ("Springer" or "Cross")
 * @param  {Integer} a x coordinate of the offset of the shape
 * @param  {Integer} b y coordinate of the offset of the shape
 * @param  {String} type type of shape ("Springer" or "Cross")
 */
function setShape(a, b, type) {
	if (type == "Springer") {setSpringerShape(a, b)
	} else if (type == "Cross") {setCrossShape(a, b)
	} else {exit;}
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
	cnv.parentElement.style.backgroundColor = "#e0e0e0";
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
	SpiralSize = Math.floor(cnv.width / gridOptions.boxSize);
	var from = -Math.floor((SpiralSize / 2) + 1);
	var to = -from + (SpiralSize % 2) - 2;
	var val = 0;
	for (var xx = to; xx > from; xx--) {
		var line = [];
		for (yy = to; yy > from; yy--) {
			var val = Math.pow((Math.abs(Math.abs(xx) - Math.abs(yy)) + Math.abs(xx) + Math.abs(yy)), 2) + Math.abs(xx + yy + 0.1) / (xx + yy + 0.1) * (Math.abs(Math.abs(xx) - Math.abs(yy)) + Math.abs(xx) + Math.abs(yy) + xx - yy) + 1;
			line.push(val);
		}
		Indexes.push(line);
	}
}
/**
 * @param  {} Line
 * @param  {} Column
 */
function getMinimumIndex(Line, Column) {
	var min = -1,
		newLine = Line,
		newColumn = Column,
		found = null,
		c = gridOptions.matchColor,
		bS = gridOptions.boxSize;
	shape.forEach(function (el) {
		if (Line + el[0] >= 0 && Line + el[0] < SpiralSize && Column + el[1] >= 0 && Column + el[1] < SpiralSize) {
			val = Indexes[Line + el[0]][Column + el[1]];
			if ((min > val || min == -1) && !List.includes(val)) {
				min = val;
				newLine = Line + el[0];
				newColumn = Column + el[1];
				found = [newLine, newColumn];
			}
		}
	});
	if (found != null) {
		List.push(Indexes[newLine][newColumn]);
		log(Indexes[newLine][newColumn]);
		c = "rgb(255,0,0)";
	} else {
		c = gridOptions.lastColor;
	}
	drawBox(ctx, newLine + 1, newColumn + 1, c, bS, 1);
	return found;
}
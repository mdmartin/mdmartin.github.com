
var x;
var y;
var svg;
var margin;
d3.csv("coffee.csv");

var first = 1;

//Gets called when the page is loaded.
function init(data){

	
  	var chart;
	margin = {top: 15, right: 80, bottom: 30, left: 80},
	    	width = 700 - margin.left - margin.right,
	    	height = 450 - margin.top - margin.bottom;
	//DEFINE YOUR VARIABLES UP HERE
	x = d3.scale.ordinal()
						.rangeRoundBands([0, width], 0.3);
	y = d3.scale.linear()
						.range([height, 0]);

	svg = d3.select("#vis")
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom);

}

//Called when the update button is clicked
function updateClicked(){
  	d3.csv('coffee.csv',update)
}

//Callback for when data is loaded
function update(rawdata){
	svg.selectAll("g").remove();

 	var xSelection = getXSelectedOption();
 	var ySelection = getYSelectedOption();

 	console.log(ySelection);

 	var sumData = d3.nest()
  				.key(function(d) {return d[ySelection]})
  				.rollup(function(d) {
  					return d3.sum(d, function(n) {
  						return n[xSelection];
  					});
  				})
  				.entries(rawdata);

 	var dataSet = [];
 	for (var i = sumData.length - 1; i >= 0; i--) {
  		dataSet.push(sumData[i].values);
  	};
  	var dataSize = dataSet.length;

  	x.domain(sumData.map(function(d) {return d.key}));
  	y.domain([0, d3.max(dataSet, function(d) {return d})]);

  	var xAxis = d3.svg.axis()
  						.scale(x)
  						.orient("bottom");
  	svg.append("g")
  		.attr("class", "xAxis")
  		.attr("transform", "translate("+margin.left+", " + (height + margin.top) + ")")
  		.call(xAxis);

  	var yAxis = d3.svg.axis()
  						.scale(y)
  						.orient("left")
  						.ticks(5);

  	svg.append("g")
  		.attr("class", "yAxis")
  		.attr("transform", "translate(" + margin.left + ", "+ margin.top +")")
  		.call(yAxis);

  	console.log(dataSet);

  	if (first == 1) {
  		first = 0;

	  	svg.selectAll("rect")
	  		.data(dataSet)
	  		.enter()
	  		.append("rect")
	  		.attr("x", function(d, i) {
	  			return margin.left + x(i);
	  		})
	  		.attr("y", function(d) {
	  			return margin.top + y(d);
	  		})
	  		.attr("height", function(d) {
	  			return height - y(d);
	  		})
	  		.attr("width", x.rangeBand())
	  		.attr("fill", function(d, i) {
	  			return "rgb(100,100,"+i*50+")";
	  		});
	  	}
	  else {
	  	svg.selectAll("rect")
	  		.data(dataSet)
	  		.transition()
	  		.delay(function(d, i) {
	  			return 600/dataSet.length * i;
	  		})
	  		.duration(1000)
	  		.attr("y", function(d) {
	  			return margin.top + y(d);
	  		})
	  		.attr("height", function(d) {
	  			return height - y(d);
	  		});
	  }
  //
}

// Returns the selected option in the X-axis dropdown. Use d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
function getXSelectedOption(){
  var node = d3.select('#xdropdown').node()
  var i = node.selectedIndex
  return node[i].value
}

// Returns the selected option in the X-axis dropdown. 
function getYSelectedOption(){
  var node = d3.select('#ydropdown').node()
  var i = node.selectedIndex
  return node[i].value
}
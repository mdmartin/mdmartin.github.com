var vis;
var height = 300;
var width = 600;

d3.csv('./a3-CoffeeData.csv')

function init(drinks) {
	
	drinks.forEach(function(d)) {
		d.price = +d.price;
	}
	console.log(drinks[0].name)


	xscale = d3.scale.linear()
			   .domain([0, 
			   		d3.max(drinks.map
			   			(function(d) {return d.price}))])
			   .range([0, width]);

	yscale = d3.scale.linear()
			   .domain()

	vis = d3.select('#frame').append('svg')
			.attr('width', width)
			.attr('height', height);


	vis.selectAll('circle')
	   .




}
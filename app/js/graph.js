'use strict'

const chartWidth  = 1100,
		  chartHeight = 700

const projection = d3.geoMercator()
	// center the projection:
	.translate([chartWidth / 2, chartHeight / 2]) 

const path = d3.geoPath(projection)

const svg = d3.select("#svgchart")
							.attr("width", chartWidth)
							.attr("height", chartHeight)

const gMapContainer = svg.append("g").attr("class", "map")

// tooltip div:
const tooltip = d3.select('#mainContainer').append("div")
	.classed("tooltip", true)
	.style("opacity", 0) // start invisible

const topoUrl = 'https://unpkg.com/world-atlas@1/world/110m.json'
const meteoritesUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json'

// load the topology using topojson:
d3.json(topoUrl, (error, data) => {
  if (error) throw error
	gMapContainer
		.selectAll("path")
		.data(topojson.feature(data, data.objects.countries).features
			// sort meteorites by mass, so smaller are drawn over bigger to avoid occlusion:
			.sort((a, b) => b.properties.mass - a.properties.mass))
		.enter().append("path")
			.attr("class", "nation")
			.attr("d", path)
  
  // load the meteorites data:
  d3.json(meteoritesUrl, (error, data) => {
  	if (error) throw error
  	const meteoArray = data.features

  	// biggest and smallest meteorites:
  	const maxMass = d3.max(meteoArray, d => +d.properties.mass)
  	const minMass = Math.min(0, d3.min(meteoArray, d => +d.properties.mass))

  	// scale meteorite radius proportionally to the square of its mass:
  	const radius = d3.scaleSqrt().domain([minMass, maxMass]).range([1, 20])

  	// add a circle for every meteorite:
    gMapContainer.append("g")
		.selectAll("circle")
			.data(meteoArray)
		.enter().append("circle")
			.attr("class", "meteorite")
			.attr("transform", d => "translate(" + path.centroid(d) + ")")
    	.attr("r", d => radius(d.properties.mass))
    	.on("mouseover", function(d) {
    		const properties = d.properties
	    	d3.select(this).classed("overed", true) // add "overed" class to the rect
	    	tooltip.transition()
	    		.duration(300)
	    		.style("opacity", 0.8) // show the tooltip
	    	let tooltipContent = "<table><tbody>" +
	    											"<tr><td>Landing site: </td><td><span class='property'>" + properties.name + "</span></td></tr>" +
	    											"<tr><td>Mass: </td><td><span class='property'>" + d3.format(",")(+properties.mass) + "</span></td></tr>" +
	    											"<tr><td>Year: </td><td><span class='property'>" + new Date(properties.year).getFullYear() + "</span></td></tr>" +
	    											"<tr><td>Class: </td><td><span class='property'>" + properties.recclass + "</span></td></tr>" + 
	    											"<tr><td>Latitude: </td><td><span class='property'>" + properties.reclat + "</span></td></tr>" + 
	    											"<tr><td>Longitude: </td><td><span class='property'>" + properties.reclong + "</span></td></tr>" +
	    											"</tbody></table>"
	    	tooltip.html(tooltipContent)
	      	.style("left", (d3.event.pageX - d3.select('.tooltip').node().offsetWidth / 2 - 5) + "px")
	        .style("top", (d3.event.pageY - d3.select('.tooltip').node().offsetHeight) + "px");
    	})
    	.on("mouseleave", function(d) {
    		d3.select(this).classed("overed", false)
	    	tooltip.transition()
	    		.duration(200)
	    		.style("opacity", 0)
    	})
	})
})

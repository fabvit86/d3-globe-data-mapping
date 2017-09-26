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

const topoUrl = 'https://unpkg.com/world-atlas@1/world/110m.json'
const meteoritesUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json'

// load the topology using topojson:
d3.json(topoUrl, function(error, data) {
  if (error) throw error
	gMapContainer
		.selectAll("path")
		.data(topojson.feature(data, data.objects.countries).features)
		.enter().append("path")
			.attr("class", "nation")
			.attr("d", path)

	// gMapContainer
	// 	.append("path")
 //    .datum(topojson.mesh(data, data.objects.countries, (a, b) => a !== b))
 //    .attr("class", "border")
 //    .attr("d", path)
  
  // load the meteorites data:
  d3.json(meteoritesUrl, function(error, data) {
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
    	// .attr("class", d => console.log(d.properties.mass))
  	// console.log(meteoArray[0].geometry.coordinates) //TEST
  	// console.log(projection(meteoArray[0].geometry.coordinates[0]))
	})
})

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

// load the topology using topojson:
const url = 'https://unpkg.com/world-atlas@1/world/110m.json'
d3.json(url, function(error, data) {
  if (error) throw error
	svg.append("g")
		.attr("class", "map")
		.selectAll("path")
		.data(topojson.feature(data, data.objects.countries).features)
		.enter()
		.append("path")
			.attr("d", path)
})


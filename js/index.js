var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var margin = {
  top: 50,
  bottom: 100,
  left: 50,
  right: 50
}

var w = 1200 - margin.left - margin.right;
var h = 600 - margin.top - margin.bottom;
var gridHeight = 40;

var svg = d3.select("#chart")
  .append("svg")
  .attr("width", w + margin.left + margin.right)
  .attr("height", h + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//div for tooltip
  var tooltip = d3.select("body").append("div")  
    .attr("class", "tooltip")               
    .style("opacity", 0)
    .style("z-index", "10");

var minDate = new Date("1753");
var maxDate = new Date("2016");
//SCALES//
var x = d3.scaleTime().range([0, w]).domain([minDate, maxDate]);
var y = d3.scaleLinear().range([h, 0]).domain([12, 1]);

var color = d3.scaleLinear().range(["blue", "white", "red"]);

var getMonth = function(month) {
  return months[month-1];
}
//XAXIS
var xAxis = d3.axisBottom(x).ticks(20).tickFormat(d3.timeFormat("%Y"));

svg.append("g")
  .attr("transform", "translate(" + margin.left +"," + (h + margin.top)  +")")
  .call(xAxis);

//YAXIS  
var monthLabels = svg.selectAll(".monthLabels")
    .data(months)
    .enter().append("text")
    .text(function(d) {return d})
    .attr("x", margin.left)
    .attr("y", function(d, i) {return i*gridHeight})
    .style("text-anchor", "end")
    .attr("class", "monthLabels")
    .attr("transform", "translate(-20, "+ 30 +")");

d3.json(url, function(error, data) {
  if (error) throw error;
  
  var variances = [];
      
data.monthlyVariance.forEach(function(el) {
  variances.push(el.variance)
}) 
  
  color.domain([d3.min(variances), 0, d3.max(variances)]);
  
  svg.selectAll(".svgrect")
    .data(data.monthlyVariance)
    .enter().append("rect")
    .attr("class", "svgrect")
    .attr("x", function(d) {return x(new Date(d.year.toString()))})
    .attr("y",function(d){return y(d.month)} )
    .attr("width", 10)
    .attr("height", gridHeight)
    .attr("fill", function(d) {return color(d.variance*30)})
    .attr("transform", "translate("+ margin.left +", 0)")
    .on("mouseover", function(d) {  
            
             tooltip.transition()        
                .duration(100)      
                .style("opacity", .9);      
             tooltip.html("<span class='year'>" + getMonth(d.month) + " " + d.year + "</span><br /><br /><span class='temperature'>Average Temperature: " + (Math.floor((8.66+d.variance)*1000)/1000) +" &#8451</span><br><span class='variance'>Variance: " + d.variance + " &#8451</span>")  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY) + "px");;    
            })                  
        .on("mouseout", function(d) {       
            tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });

});
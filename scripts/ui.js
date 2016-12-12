// d3.select("#uicontrols").on("mouseover",function(event){
//   console.log("on ui controls")
//   d3.event.sourceEvent.stopPropagation();
// })

$('#components').dropdown({
  // allowAdditions: false,
  onChange: function(val){
    console.log("value of selection in drop down", val)
    ui_current_state.set("component", val)
    ui_current_state.set("data_needs_to_filter", 0)

    updateViz()
  }
})


$('#rangestart').calendar({
  // type: 'date',
  endCalendar: $('#rangeend'),
  onChange: function(val){
    console.log(event)
    event.preventDefault()
    console.log("rangestart", val)
    ui_current_state.set("rangestart", val)
    updateDataForViz()
  }
});
$('#rangeend').calendar({
  // type: 'date',
  startCalendar: $('#rangestart'),
  onChange: function(val){
    console.log("rangeend", val)
    ui_current_state.set("rangeend", val)
    updateDataForViz()
  }
});


// var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");
formatDate=d3.timeParse("%b %d");;
var margin={top:5,right:1,bottom:1,left:1},width=960-margin.left-margin.right,height=54;
var timeScale=d3.scaleTime().domain([new Date('2012-01-02'),new Date('2013-01-01')]).range([0,width]).clamp(true);
var startValue=timeScale(new Date('2012-03-20'));
var brush=d3.brushX()
// brushX(timeScale).extent([startingValue,startingValue]).on("brush",brushed);
// brush.handleSize([2,2])


// console.log("in update dynamic text")
// var dtext=d3.select("#dynemictext").selectAll("g").data(ui_current_state.get("data_map_buffr_ind"))
// var dtextEnter = dtext.enter().append("g").attr('transform', 'translate(' + 30 + ',' + 49 + ')')
// dtextExit = dtext.exit().remove().transition()
// dtext.append("text").transition().duration(19).text(function(d){return d;})


var svg=d3.select("#timedatetext").append("g").attr("class","x axis").attr(
  "transform","translate("+margin.left+","+margin.top+")"
)
// svg.append("g")


//
// svg.append("g").attr(
//   "class","x axis"
// ).attr(
//   "transform","translate(0,"+height/2+")"
// ).attr("class", "brush")

// .call(brush)
// .call(
//   d3.axisBottom().scale(timeScale).tickFormat(function(d){
//     return formatDate(d);
//   }).tickSize(
//     0
//   ).tickPadding(
//     12
//   ).tickValues(
//     [timeScale.domain()[0],timeScale.domain()[1]]
//   )
// ).call(d3.brush().on("brush", brushed))
// .select(".domain").select(function(){
//   console.log(this);
//   return this.parentNode.appendChild(this.cloneNode(true));}
// ).attr("class","halo");
//
// var slider=svg.append("g").attr("class","slider").call(brush);
// slider.selectAll(".extent,.resize").remove();
// slider.select(".background").attr("height",height);
//
// var handle=slider.append("g").attr("class","handle")
//
// handle.append("path").attr(
//   "transform","translate(0,"+height/2+")"
// ).attr("d","M 0 -20 V 20")
//
// handle.append('text').text(
//   startingValue
// ).attr(
//   "transform","translate("+(-18)+" ,"+(height/2-25)+")"
// );
// slider.call(brush)


function brushed(){
  var value=brush.extent()[0];
  if(d3.event.sourceEvent){value=timeScale.invert(d3.mouse(this)[0]);
    brush.extent([value,value]);
  }
  console.log("value",value)
  // handle.attr("transform","translate("+timeScale(value)+",0)");
  // handle.select('text').text(formatDate(value));
}


var time_line_width = 600;
// console.log(scalerConfig)


var time_line = d3.select("#range-speed").append("svg").attr("height", 60).attr("width", time_line_width)
// console.log(time_line,width_scale(ui_current_state.get("data_map_buffr_ind")))


var container = time_line.append("g")

// .attr('transform', 'translate(' + 0 + ',' + 5 + ')').attr("class","timeline_container").attr("height", 20).append("rect").attr("height", 20).attr("width", time_line_width)
time_line.append("g").attr('transform', 'translate(' + 0 + ',' + 40 + ')').attr("class","timeline").append("rect").attr("height", 2).attr("width", time_line_width);



// var handle = container.append("g").attr(
//   "width", 4
// ).attr(
//   "height", 6
// ).attr('transform', 'translate(' + width_scale(ui_current_state.get("data_map_buffr_ind")) + ',' + -8 + ')').append("rect").attr("width", 4).attr('height', 16)
// .call(d3.drag().on("start",dragStart));

function dragStart(){
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
  console.log("drag start")
  console.log(d3.select(this))
}
// $('#range-speed').range({
//     min: 0,
//     max: 10,
//     start: 5
//   });

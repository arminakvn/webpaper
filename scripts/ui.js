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

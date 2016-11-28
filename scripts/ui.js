$('#components').dropdown({
  // allowAdditions: false,
  onChange: function(val){
    console.log("value of selection in drop down", val)
    ui_current_state.set("component", val)
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

$('#example5').calendar();

$('#date_picker').calendar({
  monthFirst: false,
  formatter: {
    date: function (date, settings) {
      if (!date) return '';
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      return day + '/' + month + '/' + year;
    }
  }
});

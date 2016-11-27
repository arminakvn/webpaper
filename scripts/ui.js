$('#date_selection').dropdown(
)


$('#rangestart').calendar({
  // type: 'date',
  endCalendar: $('#rangeend')
});
$('#rangeend').calendar({
  // type: 'date',
  startCalendar: $('#rangestart')
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

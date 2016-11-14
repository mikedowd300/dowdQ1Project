// $.get('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDY1Bejcaihc8wem3VEuJ7MvmX5rI38GUI', function(data) {
//   //var obj = $.parseJSON(data);
//   var lat = data.results[0].geometry.location.lat;
//   var long = data.results[0].geometry.location.lng;
//   console.log(lat, long);
//   $('p').text(lat + ', ' + long);
// })

$('button').on('click', function() {

  var str = $('#address').val();

  $.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + str.trim() + '&key=AIzaSyDY1Bejcaihc8wem3VEuJ7MvmX5rI38GUI', function(data) {
    //var obj = $.parseJSON(data);
    var lat = data.results[0].geometry.location.lat;
    var long = data.results[0].geometry.location.lng;
    console.log(lat, long);
    $('p').text(lat + ', ' + long);
    var hrefStr = '<a href="https://www.google.com/maps/@' + lat +','+ long + '">Click To see</a>';
    console.log(hrefStr);
    $('.showMap').append(hrefStr);
  })



  console.log(str);
});

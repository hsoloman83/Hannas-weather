$(function() {
  //connecting the html and js
  //calling all the variables first
  var $wrapper = $('.wrapper'),
    $panel = $wrapper.find('.panel'),
    $city = $panel.find('#city'),
    $weather = $panel.find('.weather'),
    $temperature = $weather.find('#temperature'),
    $temp = $temperature.find('#temp'),
    $icon = $temp.find('#condition'),
    $tempNumber = $temp.find('#num'),
    $celsius = $temp.find('#celsius'),
    $fahrenheit = $temp.find('#fahrenheit'),
    $search = $wrapper.find('search'),
    $form = $search.find('form'),
    $button = $form.find('#button');

    //where is the user? finds the users location based on ip address, googled this!
  $.ajax({
    dataType: 'json',
    url: 'http://ip-api.com/json'
    })
    .then(function(data) {
      var yourLocation = data.city + ',' + data.zip + ',' + data.countryCode;
      getWeather(yourLocation);
    });

    //based on the users location get the weather and show it in fahrenheit "imperial"
    //using the key and url that shows the weather at the time. code from doc in open weather
  function getWeather(input) {

    var appid = '82bfefad1b145857e7aab295d422936f';
    var requestWeather = $.ajax({
      url: 'http://api.openweathermap.org/data/2.5/weather',
      data: {
        q: input,
        units: 'imperial',
        appid: appid
      }
    });
    //showing fahrenheit first but also being able to change to celcius too 
   $fahrenheit.addClass('active').removeAttr('href');
    $celsius.removeClass('active').attr("href", '#');
    $icon.removeClass();
    $button.removeClass().addClass('button transparent');

    requestWeather.done(function(data) {
      //the data it shows the city and country name 
      //then the temp with both f and c 
      $city.html(data.name + ' ' + data.sys.country);
      $tempNumber.html(Math.round(data.main.temp));
      $celsius.on('click', toCelsius);
      $fahrenheit.on('click', toFahrenheit);
      //I tried to get this working but ended up recycling the FEWD temp excercise!
      function toCelsius() {
        $(this).addClass('active').removeAttr('href');
        $fahrenheit.removeClass('active').attr('href', '#');
        $tempNumber.html(Math.round((data.main.temp - 32) * (5 / 9)));
      }

      function toFahrenheit() {
        $(this).addClass('active').removeAttr('href');
        $celsius.removeClass('active').attr("href", '#');
        $tempNumber.html(Math.round(data.main.temp));
      }
      //this came from the icon site tried to put it all in one switch but
      //didnt work and searched to find this solution instead although not sure why
      //the second uses a substring method as the first works without it?
      switch (data.weather[0].icon) {
        case '01d': $icon.addClass('wi wi-day-sunny');
          break;
        case '02d': $icon.addClass('wi wi-day-sunny-overcast');
          break;
        case '01n': $icon.addClass('wi wi-night-clear');
          break;
        case '02n': $icon.addClass('wi wi-night-partly-cloudy');
          break;
      }
      switch (data.weather[0].icon.substr(0, 2)) {
        case '03': $icon.addClass('wi wi-cloud');
          break;
        case '04': $icon.addClass('wi wi-cloudy');
          break;
        case '09': $icon.addClass('wi wi-showers');
          break;
        case '10': $icon.addClass('wi wi-rain');
          break;
        case '11': $icon.addClass('wi wi-thunderstorm');
          break;
        case '13': $icon.addClass('wi wi-snow');
          break;
        case '50': $icon.addClass('wi wi-fog');
          break;
      }
    });
  }
  $form.submit(function(event) {
    var input = document.getElementById('search').value;
    var inputLength = input.length;
    if (inputLength) getWeather(input);
    event.preventDefault();
  });
});
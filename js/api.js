// api key from js/secrets.js
var wundergroundAPIKey = WUNDERGROUNDAPIKEY;

// dev mode
var devMode = true; // set to false to pull from api. Make sure you have a key
var zipCode = '03053';

if (devMode) {
  // use local copies of json
  var wundergroundConditionsURL = 'js/dev/conditions.json'
  var wundergroundForecastURL   = 'js/dev/forecast.json'
  var wundergroundAstronomyURL  = 'js/dev/astronomy.json'
  console.log("dev mode active");
} else {
  // use wunderground weather api
  var wundergroundConditionsURL = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/conditions/q/' + zipCode + '.json';
  var wundergroundForecastURL   = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/forecast/q/' + zipCode + '.json';
  var wundergroundAstronomyURL  = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/astronomy/q/' + zipCode + '.json';
  console.log("dev mode inactive. You're LIVE");
}

////////////////////////////////////////////////////////////
////////////////////// Conditions
////////////////////////////////////////////////////////////

var getConditionsJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

getConditionsJSON(wundergroundConditionsURL).then(
  function(data) {
    console.log('JSON result: Location ' + data.location.city); // debug
    document.getElementById("conditions-city-location").textContent = data.location.city;
    document.getElementById("day-current-temp").textContent         = Math.round(data.current_observation.temp_f);
    document.getElementById("wind-speed").textContent               = Math.round(data.current_observation.wind_mph);
    document.getElementById("wind-gust").textContent                = Math.round(data.current_observation.wind_gust_mph);
    document.getElementById("today-observed-time").textContent      = data.current_observation.observation_time;
  },
  function(status) {
    //error detection....
    console.log('Something went wrong.');
    alert('Something went wrong.');
  }
);

////////////////////////////////////////////////////////////
////////////////////// Forecast
////////////////////////////////////////////////////////////

var getForecastJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

getForecastJSON(wundergroundForecastURL).then(
  function(data) {
    console.log('JSON result: High ' + data.forecast.simpleforecast.forecastday[0].high.fahrenheit); // debug
    console.log('JSON result: Low '  + data.forecast.simpleforecast.forecastday[0].low.fahrenheit); // debug
    document.getElementById("day-high").textContent   = data.forecast.simpleforecast.forecastday[0].high.fahrenheit;
    document.getElementById("day-low").textContent    = data.forecast.simpleforecast.forecastday[0].low.fahrenheit;
  },
  function(status) {
    //error detection....
    console.log('Something went wrong.');
    alert('Something went wrong.');
  }
);

////////////////////////////////////////////////////////////
////////////////////// Astronomy
////////////////////////////////////////////////////////////

var getAstronomyJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};

getAstronomyJSON(wundergroundAstronomyURL).then(
  function(data) {
    // alert('JSON result: ' + data.sun_phase.sunrise.hour); // debug
    document.getElementById("sunrise").textContent = data.sun_phase.sunrise.hour + ":" +  data.sun_phase.sunrise.minute + " am";
    document.getElementById("sunset").textContent  = data.sun_phase.sunset.hour - 12 + ":" +  data.sun_phase.sunset.minute + " pm";
  },
  function(status) {
    //error detection....
    console.log('Something went wrong.');
    alert('Something went wrong.');
  }
);

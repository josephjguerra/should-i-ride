// api key from js/secrets.js
var wundergroundAPIKey = WUNDERGROUNDAPIKEY;

// dev mode
var devMode = true; // set to false to pull from api. Uncomment index.html scripts. Make sure you have a key.
var zipCode = '03053';

if (devMode) {
  // use local copies of json
  var wundergroundConditionsURL      = 'js/dev/conditions.json'
  var wundergroundForecast10dayURL   = 'js/dev/forecast10day.json'
  var wundergroundAstronomyURL       = 'js/dev/astronomy.json'
  console.log("dev mode active");
} else {
  // use wunderground weather api
  var wundergroundConditionsURL      = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/conditions/q/'    + zipCode + '.json';
  var wundergroundForecast10dayURL   = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/forecast10day/q/' + zipCode + '.json';
  var wundergroundAstronomyURL       = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/astronomy/q/'     + zipCode + '.json';
  console.log("dev mode inactive. You're LIVE");
}

var getWundergroundJSON = function(url) {
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

async function getWeatherAndCompute() {
  var conditionsData    = await getWundergroundJSON(wundergroundConditionsURL);
  var forecast10dayData = await getWundergroundJSON(wundergroundForecast10dayURL);
  var astronomyData     = await getWundergroundJSON(wundergroundAstronomyURL);
  console.log(conditionsData);
  console.log(forecast10dayData);
  console.log(astronomyData);

  // conditionsData
  document.getElementById("conditions-city-location").textContent = conditionsData.location.city;
  document.getElementById("day-current-temp").textContent         = Math.round(conditionsData.current_observation.temp_f);
  document.getElementById("wind-speed").textContent               = Math.round(conditionsData.current_observation.wind_mph);
  document.getElementById("wind-gust").textContent                = Math.round(conditionsData.current_observation.wind_gust_mph);
  document.getElementById("today-observed-time").textContent      = conditionsData.current_observation.observation_time;

  // forecast10dayData
  console.log('JSON result: High ' + forecast10dayData.forecast.simpleforecast.forecastday[0].high.fahrenheit); // debug
  console.log('JSON result: Low '  + forecast10dayData.forecast.simpleforecast.forecastday[0].low.fahrenheit);  // debug
  document.getElementById("day-high").textContent   = forecast10dayData.forecast.simpleforecast.forecastday[0].high.fahrenheit;
  document.getElementById("day-low").textContent    = forecast10dayData.forecast.simpleforecast.forecastday[0].low.fahrenheit;

  // astronomyData
  console.log('JSON result: ' + astronomyData.sun_phase.sunrise.hour); // debug
  document.getElementById("sunrise").textContent = astronomyData.sun_phase.sunrise.hour + ":" +       astronomyData.sun_phase.sunrise.minute + " am";
  document.getElementById("sunset").textContent  = astronomyData.sun_phase.sunset.hour  - 12 + ":" +  astronomyData.sun_phase.sunset.minute  + " pm";
}

getWeatherAndCompute();

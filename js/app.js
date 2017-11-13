// api key from js/secrets.js
var wundergroundAPIKey;

// dev mode
// set true to full from local js/dev json files
// set false to pull from api
var devMode = true;
var zipCode = '28280';

// user preferences
var myMaxTemp            = 100;
var myMinTemp            = 40;
var myMaxPrecip          = 100;

// placeholder variables
var currentCondition;     // = "Sunny";
var observedTemp;         // = 77;
var currentChancePrecip;  // = 11;

//setting icon - TODO: add all available ---OR--- use images from json reponse
function setIconBasedOnCondition(condition, id) {
  if (condition == "Sunny") {
    document.getElementById(id).src = "img/conditions/day/clear.svg";
  } else if (condition == "Partly Cloudy") {
    document.getElementById(id).src = "img/conditions/day/partlycloudy.svg";
  } else if (condition == "Mostly Cloudy") {
    document.getElementById(id).src = "img/conditions/day/mostlycloudy.svg";
  } else if (condition == "Rain") {
    document.getElementById(id).src = "img/conditions/day/rain.svg";
  } else if (condition == "Chance of Rain") {
    document.getElementById(id).src = "img/conditions/day/chancerain.svg";
  } else if (condition == "Chance of a Thunderstorm") {
    document.getElementById(id).src = "img/conditions/day/chancetstorms.svg";
  } else if (condition == "Cloudy") {
    document.getElementById(id).src = "img/conditions/day/cloudy.svg";
  } else if (condition == "Snow") {
    document.getElementById(id).src = "img/conditions/day/snow.svg";
  } else {
    document.getElementById(id).src = "img/unicorn.svg";
  }
}

// actual logic for ride or no tide
function calculateRideOrNoRide() {
   if (
     myMaxTemp   > observedTemp        &&
     myMinTemp   < observedTemp        &&
     myMaxPrecip > currentChancePrecip
   ) {
     yesDecision();
   } else {
     noDecision();
   }
}

function yesDecision() {
  console.log('yes ride!!!');
  document.getElementById("decision").textContent = "Yes, ride!";
}

function noDecision() {
  console.log('nope... sulk inside :( ');
  document.getElementById("decision").textContent = "nope... sulk inside";
  document.getElementById("app").classList.add("noride");
}

function useRandomImage() {
  document.getElementById("app").style.background = "linear-gradient(rgba(4,32,26,0.91), rgba(8,64,53,0.91)), url('https://source.unsplash.com/weekly?motorcycle')";
  document.getElementById("app").style.backgroundPosition = "center";
  document.getElementById("app").style.backgroundSize = "cover";
}

if (devMode) {
  // use local copies of json to limit api call limits and use familiar data
  var wundergroundConditionsURL      = 'js/dev/clt-conditions.json'
  var wundergroundForecast10dayURL   = 'js/dev/clt-forecast10day.json'
  console.log("DEV MODE active, using local data."); // debug
} else {
  // use wunderground weather api for LIVE data
  var wundergroundAPIKey             = WUNDERGROUNDAPIKEY;
  var wundergroundConditionsURL      = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/conditions/q/'    + zipCode + '.json';
  var wundergroundForecast10dayURL   = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/forecast10day/q/' + zipCode + '.json';
  console.log("You're LIVE using wunderground data with your key.");
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

// main function to get data and process
async function getWeatherAndCompute() {
  var conditionsData    = await getWundergroundJSON(wundergroundConditionsURL);
  var forecast10dayData = await getWundergroundJSON(wundergroundForecast10dayURL);

  console.log(conditionsData);       // debug
  console.log(forecast10dayData);    // debug

  document.getElementById("temp").textContent          = Math.round(conditionsData.current_observation.temp_f);
  document.getElementById("pop").textContent           = forecast10dayData.forecast.simpleforecast.forecastday[0].pop;
  document.getElementById("high-temp").textContent     = forecast10dayData.forecast.simpleforecast.forecastday[0].high.fahrenheit;
  document.getElementById("low-temp").textContent      = forecast10dayData.forecast.simpleforecast.forecastday[0].low.fahrenheit;
  document.getElementById("observed-time").textContent = conditionsData.current_observation.observation_time;

  observedTemp        = Math.round(conditionsData.current_observation.temp_f);
  currentChancePrecip = forecast10dayData.forecast.simpleforecast.forecastday[0].pop;

  console.log("my temp is between " + myMinTemp + " and " + myMaxTemp);
  console.log(observedTemp + " observed temp");
  console.log("I wont ride in more then " + myMaxPrecip + " precip");
  console.log(currentChancePrecip + " precip");

  var conditions = forecast10dayData.forecast.simpleforecast.forecastday[0].conditions
  document.getElementById("condition").textContent = conditions;
  setIconBasedOnCondition(conditions, "condition-icon");

  calculateRideOrNoRide();
}
getWeatherAndCompute();

// shows slider values TODO refactor this
var maxTempSlider = document.getElementById("max-temp");
var maxTempOutput = document.getElementById("max-temp-value");
maxTempOutput.innerHTML = maxTempSlider.value;
maxTempSlider.oninput = function() {
  maxTempOutput.innerHTML = this.value;
}

var minTempSlider = document.getElementById("min-temp");
var minTempOutput = document.getElementById("min-temp-value");
minTempOutput.innerHTML = minTempSlider.value;
minTempSlider.oninput = function() {
  minTempOutput.innerHTML = this.value;
}

var maxPrecipSlider = document.getElementById("max-precip");
var maxPrecipOutput = document.getElementById("max-precip-value");
maxPrecipOutput.innerHTML = maxPrecipSlider.value;
maxPrecipSlider.oninput = function() {
  maxPrecipOutput.innerHTML = this.value;
}

// eh poo eye phrase
var magicNumChi = MAGICNUMCHI;

var zipCode = '28280';

// user preferences
var myMaxTemp    = 100;
var myMinTemp    = 40;
var myMaxPrecip  = 30;

// placeholder variables that get populated by weather fay
var currentCondition;     // = "Sunny";
var observedTemp;         // = 77;
var currentChancePrecip;  // = 11;

document.getElementById("location").textContent = "getting location...";

//setting icon - TODO: add all available ---OR--- use images from json reponse
function setIconBasedOnCondition(condition, id) {
  if (condition == "Sunny" || condition == "Clear") {
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
  document.getElementById("weather-metrics").style.visibility = "visible";
  document.getElementById("app").classList.remove("noride");
  document.getElementById("decision").classList.remove("fallin");
  document.getElementById("decision").classList.remove("shake");
  document.getElementById("app").classList.add("yesride");
  document.getElementById("decision").classList.add("tada");
}

function noDecision() {
  console.log('nope... sulk inside :( ');
  document.getElementById("decision").textContent = "nope, sulk inside";
  document.getElementById("weather-metrics").style.visibility = "visible";
  document.getElementById("app").classList.remove("yesride");
  document.getElementById("decision").classList.remove("fallin");
  document.getElementById("decision").classList.remove("tada");
  document.getElementById("app").classList.add("noride");
  document.getElementById("decision").classList.add("shake");
}

function useRandomImage() {
  document.getElementById("app").style.background = "linear-gradient(rgba(4,32,26,0.91), rgba(8,64,53,0.91)), url('https://source.unsplash.com/weekly?motorcycle')";
  document.getElementById("app").style.backgroundPosition = "center";
  document.getElementById("app").style.backgroundSize = "cover";
}

var waitForLocationURL = function(){
  return new Promise(
    function(resolve, reject) {
      // get the broswer location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position){
            console.log("browser lat lon: " + position.coords.latitude + ", " + position.coords.longitude); // debug
            // build the wunderground URL
            var wundergroundConditionsURLLatLon = 'https://api.wunderground.com/api/' + magicNumChi + '/geolookup/q/' + position.coords.latitude + ',' + position.coords.longitude + '.json';
            resolve(wundergroundConditionsURLLatLon);
          }
        );
      } else {
        reject("Unknown");
        document.getElementById("location").innerHTML = "Here be dragons!!"
      }
  });
};

// waitForLocationURL().then(function(loc) { console.log("Location:" + loc); }).catch(function(err) { console.log("No location"); }); //debug

var getWundergroundJSON = function(url) {
  return new Promise(
    function(resolve, reject) {
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
  var locationURL           = await waitForLocationURL();
  var geolookupLatLngJson   = await getWundergroundJSON(locationURL);
  var conditionsURL         = 'https://api.wunderground.com/api/' + magicNumChi + '/geolookup/conditions/q/' + geolookupLatLngJson.location.zip + '.json'
  var conditionsDataJson    = await getWundergroundJSON(conditionsURL);
  var forecastURL           = 'https://api.wunderground.com/api/' + magicNumChi + '/geolookup/forecast10day/q/' + zipCode + '.json';
  var forecast10dayData     = await getWundergroundJSON(forecastURL);

  console.log(conditionsDataJson);   // debug
  console.log(forecast10dayData);    // debug

  // update variables with returned data
  currentCondition    = forecast10dayData.forecast.simpleforecast.forecastday[0].conditions;
  observedTemp        = Math.round(conditionsDataJson.current_observation.temp_f);
  currentChancePrecip = forecast10dayData.forecast.simpleforecast.forecastday[0].pop;

  // update DOM with returned data
  document.getElementById("location").textContent      = geolookupLatLngJson.location.city + ", " +geolookupLatLngJson.location.state;
  document.getElementById("temp").textContent          = observedTemp;
  document.getElementById("condition").textContent     = currentCondition;
  document.getElementById("pop").textContent           = currentChancePrecip;
  document.getElementById("high-temp").textContent     = forecast10dayData.forecast.simpleforecast.forecastday[0].high.fahrenheit;
  document.getElementById("low-temp").textContent      = forecast10dayData.forecast.simpleforecast.forecastday[0].low.fahrenheit;
  document.getElementById("observed-time").textContent = conditionsDataJson.current_observation.observation_time;

  // debug
  console.log("my temp is between " + myMinTemp + " and " + myMaxTemp);
  console.log(observedTemp + " observed temp");
  console.log("I wont ride in more then " + myMaxPrecip + " precip");
  console.log(currentChancePrecip + " precip");
  console.log(currentCondition);

  setIconBasedOnCondition(currentCondition, "condition-icon");

  calculateRideOrNoRide();
}
getWeatherAndCompute();

// preferences
function togglePreferences() {
  document.getElementById("pref-container").classList.toggle("prefs-hidden");
  document.getElementById("pref").classList.toggle("prefs-hidden");
}

// fill prefs with initial values
document.getElementById("max-temp").value   = myMaxTemp;
document.getElementById("min-temp").value   = myMinTemp;
document.getElementById("max-precip").value = myMaxPrecip;

// assigne new pref value to variables
function recalculateWithNewPrefs() {
  myMaxTemp   = document.getElementById("max-temp").value;
  myMinTemp   = document.getElementById("min-temp").value;
  myMaxPrecip = document.getElementById("max-precip").value;
  console.log(myMaxTemp);
  console.log(myMinTemp);
  console.log(myMaxPrecip);
  calculateRideOrNoRide();
}

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

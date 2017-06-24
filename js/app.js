// api key from js/secrets.js
var wundergroundAPIKey;

// dev mode
// set true to full from local js/dev json files
// set false to pull from api
var devMode = true;
var zipCode = '96701';

// user preferences
var myMaxTemp            = 90;
var myMinTemp            = 50;
var myMaxPrecip          = 51;
var myMaxWinds           = 15;
var willIRideInRain      = true;
var willIRideAtNight     = false;

// top card current conditions placeholder variables
var currentCondition     = "Sunny";
var observedTemp         = 88;
var feelsLikeTemp        = 90;
var observedHighTemp     = 99;
var observedLowTemp      = 77;
var currentChancePrecip  = 11;
var observedWindSpeed    = 11;
var observedGust         = 22;
var sunrise              = "1:11am";
var sunset               = "1:11pm";
var observedTime         = "Last Updated on June 18, 10:00"

// morning afternoon evening cards placeholder variables
var morningCondition     = "Sunny";
var afternoonCondition   = "Partly Cloudy";
var eveningCondition     = "Chance of Rain";

// populating top card with defaults
document.getElementById("day-current-temp").textContent        = observedTemp;
document.getElementById("day-current-feels-like").textContent  = feelsLikeTemp;
document.getElementById("day-high").textContent                = observedHighTemp;
document.getElementById("day-low").textContent                 = observedLowTemp;
document.getElementById("chance-of-precip").textContent        = currentChancePrecip;
document.getElementById("sunrise").textContent                 = sunrise;
document.getElementById("sunset").textContent                  = sunset;
document.getElementById("wind-speed").textContent              = observedWindSpeed;
document.getElementById("wind-gust").textContent               = observedGust;

// observed time for refresh
document.getElementById("today-observed-time").textContent = observedTime;

//setting icon - TODO: add all available ---OR--- use images from json reponse
function setIconBasedOnCondition(condition, id) {
  if (condition == "Sunny") {
    document.getElementById(id).src = "img/conditions/day/clear.svg";
  } else if (condition == "Partly Cloudy") {
    document.getElementById(id).src = "img/conditions/day/partlycloudy.svg";
  } else if (condition == "Mostly Cloudy") {
    document.getElementById(id).src = "img/conditions/day/mostlycloudy.svg";
  } else if (condition == "Chance of Rain") {
    document.getElementById(id).src = "img/conditions/day/chancerain.svg";
  } else if (condition == "Chance of a Thunderstorm") {
    document.getElementById(id).src = "img/conditions/day/chancetstorms.svg";
  } else if (condition == "Cloudy") {
    document.getElementById(id).src = "img/conditions/day/cloudy.svg";
  } else if (condition == "Snow") {
    document.getElementById(id).src = "img/conditions/day/snow.svg";
  }
}

// decision algorithm - not currently working with json request data
function yesDecision() {
  document.getElementById("decision").textContent = "Yes";
  document.getElementById("decision-image").src   = "img/emotions/thumbup.svg";
}

function noDecision() {
  document.getElementById("decision").textContent = "No";
  document.getElementById("decision-image").src   = "img/emotions/sad.svg";
  applyNoDecisionColor("current-conditions-card");
}

function applyNoDecisionColor(id) {
  document.getElementById(id).classList.add("no-ride-table");
}

// actual logic for ride or no tide
function calculateRideOrNoRide() {
 // return new Promise(resolve => { // not sure if I need this to be a promise
   if (
     myMaxTemp   > observedTemp        &&
     myMaxWinds  > observedWindSpeed   &&
     myMaxPrecip > currentChancePrecip
   ) {
     yesDecision();
    //  resolve();
   } else {
     noDecision();
    //  resolve();
   }
 // });
}

if (devMode) {
  // use local copies of json to limit api call limits and use familiar data
  var wundergroundConditionsURL      = 'js/dev/conditions.json'
  var wundergroundForecast10dayURL   = 'js/dev/forecast10day.json'
  var wundergroundHourlyURL          = 'js/dev/hourly.json'
  var wundergroundAstronomyURL       = 'js/dev/astronomy.json'
  console.log("dev mode active - using local data");
} else {
  // use wunderground weather api for LIVE data
  var wundergroundAPIKey = WUNDERGROUNDAPIKEY;
  var wundergroundConditionsURL      = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/conditions/q/'    + zipCode + '.json';
  var wundergroundForecast10dayURL   = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/forecast10day/q/' + zipCode + '.json';
  var wundergroundHourlyURL          = 'http://api.wunderground.com/api/' + wundergroundAPIKey + '/geolookup/hourly/q/'        + zipCode + '.json';
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

// main function to get data and process
// how can I refactor  this to make dry?
// how can I pull out logic into individual functions?
async function getWeatherAndCompute() {
  var conditionsData    = await getWundergroundJSON(wundergroundConditionsURL);
  var forecast10dayData = await getWundergroundJSON(wundergroundForecast10dayURL);
  var hourlyData        = await getWundergroundJSON(wundergroundHourlyURL);
  var astronomyData     = await getWundergroundJSON(wundergroundAstronomyURL);
  console.log(conditionsData);    // debug
  console.log(forecast10dayData); // debug
  console.log(astronomyData);     // debug

  // conditionsData for top card
  console.log("conditions temp: " + Math.round(conditionsData.current_observation.temp_f));    //debug
  console.log("conditions wind: " + Math.round(conditionsData.current_observation.wind_mph));  //debug
  document.getElementById("conditions-city-location").textContent = conditionsData.location.city;
  document.getElementById("day-current-temp").textContent         = Math.round(conditionsData.current_observation.temp_f);
  document.getElementById("day-current-feels-like").textContent   = Math.round(conditionsData.current_observation.feelslike_f);
  document.getElementById("wind-speed").textContent               = Math.round(conditionsData.current_observation.wind_mph);
  document.getElementById("wind-gust").textContent                = Math.round(conditionsData.current_observation.wind_gust_mph);
  document.getElementById("today-observed-time").textContent      = conditionsData.current_observation.observation_time;
  setIconBasedOnCondition(conditionsData.current_observation.weather, "current-condition-icon"); // local image in SVG format
  // document.getElementById("current-condition-icon").src           = conditionsData.current_observation.icon_url; // this is image from JSON but it's too small and looks bad
  console.log("Weather is " + conditionsData.current_observation.weather); //debug
  observedTemp      = conditionsData.current_observation.temp_f
  observedWindSpeed = conditionsData.current_observation.wind_mph

  // morning afternoon evening
  // figure out current period as morning, afternoon everning, Night
  // start at current period
  if (parseInt(hourlyData.hourly_forecast[0].FCTTIME.hour) >= 18) {
    // evening
    console.log("evening");
    document.getElementById("first-third-card").textContent    = "Evening";
    document.getElementById("second-third-card").textContent   = "Night";
    document.getElementById("third-third-card").textContent    = "Morning";
  } else if (parseInt(hourlyData.hourly_forecast[0].FCTTIME.hour) >= 12) {
    // afternoon
    console.log("afternoon");
    document.getElementById("first-third-card").textContent    = "Afternoon";
    document.getElementById("second-third-card").textContent   = "Evening";
    document.getElementById("third-third-card").textContent    = "Night";
  } else if (parseInt(hourlyData.hourly_forecast[0].FCTTIME.hour) >= 6) {
    // morning
    console.log("morning");
    document.getElementById("first-third-card").textContent    = "Morning";
    document.getElementById("second-third-card").textContent   = "Afternoon";
    document.getElementById("third-third-card").textContent    = "Evening";
  } else {
    //night
    console.log("night");
    document.getElementById("first-third-card").textContent    = "Night";
    document.getElementById("second-third-card").textContent   = "Morning";
    document.getElementById("third-third-card").textContent    = "Afternoon";
  }
  // show period as weather from middle nine-hour
  // current periods are wrong and do not account for starting on even
  // show period as weather from middle nine-hour
  // update image
  document.getElementById("first-condition-icon").src    = hourlyData.hourly_forecast[2].icon_url;
  document.getElementById("second-condition-icon").src   = hourlyData.hourly_forecast[8].icon_url;
  document.getElementById("third-condition-icon").src    = hourlyData.hourly_forecast[14].icon_url;
  // color based on ride-no-ride

  // forecast10dayData for today nine cards
  console.log('High ' + forecast10dayData.forecast.simpleforecast.forecastday[0].high.fahrenheit); // debug
  console.log('Low '  + forecast10dayData.forecast.simpleforecast.forecastday[0].low.fahrenheit);  // debug
  document.getElementById("day-high").textContent            = forecast10dayData.forecast.simpleforecast.forecastday[0].high.fahrenheit;
  document.getElementById("day-low").textContent             = forecast10dayData.forecast.simpleforecast.forecastday[0].low.fahrenheit;
  document.getElementById("chance-of-precip").textContent    = forecast10dayData.forecast.simpleforecast.forecastday[0].pop;
  currentChancePrecip = forecast10dayData.forecast.simpleforecast.forecastday[0].pop;

  // function to build the cards with JSON data
  function generateTodayNineCards() {
    // remove placeholder data
    document.getElementById("today-nine").innerHTML = "";

    var output = ""; // debug
    var allTodayNine = "";
    // if first one is even then do it this many times
    // else if do it a different amount of times
    for (i = 0; i < 18; i++) {
      // only show every other entry
      // TODO need to start on an even number
      if ((hourlyData.hourly_forecast[i].FCTTIME.hour % 2) == 0) {

      var hourlyForecastTime           = parseInt(hourlyData.hourly_forecast[i].FCTTIME.hour);
      var hourlyForecastConditionImage = hourlyData.hourly_forecast[i].icon_url;
      var hourlyForecastTemp           = hourlyData.hourly_forecast[i].temp.english;
      var hourlyForecastPrecip         = hourlyData.hourly_forecast[i].pop;

      // build new cards // is there a way to update the cards without building them in JS?
      var todayNineCardsItem = "<div class='flex-item card'>";
      // convert to standard 12-hour time
      if (hourlyForecastTime > 12) {
        hourlyForecastTime = hourlyForecastTime - 12;
      } else if (hourlyForecastTime == 0) {
        hourlyForecastTime = 12;
      }
      todayNineCardTime      = "<div class='flex-sub'>" + hourlyForecastTime + hourlyData.hourly_forecast[i].FCTTIME.ampm.toLowerCase() + "</div>";
      todayNineCardCondition = "<div class='flex-sub'><img src='" + hourlyForecastConditionImage + "' alt='Sunny' class='hourly-sunny'></div>";
      todayNineCardTemp      = "<div class='flex-sub'>" + hourlyForecastTemp + "&#176;</div>";
      todayNineCardPrecip    = "<div class='flex-sub'><img src='img/precip.svg' width='10px'>" + hourlyForecastPrecip + "%</div>";
      todayNineCardsItem += todayNineCardTime + todayNineCardCondition + todayNineCardTemp + todayNineCardPrecip + "</div>";
      allTodayNine += todayNineCardsItem

      //debug
      output += "Hour:" + hourlyData.hourly_forecast[i].FCTTIME.hour + " ";
      console.log("i equals: " + i);
      }
    }
    document.getElementById("today-nine").innerHTML = allTodayNine;
    console.log(output); // debug
  }
  generateTodayNineCards();

  // astronomyData
  console.log('sunrise hour: ' + astronomyData.sun_phase.sunrise.hour); // debug
  document.getElementById("sunrise").textContent = astronomyData.sun_phase.sunrise.hour + ":" +       astronomyData.sun_phase.sunrise.minute + " am";
  document.getElementById("sunset").textContent  = astronomyData.sun_phase.sunset.hour  - 12 + ":" +  astronomyData.sun_phase.sunset.minute  + " pm";

  // HOURLY
  // build table

  function generateHourlyTableRows() {
    document.getElementById("hourly-table-body").innerHTML = "";

    var hourlyConsoleOutput = "";
    var hourlyTableOutput   = "";
    var output = ""; // debug

    for (var i = 0; i < 25; i++) {
      var hourlyTableForecastTime           = parseInt(hourlyData.hourly_forecast[i].FCTTIME.hour);
      var hourlyTableForecastTemp           = hourlyData.hourly_forecast[i].temp.english;
      var hourlyTableForecastConditionImage = hourlyData.hourly_forecast[i].icon_url;
      var hourlyTableForecastPrecip         = hourlyData.hourly_forecast[i].pop;
      var hourlyTableForecastWind           = hourlyData.hourly_forecast[i].wspd.english;


      var hourlyTableRow = "<tr>";
      if (hourlyTableForecastTime > 12) {
        hourlyTableForecastTime = hourlyTableForecastTime - 12;
      } else if (hourlyTableForecastTime == 0) {
        hourlyTableForecastTime = 12;
      }
      hourlyTableForecastTime               = "<td class='mdl-data-table__cell--non-numeric'>" + hourlyTableForecastTime + "am</td>";
      hourlyTableForecastTemp               = "<td class='mdl-data-table__cell--non-numeric'>" + hourlyTableForecastTemp + "&#176;</td>";
      hourlyTableForecastConditionImage     = "<td class='mdl-data-table__cell--non-numeric'><img src='" + hourlyTableForecastConditionImage + "' alt='Sunny' class='hourly-sunny'></td>";
      hourlyTableForecastPrecip             = "<td class='mdl-data-table__cell--non-numeric'><img src='img/precip.svg' width='10px'>" + hourlyTableForecastPrecip + "%</td>";
      hourlyTableForecastWind               = "<td class='mdl-data-table__cell--non-numeric'><img src='img/wind.svg' alt='wind-speed' width='10px'>" + hourlyTableForecastWind + "mph</td>";
      hourlyTableRow += hourlyTableForecastTime + hourlyTableForecastTemp + hourlyTableForecastConditionImage + hourlyTableForecastPrecip + hourlyTableForecastWind;
      hourlyTableOutput += hourlyTableRow;

      //debug
      output += "Hour:" + hourlyData.hourly_forecast[i].FCTTIME.hour + " ";
      console.log("i equals: " + i);
    }
    document.getElementById("hourly-table-body").innerHTML = hourlyTableOutput;
    console.log(hourlyConsoleOutput);

  }
  generateHourlyTableRows();

  // 10 day

  function generate10DayTableRows() {
    document.getElementById("ten-day-table-body").innerHTML = "";

    var tenDayConsoleOutput = "";
    var tenDayTableOutput   = "";
    var output = ""; // debug

    for (var i = 0; i < 10; i++) {
      var tenDayTableForecastTime           = forecast10dayData.forecast.simpleforecast.forecastday[i].date.weekday;
      var tenDayTableForecastTemp           = forecast10dayData.forecast.simpleforecast.forecastday[i].high.fahrenheit;
      var tenDayTableForecastConditionImage = forecast10dayData.forecast.simpleforecast.forecastday[i].icon_url;
      var tenDayTableForecastPrecip         = forecast10dayData.forecast.simpleforecast.forecastday[i].pop;
      var tenDayTableForecastWind           = forecast10dayData.forecast.simpleforecast.forecastday[i].avewind.mph;

      var tenDayTableRow = "<tr>";
      tenDayTableForecastTime               = "<td class='mdl-data-table__cell--non-numeric'>" + tenDayTableForecastTime + "</td>";
      tenDayTableForecastTemp               = "<td class='mdl-data-table__cell--non-numeric'>" + tenDayTableForecastTemp + "&#176;</td>";
      tenDayTableForecastConditionImage     = "<td class='mdl-data-table__cell--non-numeric'><img src='" + tenDayTableForecastConditionImage + "' alt='Sunny' class='hourly-sunny'></td>";
      tenDayTableForecastPrecip             = "<td class='mdl-data-table__cell--non-numeric'><img src='img/precip.svg' width='10px'>" + tenDayTableForecastPrecip + "%</td>";
      tenDayTableForecastWind               = "<td class='mdl-data-table__cell--non-numeric'><img src='img/wind.svg' alt='wind-speed' width='10px'>" + tenDayTableForecastWind + "mph</td>";
      tenDayTableRow += tenDayTableForecastTime + tenDayTableForecastTemp + tenDayTableForecastConditionImage + tenDayTableForecastPrecip + tenDayTableForecastWind;
      tenDayTableOutput += tenDayTableRow;

      // <tr>
      //   <td class="mdl-data-table__cell--non-numeric">9am</td>
      //   <td class="mdl-data-table__cell--non-numeric">75 &#176;</td>
      //   <td class="mdl-data-table__cell--non-numeric"><img src="img/precip.svg" width="10px">10%</td>
      //   <td class="mdl-data-table__cell--non-numeric"><img src="img/wind.svg" alt="wind-speed" width="10px">5mph</td>
      //   <td class="mdl-data-table__cell--non-numeric"><img src="img/conditions/day/clear.svg" alt="Sunny" class="hourly-sunny"></td>
      // </tr>

      //debug
      output += "Day:" + forecast10dayData.forecast.simpleforecast.forecastday[i].date.weekday + " ";
      console.log("i equals: " + i);
    }
    document.getElementById("ten-day-table-body").innerHTML = tenDayTableOutput;
    console.log(tenDayConsoleOutput);

  }
  generate10DayTableRows();


  // calculate after JSON, assigning variables, and updating DOM
  calculateRideOrNoRide();
}

// call the main function to get JSON and build cards with data
getWeatherAndCompute();

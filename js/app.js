// user preferences
var myMaxTemp            = 95;
var myMinTemp            = 50;
var myMaxPrecip          = 25;
var myMaxWinds           = 15;
var willIRideInRain      = true;
var willIRideAtNight     = false;

// top card
var currentCondition     = "Sunny";
var observedTemp         = 88;
var observedHighTemp     = 99;
var observedLowTemp      = 77;
var currentChancePrecip  = 11;
var observedWindSpeed    = 11;
var observedGust         = 22;
var sunrise              = "1:11am";
var sunset               = "1:11pm";
var observedTime         = "Last Updated on June 18, 10:00"

// morning afternoon evening cards
var morningCondition     = "Sunny";
var afternoonCondition   = "Partly Cloudy";
var eveningCondition     = "Chance of Rain";

// populating top card with defaults
document.getElementById("day-current-temp").textContent  = observedTemp;
document.getElementById("day-high").textContent          = observedHighTemp;
document.getElementById("day-low").textContent           = observedLowTemp;
document.getElementById("chance-of-precip").textContent  = currentChancePrecip;
document.getElementById("sunrise").textContent           = sunrise;
document.getElementById("sunset").textContent            = sunset;
document.getElementById("wind-speed").textContent        = observedWindSpeed;
document.getElementById("wind-gust").textContent         = observedGust;

// observed time for refresh
document.getElementById("today-observed-time").textContent = observedTime;

//setting icon - TODO: add all available
function setIconBasedOnCondition(condition, id) {
  if (condition == "Sunny") {
    document.getElementById(id).src = "img/conditions/day/clear.svg";
  } else if (condition == "Partly Cloudy") {
    document.getElementById(id).src = "img/conditions/day/partlycloudy.svg";
  } else if (condition == "Mostly Cloudy") {
    document.getElementById(id).src = "img/conditions/day/mostlycloudy.svg";
  } else if (condition == "Chance of Rain") {
    document.getElementById(id).src = "img/conditions/day/chancerain.svg";
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

 return new Promise(resolve => {
   if (
     myMaxTemp   > observedTemp        &&
     myMaxWinds  > observedWindSpeed   //&&
     // myMaxPrecip > currentChancePrecip
   ) {
     yesDecision();
     resolve();
   } else {
     noDecision();
     resolve();
   }
 });

}

// calculateRideOrNoRide();

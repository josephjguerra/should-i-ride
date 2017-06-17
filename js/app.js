var maxTemp     = 95;
var minTemp     = 50;
var maxPrecip   = 25;
var maxWinds    = 15;
var rideInRain  = true;
var rideAtNight = false;

var observedTemp       = 80;
var observedHighTemp   = 90;
var observedLowTemp    = 70;
var observedConditions = "Sunny";

var currentChancePrecip = "11%";

var sunrise = "6:09 am";
var sunset = "8:20 pm";

var observedWindSpeed     = 5;
var observedGust          = 10;

var decision = false;

document.getElementById("day-current-temp").textContent  = observedTemp;
document.getElementById("day-high").textContent = observedHighTemp;
document.getElementById("day-low").textContent  = observedLowTemp;

document.getElementById("chance-of-precip").textContent  = currentChancePrecip;

document.getElementById("sunrise").textContent = sunrise;
document.getElementById("sunset").textContent  = sunset;

document.getElementById("wind-speed").textContent = observedWindSpeed;
document.getElementById("wind-gust").textContent  = observedGust;

function yesDecision() {
  document.getElementById("decision").textContent = "Yes";
  document.getElementById("decision-image").src   = "img/emotions/thumbup.svg";
}

function noDecision() {
  document.getElementById("decision").textContent = "No";
  document.getElementById("decision-image").src   = "img/emotions/thumbdown.svg";
}

function calculateRideOrNoRide() {
  if (decision) {
    yesDecision();
  } else {
    noDecision();
  }

}

calculateRideOrNoRide();

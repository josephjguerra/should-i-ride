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

var sunset  = "6:09 am";
var sunrise = "8:20 pm";

var observedWindSpeed     = 5;
var observedGust          = 10;
var observedWindDirection = "SW";

document.getElementById("day-high").textContent = observedHighTemp;
document.getElementById("day-low").textContent  = observedLowTemp;

document.getElementById("sunrise").textContent = sunrise;
document.getElementById("sunset").textContent  = sunset;

document.getElementById("wind-speed").textContent      = observedWindSpeed;
document.getElementById("wind-direction").textContent  = observedWindDirection;
document.getElementById("wind-gust").textContent       = observedGust;

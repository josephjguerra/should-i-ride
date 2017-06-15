# Should I ride the motorcycle today?

### Problem
Should I ride today? Or will I get stuck in bad weather?

### Solution
an immediate yes or no decision to ride with weather details

### Rider questions
- Should I ride or drive?
- Will it rain?
- Be too windy?
- Too hot or cold?
- Is it safe?
- Am I confident in the weather, given my skills?
- Will I be OK at the beginning and end of the day?
- Start and end of the route?

### Rider wants
- I want an immediate yes or no
- I want to see some basic info too
- I want to dig into more details if needed

### User Story
As a new motorcycle rider, I want a quick yes or no if I should ride, so I can stay safe in the current weather, given my skill level, and not get caught in the rain.

### Default ride if algorithm
- precip < 25%
- current precip = no
- temp < 100
- temp > 40
- wind < 12
- gust < 20
- night = no

### Weather Underground examples
~~~~
http://api.wunderground.com/api/WUNDERGROUNDAPIKEY/geolookup/conditions/q/ZIPCODE.json
http://api.wunderground.com/api/WUNDERGROUNDAPIKEY/geolookup/forecast/q/ZIPCODE.json
http://api.wunderground.com/api/WUNDERGROUNDAPIKEY/geolookup/forecast10day/q/ZIPCODE.json
http://api.wunderground.com/api/WUNDERGROUNDAPIKEY/geolookup/hourly/q/ZIPCODE.json
~~~~

### Get a Weather Underground API Key here
http://api.wunderground.com/weather/api/d/pricing.html

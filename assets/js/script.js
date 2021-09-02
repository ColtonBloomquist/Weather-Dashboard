var cities = [];

//query  selectors for dom
var cityInputEl = document.querySelector("#city-input");

var dailyForecast = document.querySelector("#daily-forecast");
var weatherContainerEl = document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#searched-city");
var fiveDayForecastContainerEl = document.querySelector(
  "#five-day-forecast-container"
);
var savedCitiesButtonEl = document.querySelector("#saved-cities-button");

var addCity = document.querySelector(".add-city");

//get form submition and use to search/save
var formSubmitHandler = function (event) {
  event.preventDefault();
  var cityName = cityInputEl.value.trim();
  if (cityName) {
    getCityWeather(cityName);
    fiveDayForecast(cityName);
    cities.unshift({ cityName });
    //reset form input
    cityInputEl.value = "";
  } else {
    alert("Please enter a valid city name");
  }
  saveSearchedCities();
  saveSearch(cityName);
};

var getCityWeather = function (cityName) {
  var apiKey = "844421298d794574c100e3409cee0499";
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data, cityName);
    });
  });
};

var displayWeather = function (weather, searchCity) {
  //clear  previous search
  weatherContainerEl.textContent = "";
  citySearchInputEl.textContent = searchCity;
  citySearchInputEl.classList = "text-uppercase font-weight-bold";

  //find date and format

  var currentDate = document.createElement("span");
  currentDate.textContent =
    " (" + moment(weather.dt.value).format("MM/D/YYYY") + ")";
  currentDate.classList = "font-weight-bold";
  citySearchInputEl.appendChild(currentDate);

  //get weather icon
  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
  );
  citySearchInputEl.appendChild(weatherIcon);

  //get wind information
  var windEl = document.createElement("span");
  windEl.textContent = "Wind: " + weather.wind.speed + " MPH";
  windEl.classList = "list-group-item";

  //get temperature information
  var tempEl = document.createElement("span");
  tempEl.textContent = "Temp: " + weather.main.temp + " °F";
  tempEl.classList = "list-group-item";

  //get humidity information

  var humidityEl = document.createElement("span");
  humidityEl.classList = "list-group-item";
  humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";

  //append created elements to corrosponding container element

  weatherContainerEl.appendChild(tempEl);
  weatherContainerEl.appendChild(windEl);
  weatherContainerEl.appendChild(humidityEl);

  // calculate city based on lat and lon

  var lat = weather.coord.lat;
  var lon = weather.coord.lon;

  // call function for getting UV index

  pullUVI(lat, lon);
};

// function to find uvi

var pullUVI = function (lat, lon) {
  var apiKey = "844421298d794574c100e3409cee0499";
  var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
  //fetch uvi from apiurl

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayUVI(data);
    });
  });
};

// display the fetched uvi

var displayUVI = function (index) {
  var uviEl = document.createElement("div");
  uviEl.textContent = "UV Index: ";
  uviEl.classList = "list-group-item";

  uvi = document.createElement("span");
  uvi.textContent = index.value;

  //if statement to determine colors for uvi

  if (index.value < 3 || index.value === 3) {
    uvi.classList = "green";
  } else if (index.value > 3 && index.value < 7) {
    uvi.classList = "yellow";
  } else {
    uvi.classList = "red";
  }

  //append uvi index to div and to weather container el

  uviEl.appendChild(uvi);
  weatherContainerEl.appendChild(uviEl);
};

var saveSearchedCities = function () {
  //console.log(JSON.stringify(cities));
  localStorage.setItem("cities", JSON.stringify(cities));
};

var loadSearchedCities = function () {
  cities = JSON.parse(localStorage.getItem("cities"));
  console.log(cities);
  var citiesFiltered = cities.filter(function (value, index, self) {
    return (
      self.findIndex(function (m) {
        return m.cityName === value.cityName;
      }) === index
    );
  });
  console.log(citiesFiltered);
  citiesFiltered.forEach(function (city) {
    saveSearch(city.cityName);
  });
};

//get the full five day forecast

var fiveDayForecast = function (cityName) {
  var apiKey = "844421298d794574c100e3409cee0499";
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast/?q=${cityName}&units=imperial&appid=${apiKey}`;
  console.log(apiUrl);
  //fetch five day

  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayFiveDayForecast(data);
      //console.log(response);
    });
  });
};

//function to display five day forecast to page

var displayFiveDayForecast = function (weather) {
  //console.log(weather);
  //clear previous five day
  fiveDayForecastContainerEl.textContent = "";

  var forecast = weather.list;

  // for loop to go through weather information and display styled cards to page

  for (var i = 0; i < 40; i = i + 8) {
    var dailyForecast = forecast[i];

    var forecastEl = document.createElement("div");
    //give styles to card
    forecastEl.classList = "card gradient-custom2 text-light";

    //add date to forecast card

    var forecastDate = document.createElement("h4");
    forecastDate.textContent = moment
      .unix(dailyForecast.dt)
      .format("MMM D, YYYY");
    forecastDate.classList = "card-header text-center";
    forecastEl.appendChild(forecastDate);

    //get weather image and add to card
    var weatherIcon = document.createElement("img");
    weatherIcon.classList = "card-body";
    weatherIcon.setAttribute(
      "src",
      `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`
    );

    forecastEl.appendChild(weatherIcon);

    //get temp and add to card

    var forecastTempEl = document.createElement("span");
    forecastTempEl.classList = "card-body";
    forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
    console.log(dailyForecast);

    forecastEl.appendChild(forecastTempEl);

    //get humidity and add to card

    var forecastHumidityEl = document.createElement("span");
    forecastHumidityEl.classList = "card-body";
    forecastHumidityEl.textContent =
      "Humidity: " + dailyForecast.main.humidity + "  %";

    forecastEl.appendChild(forecastHumidityEl);

    //get windspeed and add to card

    var forecastWindSpeedEl = document.createElement("span");
    forecastWindSpeedEl.classList = "card-body";
    forecastWindSpeedEl.textContent =
      "Wind Speed: " + dailyForecast.wind.speed + "  MPH";

    forecastEl.appendChild(forecastWindSpeedEl);

    //append all to forecast container

    fiveDayForecastContainerEl.appendChild(forecastEl);
  }
};

var savedCities = [];

var saveSearch = function (saveSearch) {
  savedCitiesEl = document.createElement("button");
  savedCitiesEl.textContent = saveSearch;
  savedCitiesEl.classList = "d-flex w-100 gradient-custom2 border p-2";
  savedCitiesEl.setAttribute("searched-city", saveSearch);
  savedCitiesEl.setAttribute("type", "submit");

  savedCitiesButtonEl.prepend(savedCitiesEl);
};

var savedCitiesHandler = function (event) {
  var city = event.target.getAttribute("searched-city");
  console.log(city);
  if (city) {
    getCityWeather(city);
    fiveDayForecast(city);
  }
};

//event listeners for form

document
  .getElementById("add-city")
  .addEventListener("click", formSubmitHandler);

savedCitiesButtonEl.addEventListener("click", savedCitiesHandler);

loadSearchedCities();

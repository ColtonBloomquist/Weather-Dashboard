var cities [];
var cityInputEl = document.querySelector("#city-input")
var cityFormEl = document.querySelector("#city-search-form")


var getCityForecast = function(cityName) {
  var apiKey = "844421298d794574c100e3409cee0499"
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiUrl).then(function(response) {
    response.json().then(function(data) {
      displayForecast(data, cityName)
    })
  })

}

var displayWeather = function(weather, searchCity) {
  //clear  previous search
  weatherContainerEl.textContent = ""
  citySearchInputEl.textContent = searchCity
}



var saveSearchedCities = function() {
  localStorage.setItem("cities", JSON.stringify(cities))
}

var formSubmitHandler = function(event) {
  event.preventDefault()
  var cityName = cityInputEl.value.trim()
  if (cityName) {
    getCityWeather(cityName)
    get5day(cityName)
    cities.unshift({cityName})
    //reset form input
    cityInputEl.value = ""
  } else {
    alert("Please enter a valid city name")
  }
  saveSearch()
  searchedCity(cityName)
}


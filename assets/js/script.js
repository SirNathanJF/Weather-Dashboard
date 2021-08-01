let searchInput = $("#search-input");
let searchHistory = $("#search-history-list");
let myApiKey = "f6dbccad1096ef580392335246d5632e";
let currentCitySearch = "";

$("#search-button").on("click", function(event){
    event.preventDefault();
    currentCitySearch = searchInput.val();
    getLocation();
});
// This function will save searched city to local storage, capping at 10 searched cities
function saveSearch(city){
    const cityLocalHistory = JSON.parse(localStorage.getItem('history')) || [];
    addToHistory(city);
    cityLocalHistory.unshift(city);
    cityLocalHistory.splice(10);
    deleteFromHistory(cityLocalHistory);
    localStorage.setItem("history", JSON.stringify(cityLocalHistory));
};
// adds the searched city to the html in the form of a button, to be clicked later for faster weather retreival for user
function addToHistory(city) {
    const generateList = $("<li>")
    const generateBtn = $("<button>" + city + "</button>")

    generateBtn.addClass("btn history-btn");
    generateBtn.attr("data-city", city);
    generateBtn.appendTo(generateList);
    generateList.appendTo(searchHistory);
}
// This will remove the last item form the search history if list/local storage is over 10 items
function deleteFromHistory (citiesList){
    if (citiesList.length >= 10) {
        $("#search-history-list li:last-child").remove();
    }
};
// This function will display items from local storage on reload in the form of buttons
function displayHistory(saveSearch){
    saveSearch.forEach(element => {
        const generateList = $("<li>")
        const generateBtn = $("<button>" + element + "</button>")

        generateBtn.addClass("btn history-btn");
        generateBtn.attr("data-city", element);
        generateBtn.appendTo(generateList);
        generateList.appendTo(searchHistory);
    });
};

// This function contacts the Open Weather API for the latitude and longitude of the user's input
let getLocation = function (event){
    let currentCitySearch = searchInput.val();
    let urlQuery = "https://api.openweathermap.org/data/2.5/weather?q=" + currentCitySearch + "&units=imperial" + "&APPID=" + myApiKey;

    fetch(urlQuery).then(function (response){
        if(response.status === 404){
            return alert("Please enter a valid city!");
        } else{
            return response.json();
        }
    }).then(function (data) {
        if(data.status === 404){
            return alert("Please enter a valid city!");
        } else {
            saveSearch(currentCitySearch);
            let lat = data.coord.lat;
            let long = data.coord.lon;
            getCurrentWeather(lat, long, currentCitySearch);
            console.log(lat);
            console.log(long);
        };
    });
    $("#form-html").trigger("reset");
};
// This uses the previously fetched latitude and longitide to get the forecast from Open Weather
function getCurrentWeather(lat, long, city){
    let urlQuery = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial" + "&APPID=" + myApiKey;

    fetch(urlQuery).then(function (response){
        if (response.status === 404) {
            console.log('404 Error');
            return;
        } else {
            return response.json();
        }
    }).then(function (data){
        displayCurrentWeather(data.current, city);
        displayFiveDayWeather(data);
    });
};
// This function will display the weather for the selected city (current)
function displayCurrentWeather(data, city) {
    let weatherIcon = $("#weather-icon");

    let dateCode = new Date(data.dt * 1000);
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = months[dateCode.getMonth()];
    let date = dateCode.getDate();
    let year = dateCode.getFullYear();
    let currentDay = month + "/" + date +"/" + year;

    $("#current-city-name").text(city + " (" + currentDay + ")");

    let iconCode = data.weather[0].icon;
    let iconSource = "http://openweathermap.org/img/w/" + iconCode + ".png";
    weatherIcon.attr("src", iconSource);
    $('#current-temp').text('Temperate: ' + data.temp + ' °F');
    $('#current-wind').text('Wind: ' + data.wind_speed + ' MPH'); 
    $('#current-humidity').text('Humidity: ' + data.humidity + '%');
    $('#current-uvindex').text('UV Index: ' + data.uvi);
};



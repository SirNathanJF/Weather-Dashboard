let searchInput = $("#search-input");
let searchHistory = $("#search-history-list");
let myApiKey = "f6dbccad1096ef580392335246d5632e";
let currentCitySearch = "";

$("#search-button").on("click", function(event){
    event.preventDefault();
    currentCitySearch = searchInput.val();
    getLocation();
});
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

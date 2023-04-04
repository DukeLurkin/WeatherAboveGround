var userFormEl = document.querySelector('#user-form');
var search = document.querySelector('#search-button');
var limit = 1;
var APIKey = "ca459494e1c9217a3ccae23e08be5c5c";
var city = "";

// the API call: https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// 5 day link - api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
// direct geocode - use city name to get lat&long API link below \/\/\/\/
//  http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


function readCitiesFromStorage() {
    var cities = localStorage.getItem("alreadyThereCities");
    if (cities){
        cities = JSON.parse(cities);
    } else {
        cities = [];
    } return cities;
}

function saveCitiesToStorage(cities) {
    localStorage.setItem('alreadyThereCities', JSON.stringify(cities));
    console.log(cities);
    citySearchHistory.textContent = cities;
}

function populateList () {
    var citiesListed = readCitiesFromStorage();
    citiesListed.forEach((city) => {
        var citySearchHistory = document.createElement('button');
        citySearchHistory.textContent = city;
        citySearchHistory.classList.add('search-hx')
        searchedCities.append(citySearchHistory);
    })

    // var searchHistoryCollection = document.querySelector(".search-hx")
    var searchHistoryCollection = document.getElementsByClassName("search-hx");
    for (var i = 0; i < searchHistoryCollection.length; i++) {
        searchHistoryCollection[i].addEventListener('click', searchAgain);
    }

}

//** current weather ** humidity, temp, wind speed
var buttonClick = function (event) {
    if (!userFormEl.value) {
        return;
    }
    city = userFormEl.value;
    var cityList = readCitiesFromStorage();
    cityList.push(city);
    saveCitiesToStorage(cityList);
    populateList();
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    console.log(event);
    console.log(userFormEl.value);
    fetch(queryURL)
    .then(function (response){
        console.log(response);
        response.json().then(function (data){
            console.log(data);
            console.log(`humidity: ${data.main.humidity}`);
            console.log(`temp: ${data.main.temp}`);
            console.log(`wind speed: ${data.wind.speed}`);
            var currentWeatherText = `
            Current Weather in ${data.name}
            temp: ${data.main.temp}
            humidity: ${data.main.humidity}
            wind speed: ${data.wind.speed}
            `
            currentWeather.textContent = currentWeatherText;
            addIcon(data.weather[0].icon, currentWeather);
        })
    })
}
// ** getting lon&lat to apply to 5 day
var buttonClick2 = function (event){
    if (!userFormEl.value) {
        return;
    }
        city = userFormEl.value;
        var queryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1" + "&appid=" + APIKey;
        fetch(queryURL)
        .then(function (response){
            
        console.log(response);
        response.json().then(function (data){
            console.log(data);
            console.log(data[0].lat);
            console.log(data[0].lon);
            var lat = data[0].lat;
            var lon = data[0].lon;
            fiveDay(lat,lon);
            } )
        })
}
// ** five day forecast below
var fiveDay = function (lat,lon){
    var fiveDayURL = "https://api.openweathermap.org/data/2.5/forecast?" + "&lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
            fetch(fiveDayURL)
            .then(function (response){
                response.json().then(function (data){
                    console.log(data);
                    console.log(data.list[0].dt_txt);
                    var firstDayText = `
                    ${dayjs(data.list[0].dt_txt).format('MM/DD/YYYY')}
                    temp: ${data.list[0].main.temp}
                    humidity: ${data.list[0].main.humidity}
                    wind speed: ${data.list[0].wind.speed}
                    `
                    firstDay.textContent = firstDayText;
                    addIcon(data.list[0].weather[0].icon, firstDay);
                    
                    var secondDayText = `
                    ${dayjs(data.list[8].dt_txt).format('MM/DD/YYYY')}
                    temp: ${data.list[8].main.temp}
                    humidity: ${data.list[8].main.humidity}
                    wind speed: ${data.list[8].wind.speed}
                    `
                    secondDay.textContent = secondDayText;
                    addIcon(data.list[8].weather[0].icon, secondDay);

                    var thirdDayText = `
                    ${dayjs(data.list[16].dt_txt).format('MM/DD/YYYY')}
                    temp: ${data.list[16].main.temp}
                    humidity: ${data.list[16].main.humidity}
                    wind speed: ${data.list[16].wind.speed}
                    `
                    thirdDay.textContent = thirdDayText;
                    addIcon(data.list[16].weather[0].icon, thirdDay);

                    var fourthDayText = `
                    ${dayjs(data.list[24].dt_txt).format('MM/DD/YYYY')}
                    temp: ${data.list[24].main.temp}
                    humidity: ${data.list[24].main.humidity}
                    wind speed: ${data.list[24].wind.speed}
                    `
                    fourthDay.textContent = fourthDayText;
                    addIcon(data.list[24].weather[0].icon, fourthDay);

                    var fifthDayText = `
                    ${dayjs(data.list[32].dt_txt).format('MM/DD/YYYY')}
                    temp: ${data.list[32].main.temp}
                    humidity: ${data.list[32].main.humidity}
                    wind speed: ${data.list[32].wind.speed}
                    `
                    fifthDay.textContent = fifthDayText;
                    addIcon(data.list[32].weather[0].icon, fifthDay);

                })
            }
        )}



function searchAgain(event) {
    console.log('searchAgain');
    console.log(event);
    const searchBox = document.querySelector("#user-form")
    searchBox.value = event.target.firstChild.data;

    buttonClick();
    buttonClick2();
}

// ** creating new elements
var firstDay = document.createElement('p');
var secondDay = document.createElement('p');
var thirdDay = document.createElement('p');
var fourthDay = document.createElement('p');
var fifthDay = document.createElement('p');
var currentWeather = document.createElement('section');
var citySearchHistory = document.createElement('button');


var firstDayForecast = document.querySelector('#firstDayForecast');
var secondDayForecast = document.querySelector('#secondDayForecast');
var thirdDayForecast = document.querySelector('#thirdDayForecast');
var fourthDayForecast = document.querySelector('#fourthDayForecast');
var fifthDayForecast = document.querySelector('#fifthDayForecast');
var todaysWeather = document.querySelector('#currentWeather');
var searchedCities = document.querySelector('#citySearchHistory');

firstDayForecast.append(firstDay);
secondDayForecast.append(secondDay);
thirdDayForecast.append(thirdDay);
fourthDayForecast.append(fourthDay);
fifthDayForecast.append(fifthDay);
todaysWeather.append(currentWeather);
// searchedCities.append(citySearchHistory);



function addIcon (iconName, element) {
    var imgEl = document.createElement('img')
    var imgSrc = "https://openweathermap.org/img/wn/" + iconName + "@2x.png"
    imgEl.setAttribute('src', imgSrc);
    element.append(imgEl);
}

search.addEventListener('click', buttonClick);
search.addEventListener('click', buttonClick2);


//** 5 day forecast
// var buttonClick = function (event) {
//     city = userFormEl.value;
//     var queryURL = "api.openweathermap.org/data/2.5/forecast?" + "&lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;
//     console.log(event);
// }

// get humidity from data^ and post it to article

// **These things here:: weather conditions, the temperature, the humidity, and the wind speed

//? blue is for QUESHIONS

// TODO AORABGE
//! AHHHHAHHHHHHHHHHHHHHHHHHHHHH

// var getUserRepos = function (user) {
//     var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  
//     fetch(queryUrl)
//       .then(function (response) {
//         if (response.ok) {
//           console.log(response);
//           response.json().then(function (data) {
//             console.log(data);
//             displayRepos(data, user);
//           });
//         } else {
//           alert('Error: ' + response.statusText);
//         }
//       })
//       .catch(function (error) {
//         alert('Unable to connect to GitHub');
//       });
//   };
  

// Use the [5 Day Weather Forecast]
// (https://openweathermap.org/forecast5) to retrieve weather data for cities. 
// The base URL should look like the following: 
// `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}`.

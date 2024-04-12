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
    var lastFiveCities = cities.slice(-5);
    localStorage.setItem('alreadyThereCities', JSON.stringify(lastFiveCities));
    console.log(lastFiveCities);
    citySearchHistory.textContent = lastFiveCities;
}

function populateList () {
    var citiesListed = readCitiesFromStorage();
    citiesListed.forEach((city) => {
        var citySearchHistory = document.createElement('button');
        citySearchHistory.textContent = city;
        citySearchHistory.classList.add('search-hx')
        // citySearchHistory.classList.add('list-group-item')
        citySearchHistory.classList.add('list-group-item-action')
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
        response.json()
        .then(function (data){
            console.log(data);
            console.log(`humidity: ${data.main.humidity}`);
            var tempFahrenheit = (data.main.temp - 273.15)*1.8+32;
            tempFahrenheit = tempFahrenheit.toFixed(1);
            console.log(`temp: ${tempFahrenheit}`);
            console.log(`wind speed: ${data.wind.speed}`);
            var currentWeatherText = `
            Current Weather in ${data.name}
            temp: ${tempFahrenheit}
            humidity: ${data.main.humidity}
            wind speed: ${data.wind.speed} mph
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
                    for (var i = 0; i < 5; i++) {
                        var dayData = data.list[i * 8]; // Data for every 8th element (for every day)
                        var tempFahrenheit = ((dayData.main.temp - 273.15) * 1.8 + 32).toFixed(1);
                        var dayText = `
                            ${dayjs(dayData.dt_txt).format('MM/DD/YYYY')}
                            temp: ${tempFahrenheit}°F
                            humidity: ${dayData.main.humidity}%
                            wind speed: ${dayData.wind.speed} mph
                        `;
                        switch (i) {
                            case 0:
                                firstDay.textContent = dayText;
                                addIcon(dayData.weather[0].icon, firstDay);
                                break;
                            case 1:
                                secondDay.textContent = dayText;
                                addIcon(dayData.weather[0].icon, secondDay);
                                break;
                            case 2:
                                thirdDay.textContent = dayText;
                                addIcon(dayData.weather[0].icon, thirdDay);
                                break;
                            case 3:
                                fourthDay.textContent = dayText;
                                addIcon(dayData.weather[0].icon, fourthDay);
                                break;
                            case 4:
                                fifthDay.textContent = dayText;
                                addIcon(dayData.weather[0].icon, fifthDay);
                                break;
                        }
                    }
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

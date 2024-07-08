let cityInput = document.getElementById('city_input');
let searchBtn = document.getElementById('searchBtn');
let locationBtn = document.getElementById('locationBtn');
let api_key = '5fc727a9c0487f00eee2fa64469a8e9c'; 
let currentWeatherCard = document.querySelector('.weather-left .card'); 
let fiveDaysForecastCard = document.querySelector('.day-forecast');
let aqiCard = document.querySelectorAll('.highlights .card')[0];
let sunriseCard = document.querySelectorAll('.highlights .card')[1];
let humidityVal = document.getElementById('humidityVal');
let pressureVal = document.getElementById('pressureVal');
let visibilityVal = document.getElementById('visibilityVal');
let windSpeedVal = document.getElementById('windSpeedVal');
let feelsVal = document.getElementById('feelsVal');
let hourlyForecastCard = document.querySelector('.hourly-forecast');
let aqiList = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];

function getWeatherDetails(name, lat, lon, country) {
    let WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`;
    let AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`;

    // Fetch Air Quality Index
    fetch(AIR_POLLUTION_API_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch Air Quality Index');
            }
            return res.json();
        })
        .then(data => {
            console.log('AQI Data:', data); // Log the AQI data to see the structure

            let { co, no, no2, o3, so2, pm2_5, pm10, nh3 } = data.list[0].components;
            let aqi = data.list[0].main.aqi;

            aqiCard.innerHTML = `                        
                <div class="card-head">
                    <p>Air Quality Index</p>
                    <p class="air-index aqi-${aqi}">${aqiList[aqi - 1]}</p>
                </div>
                <div class="air-indices">
                    <i class="fas fa-wind fa-3x"></i>
                    <div class="item">
                        <p>PM2.5</p>
                        <h2>${pm2_5}</h2>
                    </div>
                    <div class="item">
                        <p>PM10</p>
                        <h2>${pm10}</h2>
                    </div>
                    <div class="item">
                        <p>SO2</p>
                        <h2>${so2}</h2>
                    </div>
                    <div class="item">
                        <p>CO</p>
                        <h2>${co}</h2>
                    </div>
                    <div class="item">
                        <p>NO</p>
                        <h2>${no}</h2>
                    </div>
                    <div class="item">
                        <p>NO2</p>
                        <h2>${no2}</h2>
                    </div>
                    <div class="item">
                        <p>NH3</p>
                        <h2>${nh3}</h2>
                    </div>
                    <div class="item">
                        <p>O3</p>
                        <h2>${o3}</h2>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error fetching Air Quality Index:', error);
            alert('Failed to fetch Air Quality Index');
        });

    // Fetch current weather
    fetch(WEATHER_API_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to fetch current weather');
            }
            return res.json();
        })
        .then(data => {
            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <p>Now</p>
                        <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="card-footer">
                    <p><i class="far fa-calendar"></i> ${date.toDateString()}</p>
                    <p><i class="fas fa-location-dot"></i> ${name}, ${country}</p>
                </div>
            `;

            let { sunrise, sunset, timezone } = data.sys;
            let { visibility } = data;
            let { humidity, pressure, feels_like } = data.main;
            let { speed } = data.wind;

            let sRiseTime = moment.unix(sunrise).format('hh:mm A');
            let sSetTime = moment.unix(sunset).format('hh:mm A');

            sunriseCard.innerHTML = `
                <div class="card-head">
                    <p>Sunrise & Sunset</p>
                </div>
                <div class="sunrise-sunset">
                    <div class="item">
                        <div class="icon">
                            <i class="fas fa-sun fa-4x"></i>
                        </div>
                        <div>
                            <p>Sunrise</p>
                            <h2>${sRiseTime}</h2>
                        </div>
                    </div>
                    <div class="item">
                        <div class="icon">
                            <i class="fa-regular fa-sun fa-4x"></i>
                        </div>
                        <div>
                            <p>Sunset</p>
                            <h2>${sSetTime}</h2>
                        </div>
                    </div>
                </div>
            `;

            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure}hPa`;
            visibilityVal.innerHTML = `${(visibility / 1000).toFixed(1)}km`;
            windSpeedVal.innerHTML = `${speed}m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;C`;
        })
        .catch(error => {
            console.error('Error fetching current weather:', error);
            alert('Failed to fetch current weather');
        });

    // Fetch 5-day forecast
    fetch(FORECAST_API_URL)
        .then(res => res.json())
        .then(data => {
            let hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = ``;
            for (i = 0; i <= 7; i++) {
                let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hr = hrForecastDate.getHours();
                let a = 'PM';
                if (hr < 12) a = 'AM';
                if (hr == 0) hr = 12;
                if (hr > 12) hr -= 12;
                hourlyForecastCard.innerHTML += `
                    <div class="card">
                        <p>${hr} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                        <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;C</p>
                    </div>
                `;
            }
            let uniqueForecastDays = [];
            let forecastData = data.list.filter(forecast => {
                let forecastDate = new Date(forecast.dt_txt).getDate();
                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            fiveDaysForecastCard.innerHTML = '';
            for (let i = 1; i < forecastData.length; i++) {
                let date = new Date(forecastData[i].dt_txt);
                fiveDaysForecastCard.innerHTML += `
                    <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}.png" alt="">
                            <span>${(forecastData[i].main.temp - 273.15).toFixed(2)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(error => {
            console.error('Error fetching weather forecast', error);
            alert('Failed to fetch weather forecast');
        });
}

function getCityCoordinates() {
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if (!cityName) return;

    let GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;

    // Fetch city coordinates
    fetch(GEOCODING_API_URL)
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to fetch coordinates for ${cityName}`);
            }
            return res.json();
        })
        .then(data => {
            if (data.length === 0) {
                throw new Error(`No coordinates found for ${cityName}`);
            }
            let { name, lat, lon, country } = data[0];
            getWeatherDetails(name, lat, lon, country);
        })
        .catch(error => {
            console.error('Error fetching coordinates:', error);
            alert(`Failed to fetch coordinates for ${cityName}`);
        });
}

function getUserCoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}`;

        fetch(REVERSE_GEOCODING_URL)
            .then(res => res.json())
            .then(data => {
                let {name, country, state} = data[0];
                getWeatherDetails(name, latitude, longitude, country, state);
            })
            .catch(error => {
                console.error('Error fetching user coordinates:', error);
                alert('Failed to fetch user coordinates');
            });
    }, error => {
        if (error.code === error.PERMISSION_DENIED) {
            alert('Geolocation access denied. Please reset location permission to grant access again');
        }
    });
}

searchBtn.addEventListener('click', getCityCoordinates);
locationBtn.addEventListener('click', getUserCoordinates);
cityInput.addEventListener('keyup', e => e.key === 'Enter' && getCityCoordinates());
window.addEventListener('load', getUserCoordinates);

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

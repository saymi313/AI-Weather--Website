const apiKey = 'a146fed91ec30285356b727651da6a57';
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const weatherData = document.getElementById('weatherData');
const filterOptions = document.getElementById('filterOptions');
const currentFilters = document.getElementById('currentFilters');
const cardsContainer = document.getElementById('cardsContainer');
const pagination = document.getElementById('pagination');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const loader = document.getElementById('loader');
let forecastData = [];
let currentPage = 1;
const entriesPerPage = 10;

async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        throw new Error('City not found');
    }
    const data = await response.json();
    return data;
}

async function fetchForecast(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        throw new Error('Forecast not found');
    }
    const data = await response.json();
    return data;
}

async function displayWeather(city) {
    loader.style.display = 'block';
    try {
        const weather = await fetchWeather(city);
        const forecast = await fetchForecast(weather.coord.lat, weather.coord.lon);
        weatherData.innerHTML = `<h2>Weather Data for ${city}</h2>`;
        const weatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
        const currentWeatherHTML = `
            <div class="current-weather">
                <img src="${weatherIcon}" alt="Weather Icon" class="weather-icon">
                <p>Temperature: ${weather.main.temp}°C</p>
                <p>Condition: ${weather.weather[0].description}</p>
                <p>Humidity: ${weather.main.humidity}%</p>
                <p>Wind Speed: ${weather.wind.speed} m/s</p>
            </div>
        `;
        weatherData.innerHTML += currentWeatherHTML;
        forecastData = forecast.list;
        filterOptions.style.display = 'block';
        createForecastCards();
        createCharts(forecastData);
    } catch (error) {
        weatherData.innerHTML = `<p class="error">Error: City "${city}" not found. Please try again.</p>`;
    } finally {
        loader.style.display = 'none';
    }
}


function createForecastCards() {
    cardsContainer.innerHTML = '';
    currentFilters.innerHTML = '';
    const selectedValue = filterOptions.value;
    let filterText = '';
    switch (selectedValue) {
        case 'asc':
            filterText = 'Sorted by Temperature: Ascending';
            break;
        case 'desc':
            filterText = 'Sorted by Temperature: Descending';
            break;
        case 'rainy':
            filterText = 'Showing: Rainy Days';
            break;
    }
    currentFilters.innerHTML = `<p>${filterText}</p>`;
    const start = (currentPage - 1) * entriesPerPage;
    const end = Math.min(start + entriesPerPage, forecastData.length);
    for (let i = start; i < end; i++) {
        const item = forecastData[i];
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <h3>${new Date(item.dt * 1000).toLocaleDateString()}</h3>
            <p>Temperature: ${item.main.temp}°C</p>
            <p>${item.weather[0].description}</p>
        `;
        cardsContainer.appendChild(forecastCard);
    }
    prevPageBtn.style.display = currentPage === 1 ? 'none' : 'block';
    nextPageBtn.style.display = currentPage * entriesPerPage >= forecastData.length ? 'none' : 'block';
}

async function createCharts(data) {
    const labels = data.map(item => new Date(item.dt * 1000).toLocaleDateString());
    const temps = data.map(item => item.main.temp);
    const rainCounts = data.map(item => item.rain ? item.rain['1h'] : 0);
    const verticalCtx = document.getElementById('verticalChart').getContext('2d');
    new Chart(verticalCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                backgroundColor: 'rgba(52, 152, 219, 0.5)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 1,
                animation: {
                    delay: (context) => {
                        if (context.type === 'data' && context.mode === 'default') {
                            return context.dataIndex * 200;
                        }
                        return 0;
                    }
                }
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    const rainyDaysCount = data.filter(item => item.rain).length;
    const nonRainyDaysCount = data.length - rainyDaysCount;
    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
            labels: ['Rainy Days', 'Non-Rainy Days'],
            datasets: [{
                label: 'Rainy Days',
                data: [rainyDaysCount, nonRainyDaysCount],
                backgroundColor: ['rgba(231, 76, 60, 0.5)', 'rgba(46, 204, 113, 0.5)'],
                borderColor: ['rgba(231, 76, 60, 1)', 'rgba(46, 204, 113, 1)'],
                borderWidth: 1,
                animation: {
                    delay: (context) => {
                        if (context.type === 'data' && context.mode === 'default') {
                            return context.dataIndex * 200;
                        }
                        return 0;
                    }
                }
            }]
        }
    });
    const lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                fill: false,
                borderColor: 'rgba(52, 152, 219, 1)',
                tension: 0.1,
                animation: {
                    onComplete: function() {
                        this.chartInstance.update();
                    }
                }
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        displayWeather(city);
    }
});

filterOptions.addEventListener('change', () => {
    const selectedValue = filterOptions.value;
    switch (selectedValue) {
        case 'asc':
            forecastData.sort((a, b) => a.main.temp - b.main.temp);
            break;
        case 'desc':
            forecastData.sort((a, b) => b.main.temp - a.main.temp);
            break;
        case 'rainy':
            forecastData = forecastData.filter(item => item.rain);
            break;
    }
    currentPage = 1;
    createForecastCards();
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        createForecastCards();
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage * entriesPerPage < forecastData.length) {
        currentPage++;
        createForecastCards();
    }
});

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const weather = await fetchWeatherByCoords(lat, lon);
            displayWeather(weather.name);
        }, (error) => {
            console.error('Error getting location', error);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!response.ok) {
        throw new Error('Unable to fetch weather data');
    }
    return await response.json();
}

function setupLocationButton() {
    const locationButton = document.createElement('button');
    locationButton.textContent = "Current Location";
    locationButton.classList.add('location');
    locationButton.onclick = getLocation;
    document.querySelector('.search-loc').appendChild(locationButton);
}

setupLocationButton();

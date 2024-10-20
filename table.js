const apiKey = 'a146fed91ec30285356b727651da6a57';
let forecastData = [];
let currentPage = 1;
const entriesPerPage = 10;

async function fetchWeatherData(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        forecastData = [];
        data.list.forEach(entry => {
            const date = new Date(entry.dt * 1000);
            const formattedDate = date.toLocaleDateString();
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            forecastData.push({
                date: formattedDate,
                time,
                temperature: entry.main.temp,
                condition: entry.weather[0].description,
            });
        });
        displayForecast();
    } catch (error) {
        alert(error.message);
    }
}

function displayForecast() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, forecastData.length);
    const paginatedData = forecastData.slice(startIndex, endIndex);
    paginatedData.forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date} ${entry.time}</td>
            <td>${entry.temperature.toFixed(1)} °C</td>
            <td>${entry.condition}</td>
        `;
        tableBody.appendChild(row);
    });
    updatePagination(startIndex, endIndex);
}

function updatePagination(startIndex, endIndex) {
    const pagination = document.getElementById('pagination');
    pagination.style.display = forecastData.length > entriesPerPage ? 'flex' : 'none';
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = endIndex >= forecastData.length;

    document.getElementById('prevPage').onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayForecast();
        }
    };

    document.getElementById('nextPage').onclick = () => {
        if (endIndex < forecastData.length) {
            currentPage++;
            displayForecast();
        }
    };
}

document.getElementById('searchBtn').onclick = () => {
    const cityInput = document.getElementById('cityInput').value.trim();
    if (cityInput) {
        fetchWeatherData(cityInput);
        currentPage = 1;
    } else {
        alert("Please enter a city name.");
    }
};

document.getElementById('filterOptions').onchange = function() {
    const filterValue = this.value;
    if (filterValue === 'asc') {
        forecastData.sort((a, b) => a.temperature - b.temperature);
    } else if (filterValue === 'desc') {
        forecastData.sort((a, b) => b.temperature - a.temperature);
    } else if (filterValue === 'rainy') {
        forecastData = forecastData.filter(entry => entry.condition.includes('rain'));
    } else {
        return;
    }
    currentPage = 1;
    displayForecast();
};

async function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const weather = await fetchWeatherByCoords(lat, lon);
                fetchWeatherData(weather.name);
            },
            (error) => {
                console.error('Error getting location', error);
                alert('Unable to retrieve your location. Please enable location services or enter a city name manually.');
            }
        );
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

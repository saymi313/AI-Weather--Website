import { GoogleGenerativeAI } from "@google/generative-ai";

const googleApiKey = "AIzaSyDmNDWYrnyq-WkkuZy6F2BikUZqzxGY4A4";
const genAI = new GoogleGenerativeAI(googleApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const apiKey = 'a146fed91ec30285356b727651da6a57';

const userInput = document.getElementById("userInput");
const sendMessageButton = document.getElementById("sendMessage");
const chatbotMessages = document.getElementById("chatbotMessages");

sendMessageButton.addEventListener("click", async () => {
    const message = userInput.value.trim();

    if (!isValidInput(message)) {
        displayMessage("Bot: Error: Please enter a valid message.", "bot");
        userInput.value = "";
        return;
    }

    displayMessage("User: " + message, "user");

    if (message.toLowerCase().includes("weather")) {
        await handleWeatherRequest(message);
    } else {
        const aiResponse = await generateAIResponse(message);
        displayMessage(`Bot: ${aiResponse}`, "bot");
    }
    userInput.value = "";
});

async function handleWeatherRequest(message) {
    if (message.toLowerCase().includes("forecast")) {
        const city = extractCityForForecast(message);
        if (city) {
            const forecastResponse = await fetchWeatherForecast(city);
            if (forecastResponse) {
                displayWeatherForecast(forecastResponse, city);
            } else {
                displayMessage(`Bot: Error: Could not retrieve weather information for forecast for ${city}.`, "bot");
            }
        } else {
            displayMessage("Bot: Error: Please specify a valid city for the forecast.", "bot");
        }
    } else {
        if (message.toLowerCase().includes("current location")) {
            getCurrentLocation();
        } else {
            const city = extractCity(message);
            if (city) {
                const weatherResponse = await fetchWeather(city);
                if (weatherResponse) {
                    displayMessage(`Bot: The weather in ${city} is ${weatherResponse.weather[0].description} with a temperature of ${weatherResponse.main.temp}°C.`, "bot");
                } else {
                    displayMessage(`Bot: Error: Could not retrieve weather information for ${city}.`, "bot");
                }
            } else {
                displayMessage("Bot: Error: Please specify a valid city.", "bot");
            }
        }
    }
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        displayMessage("Bot: Error: Geolocation is not supported by this browser.", "bot");
    }

    function successCallback(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        displayMessage(`Bot: Fetching weather for coordinates: ${latitude}, ${longitude}`, "bot");
        fetchWeatherByCoordinates(latitude, longitude);
    }

    function errorCallback(error) {
        console.error("Error retrieving location:", error);
        displayMessage("Bot: Error: Unable to retrieve your location.", "bot");
    }
}

async function fetchWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

async function fetchWeatherForecast(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather forecast:", error);
        return null;
    }
}

async function fetchWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching weather data by coordinates:", error);
        return null;
    }
}

function extractCity(message) {
    const cityPattern = /weather in ([\w\s]+)/i;
    const match = message.match(cityPattern);
    return match ? match[1].trim() : null;
}

function extractCityForForecast(message) {
    const forecastPattern = /forecast for ([\w\s]+)/i;
    const match = message.match(forecastPattern);
    return match ? match[1].trim() : null;
}

function displayWeatherForecast(forecastResponse, city) {
    const forecasts = forecastResponse.list.slice(0, 5);
    let forecastMessage = `Bot: The 5-day weather forecast for ${city} is:\n`;
    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString();
        const description = forecast.weather[0].description;
        const temp = forecast.main.temp;
        forecastMessage += `Date: ${date} - Weather: ${description} - Temp: ${temp}°C\n`;
    });
    displayMessage(forecastMessage, "bot");
}

function displayMessage(text, sender = "bot") {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = text;

    if (sender === "user") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("bot-message");
    }

    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function isValidInput(input) {
    return input && input.trim().length > 0;
}

async function generateAIResponse(userMessage) {
    try {
        const response = await model.generateResponse(userMessage);
        return response.text || "I'm not sure how to respond to that.";
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "Sorry, I couldn't generate a response.";
    }
}

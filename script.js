const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "eb4e50762fmsh7b79f1c03049134p152295jsndfe4e81d0998",
    "X-RapidAPI-Host": "weather-by-api-ninjas.p.rapidapi.com",
  },
};

const getWeather = async (city) => {
  cityName.innerHTML = city;

  try {
    // Step 1: Get coordinates for the city
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found!");
      return;
    }

    const { latitude, longitude, timezone } = geoData.results[0];

    // Step 2: Fetch weather data
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,cloud_cover&daily=temperature_2m_min,temperature_2m_max,sunrise,sunset&timezone=${timezone}`
    );
    const weatherData = await weatherRes.json();

    const current = weatherData.current;
    const daily = weatherData.daily;

    // Update UI
    temp.innerHTML = current.temperature_2m;
    temp2.innerHTML = current.temperature_2m;
    feels_like.innerHTML = current.apparent_temperature;
    humidity.innerHTML = current.relative_humidity_2m;
    humidity2.innerHTML = current.relative_humidity_2m;
    min_temp.innerHTML = daily.temperature_2m_min[0];
    max_temp.innerHTML = daily.temperature_2m_max[0];
    wind_speed.innerHTML = current.wind_speed_10m;
    wind_speed2.innerHTML = current.wind_speed_10m;
    wind_degrees.innerHTML = current.wind_direction_10m;
    cloud_pct.innerHTML = current.cloud_cover;
    sunrise.innerHTML = new Date(daily.sunrise[0]).toLocaleTimeString();
    sunset.innerHTML = new Date(daily.sunset[0]).toLocaleTimeString();
  } catch (err) {
    console.error(err);
    alert("Failed to fetch weather data.");
  }
};

// Common function to handle city input from any source
const handleSearch = (inputId) => {
  const input = document.getElementById(inputId);
  const cityValue = input.value.trim();
  if (cityValue) {
    getWeather(cityValue);
    localStorage.setItem("city", cityValue); // Save for reload
  }
};

// Event listeners for both buttons
document.getElementById("submit").addEventListener("click", (e) => {
  e.preventDefault();
  handleSearch("city");
});

document.getElementById("submit-desktop").addEventListener("click", (e) => {
  e.preventDefault();
  handleSearch("city-desktop");
});

// Load last city or default on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedCity = localStorage.getItem("city");
  getWeather(savedCity || "Ranchi");
});

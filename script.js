async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "4f333384ced6e885f191fb0b4e276e0f";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const result = `
        <p><strong>${data.name}</strong></p>
        <p>${data.weather[0].main} - ${data.weather[0].description}</p>
        <p>Temperature: ${data.main.temp}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
      `;
      document.getElementById("weatherResult").innerHTML = result;
    } else {
      document.getElementById("weatherResult").innerText = "City not found.";
    }
  } catch (error) {
    document.getElementById("weatherResult").innerText = "Error retrieving data.";
  }
}

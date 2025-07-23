
    async function getWeather() {
      const apiKey = 'YOUR_API_KEY_HERE';
      const city = document.getElementById('cityInput').value;
      if (!city) return alert("Please enter a city name");

      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("City not found");
        const data = await response.json();
        const html = `
          <h2>${data.name}, ${data.sys.country}</h2>
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
          <div class="temperature">${Math.round(data.main.temp)}°C</div>
          <div class="details">
            <p>${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind: ${data.wind.speed} m/s</p>
          </div>
        `;
        document.getElementById('weatherResult').innerHTML = html;
      } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p style="color:red">${error.message}</p>`;
      }
    }
    const apiKey = 'YOUR_API_KEY_HERE';

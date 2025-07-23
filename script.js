
    const apiKey = 'YOUR_API_KEY';
    const weatherDisplay = document.getElementById('weatherDisplay');
    const cityInput = document.getElementById('cityInput');
    const searchBtn = document.getElementById('searchBtn');
    const locationBtn = document.getElementById('locationBtn');
    const errorEl = document.getElementById('error');
    const loadingEl = document.getElementById('loading');

    const fetchWeather = async (city) => {
      try {
        errorEl.classList.add('hidden');
        loadingEl.classList.remove('hidden');

        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();

        if (data.cod !== 200) throw new Error(data.message);

        displayCurrentWeather(data);
        fetchForecast(data.coord.lat, data.coord.lon);
      } catch (err) {
        showError(err.message);
      } finally {
        loadingEl.classList.add('hidden');
      }
    };

    const fetchForecast = async (lat, lon) => {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
      const data = await res.json();
      displayForecast(data);
    };

    const displayCurrentWeather = (data) => {
      document.getElementById('cityName').textContent = data.name;
      document.getElementById('weatherDescription').textContent = data.weather[0].description;
      document.getElementById('weatherIcon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      document.getElementById('temperature').textContent = Math.round(data.main.temp);
      weatherDisplay.classList.remove('hidden');
    };

    const displayForecast = (data) => {
      const forecastContainer = document.getElementById('forecastContainer');
      forecastContainer.innerHTML = '';

      const days = {};

      data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!days[date]) {
          days[date] = item;
        }
      });

      Object.keys(days).slice(0, 5).forEach(date => {
        const item = days[date];
        const div = document.createElement('div');
        div.className = 'forecast-day';
        div.innerHTML = `
          <strong>${new Date(item.dt_txt).toLocaleDateString()}</strong>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" />
          <p>${Math.round(item.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(div);
      });
    };

    const showError = (msg) => {
      errorEl.textContent = msg;
      errorEl.classList.remove('hidden');
    };

    searchBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) fetchWeather(city);
    });

    locationBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
          const data = await res.json();
          displayCurrentWeather(data);
          fetchForecast(latitude, longitude);
        });
      } else {
        showError('Geolocation not supported.');
      }
    });

    document.getElementById('toggleUnit').addEventListener('click', () => {
      const unitEl = document.getElementById('unit');
      const tempEl = document.getElementById('temperature');
      const isCelsius = unitEl.textContent === 'C';
      let temp = parseFloat(tempEl.textContent);
      if (isCelsius) {
        temp = temp * 9/5 + 32;
        unitEl.textContent = 'F';
      } else {
        temp = (temp - 32) * 5/9;
        unitEl.textContent = 'C';
      }
      tempEl.textContent = Math.round(temp);
    });

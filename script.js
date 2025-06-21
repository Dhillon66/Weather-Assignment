var isCelsius = true;
var forecast = [];

function getIcon(code) {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "☁️";
  if ([61, 63, 80].includes(code)) return "🌧️";
  if ([71, 73].includes(code)) return "🌨️";
  if ([95, 96].includes(code)) return "⛈️";
  return "❓";
}

function showDay(index) {
  var day = forecast[index];
  var tempHigh = isCelsius ? day.max_c : day.max_f;
  var tempLow = isCelsius ? day.min_c : day.min_f;
  var unit = isCelsius ? "°C" : "°F";
  var icon = getIcon(day.code);

  var main = document.getElementById("main-card");
  main.innerHTML = "<h2>" + day.date + "</h2>" +
                   "<div class='icon'>" + icon + "</div>" +
                   "<p>High: " + tempHigh + unit + "</p>"+"<p> Low: " + tempLow + unit + "</p>";
}

function toggleUnit() {
  isCelsius = !isCelsius;
  document.getElementById("toggleBtn").innerText = isCelsius ? "Switch to °F" : "Switch to °C";
  showDay(0);
  updateSmallCards();
}

function loadForecast() {
  var url = "https://api.open-meteo.com/v1/forecast?latitude=51.0447&longitude=-114.0719&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America/Edmonton";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      for (var i = 0; i < 7; i++) {
        forecast.push({
          date: data.daily.time[i],
          code: data.daily.weathercode[i],
          max_c: data.daily.temperature_2m_max[i],
          min_c: data.daily.temperature_2m_min[i],
          max_f: (data.daily.temperature_2m_max[i] * 9 / 5 + 32).toFixed(1),
          min_f: (data.daily.temperature_2m_min[i] * 9 / 5 + 32).toFixed(1)
        });
      }
      updateSmallCards();
      showDay(0);
    });
}

loadForecast();

function updateSmallCards() {
  for (var i = 0; i < 7; i++) {
    var day = forecast[i];
    var icon = getIcon(day.code);
    var tempHigh = isCelsius ? day.max_c : day.max_f;
    var tempLow = isCelsius ? day.min_c : day.min_f;
    var unit = isCelsius ? "°C" : "°F";

    var label = document.getElementById("card" + i);
    label.innerHTML =
      `<p>${day.date}</p>
       <div class="icon">${icon}</div>
       <p>${tempHigh}${unit} / ${tempLow}${unit}</p>`;
  }
}

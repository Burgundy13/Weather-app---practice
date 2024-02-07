let cityInput = document.querySelector('.city');
let day = document.querySelector('.day');
let dateYear = document.querySelector('.date');
let time = document.querySelector('.time');
let temperature = document.querySelector('.temperature');
let maxTemp = document.querySelector('.max__temp');
let minTemp = document.querySelector('.min__temp');
let windSpeed = document.querySelector('.windspeed');
let humidity = document.querySelector('.humidity');
let pressure = document.querySelector('.pressure');
let sunriseTime = document.querySelector('.sunrise__time');
let sunsetTime = document.querySelector('.sunset__time');
let weatherStatus = document.querySelector('.weather__status');
let image = document.querySelector('.image');

cityInput.addEventListener('keyup', showWeather);

function showWeather(e) {
	if (e.keyCode === 13) {
		let city = cityInput.value;
		let xml = new XMLHttpRequest();
		xml.open(
			'GET',
			`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=65a961bc1bf6f42654bc807569689f24&units=metric`
		);

		xml.onreadystatechange = function () {
			if (xml.readyState === 4 && xml.status === 200) {
				let response = JSON.parse(xml.responseText);
				displayResult(response);
			}
		};
		xml.send();
	}
}

function displayResult(data) {
	let date = new Date();
	let localTime = date.getTime();
	let localOffset = date.getTimezoneOffset() * 60000;
	let utc = localTime + localOffset;

	let utcTime = utc + 1000 * data.timezone;
	let newCity = new Date(utcTime);

	let cityHour = newCity.getHours();
	let cityMinute = newCity.getMinutes();

	let mSunrise = new Date(data.sys.sunrise * 1000).getMinutes();
	let mSunset = new Date(data.sys.sunset * 1000).getMinutes();
	let hSunrise = new Date(data.sys.sunrise * 1000).getHours();
	let hSunset = new Date(data.sys.sunset * 1000).getHours();

	hSunrise < 10 ? (hSunrise = `0${hSunrise}`) : (hSunrise = hSunrise);
	mSunrise < 10 ? (mSunrise = `0${mSunrise}`) : (mSunrise = mSunrise);
	hSunset < 10 ? (hSunset = `0${hSunset}`) : (hSunset = hSunset);
	mSunset < 10 ? (mSunset = `0${mSunset}`) : (mSunset = mSunset);

	cityHour < 10 ? (cityHour = `0${cityHour}`) : (cityHour = cityHour);
	cityMinute < 10 ? (cityMinute = `0${cityMinute}`) : (cityMinute = cityMinute);

	temperature.innerHTML = `${Math.round(data.main.temp)} &deg; C`;
	maxTemp.innerHTML = `Max : ${Math.round(data.main.temp_max)} &deg; C`;
	minTemp.innerHTML = `Min : ${Math.round(data.main.temp_min)} &deg; C`;

	windSpeed.innerHTML = `${data.wind.speed} km/h`;
	humidity.innerHTML = `${data.main.humidity} %`;
	pressure.innerHTML = `${data.main.pressure} hPa`;
	sunriseTime.innerHTML = `${hSunrise}:${mSunrise} h`;
	sunsetTime.innerHTML = `${hSunset}:${mSunset} h`;

	let currentStatus = data.weather[0].description;
	weatherStatus.innerHTML = `Weather Status: ${currentStatus}`;

	if (currentStatus.includes('clear sky')) {
		image.setAttribute('src', 'images/clear_sky.png');
	} else if (currentStatus.includes('clouds')) {
		image.setAttribute('src', 'images/clouds.png');
	} else if (
		currentStatus.includes('rain') ||
		currentStatus.includes('drizzle')
	) {
		image.setAttribute('src', 'images/rain.png');
	} else if (currentStatus.includes('thunderstorm')) {
		image.setAttribute('src', 'images/thunderstorm.png');
	} else if (
		currentStatus.includes('snow') ||
		currentStatus.includes('sleet')
	) {
		image.setAttribute('src', 'images/snow.png');
	} else if (currentStatus.includes('mist')) {
		image.setAttribute('src', 'images/mist.png');
	}

	let days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	let months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	day.innerHTML = days[newCity.getDay()];
	dateYear.innerHTML = `${
		months[newCity.getMonth()]
	} ${newCity.getUTCDate()}, ${newCity.getFullYear()}`;

	time.innerHTML = `${cityHour}:${cityMinute}h`;
}

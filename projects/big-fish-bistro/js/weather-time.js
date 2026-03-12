// update city info should be run when the website is loaded.
document.addEventListener("DOMContentLoaded", () => {
    updateCityInfo();
});

document.querySelectorAll('input[name="city"]').forEach(radio => {
    radio.addEventListener("change", updateCityInfo);
});

let currentHours = {
    mf_open: 10,
    mf_close: 21,
    sat_open: 11,
    sat_close: 22,
    sun_open: 12,
    sun_close: 24,
}

let hour = 0;
let temp = 0;
let weather_code = 0;
let isOpen = false;

function updateCityInfo() {
    // The id of the radio button is the city name
    const selectedCity = document.querySelector('input[name="city"]:checked').id;

    // TODO: Call the function to update the map image and address based on the selected city
    updateMap(selectedCity);

    // TODO: Call the function to update business hours for the selected city
    updateHours(selectedCity);

    // TODO: Fetch and display weather and time information for the selected city
    fetchWeatherAndTime(selectedCity);
}

// this function updates the map with correct images and hyperlinks
function updateMap(city) {
    const mapImages = {
        portland: "images/City-1.jpg",
        fresno: "images/City-2.jpg",
        seattle: "images/City-3.jpg"
        // TODO: Add additional cities using the same format as city1
    };

    const mapLinks = {
        portland: "https://www.google.com/maps/d/u/0/edit?mid=1WLUqlnRIkPIcbR88Gc9GS-P-NVbId6I&usp=sharing",
        fresno: "https://www.google.com/maps/d/u/0/edit?mid=1RizmxcOA3CKGDyXJbrMcHPaETl0gSfY&usp=sharing",
        seattle: "https://www.google.com/maps/d/u/0/edit?mid=1yvRNBAVjhFmI2NN-xxuYxSmLqBTA5hI&usp=sharing"
        // TODO: Add additional cities using the same format as city1
    };

    const addresses = {
        portland: "3435 Fremont St, Portland, OR, 97212-2666",
        fresno: "2542 E Lester Ave, Fresno, CA 93720",
        seattle: "1967 22nd Ave S, Seattle, WA 98144"
        // TODO: Add additional cities using the same format as city1
    };

    // TODO: Update the map image source, alt text, map link, and address label
    document.getElementById("map-image").src = mapImages[city];
    document.getElementById("map-image").alt = `Map of ${city}`;
    document.getElementById("map-link").href = mapLinks[city];
    document.getElementById("map-address").innerText = addresses[city];
}

// determines correct lat and long and sends them to the weather API
function fetchWeatherAndTime(city) {
    const positions = {
        portland: {lat: 45.548280, long: -122.624961},
        fresno: {lat: 36.864275, long: -119.737897},
        seattle: {lat: 47.585624, long: -122.304328}
    };
    getCurrentWeather(positions[city].lat, positions[city].long);

}

// Function to format hour from 24 to 12. USed only for html display
function formatHour(h) {
    if (h === 0 || h === 24) return "12am";
    if (h === 12) return "12pm";
    return h > 12 ? `${h - 12}pm` : `${h}am`;
};

function updateHours(city) {
    // update open hours based on city
     switch(city){
        case "portland":
            currentHours.mf_open = 10;
            currentHours.mf_close = 20;
            currentHours.sat_open = 11;
            currentHours.sat_close = 21;
            currentHours.sun_open = 12;
            currentHours.sun_close = 18;
            break;
        case "fresno":
            currentHours.mf_open = 12;
            currentHours.mf_close = 22;
            currentHours.sat_open = 13;
            currentHours.sat_close = 23;
            currentHours.sun_open = 14;
            currentHours.sun_close = 20;
            break;
        case "seattle":
            currentHours.mf_open = 8;
            currentHours.mf_close = 16;
            currentHours.sat_open = 9;
            currentHours.sat_close = 17;
            currentHours.sun_open = 10;
            currentHours.sun_close = 15;
            break;
        default:
            currentHours.mf_open = 0;
            currentHours.mf_close = 0;
            currentHours.sat_open = 0;
            currentHours.sat_close = 0;
            currentHours.sun_open = 0;
            currentHours.sun_close = 0;
            break;
    }
    // update html to display appropiate open hours
    let dineList = document.getElementById("dining-hours");
    dineList.innerHTML = `
        <li>${formatHour(currentHours.mf_open)} - ${formatHour(currentHours.mf_close)} (M-F)</li>
        <li>${formatHour(currentHours.sat_open)} - ${formatHour(currentHours.sat_close)} (Saturday)</li>
        <li>${formatHour(currentHours.sun_open)} - ${formatHour(currentHours.sun_close)} (Sunday)</li>
    `;

    let deliveryList = document.getElementById("delivery-hours");
    deliveryList.innerHTML = `
        <li>${formatHour(currentHours.mf_open + 1)} - ${formatHour(currentHours.mf_close - 1)} (M-F)</li>
        <li>${formatHour(currentHours.sat_open + 1)} - ${formatHour(currentHours.sat_close - 1)} (Saturday)</li>
        <li>${formatHour(currentHours.sun_open + 1)} - ${formatHour(currentHours.sun_close - 1)} (Sunday)</li>
    `;

}

function getCurrentWeather(lat, long) {
    // let the user know the api is loading
    let text = document.getElementById("current-time");
    text.textContent = "Connecting...";
    text.style.color = "rgb(172, 67, 49)";
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,weather_code&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`;
    fetch(url)
    .then(response => {
        // make sure response is sokay
        if(!response.ok)
            throw new Error(response.text());
        return response;
    })
    .then(response => response.text())
    .then(response => {
        // turn response to json and update weather and time displays 
        let jsonResponse = JSON.parse(response);
        //console.log(jsonResponse);
        hour = updateDisplayTime(jsonResponse.current.time);
        weather_code = Number(jsonResponse.current.weather_code);
        temp = jsonResponse.current.temperature_2m;
        updateDisplayWeather();
    })
    .catch(error => {
        console.log(error);
    });
}

// turn the responded date into a usable object
function formatTimeAndDate(timeResponse) {
    const date = new Date(timeResponse);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[date.getDay()];

    let hours = date.getHours();
    const isAm = hours < 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const formattedHour = hours % 12 || 12;
    const time = `${formattedHour}:${minutes}`;

    hours += (minutes != 0) ? 1 : 0;

    const info = {
        year: year,             // current year
        month: month,           // current month
        day: day,               // current day
        dayOfWeek: dayOfWeek,   // day of the week 
        time: time,             // current time (12 hour format)
        hour: hours,            // current hour (1-24)
        isAm: isAm              // is am or pm
    };

    return info;
}

function updateDisplayTime(timeResponse) {
    let timeInfo = formatTimeAndDate(timeResponse);
    //console.log(timeInfo);
    let text = document.getElementById("current-time");
    // compare time info with open/close schedule
    switch(timeInfo.dayOfWeek) {
        case "Saturday":
            // if time is between 11am and 10pm, is open
            isOpen = (timeInfo.hour >= currentHours.sat_open && timeInfo.hour <= currentHours.sat_close);
            break; 
        case "Sunday":
            // if time is between 12pm and 12am, is open
            isOpen = (timeInfo.hour >= currentHours.sun_open && timeInfo.hour <= currentHours.sun_close);
            break;
        default:
            // if time is between 10am and 9pm, is open
            isOpen = (timeInfo.hour >= currentHours.mf_open && timeInfo.hour <= currentHours.mf_close);
    }
    // display if we are open or closed as well as current local time
    text.textContent = `${timeInfo.time} ${timeInfo.isAm ? "AM" : "PM"}: Big Fish Bistro is ${isOpen ? "Open" : "Closed"}`;
    if(isOpen)
        text.style.color = "rgb(47, 180, 51)";
    else
        text.style.color = "rgb(172, 67, 49)";
    
    return timeInfo.hour;
}

function updateDisplayWeather() {
    // set temp to local temp
    document.getElementById("temperature").textContent = `${temp}°F`;
    let icon = document.getElementById("weather-icon");
    // change weather icon to match weather code
    if (weather_code === 0) {
        // clear
        if (hour < 20 && hour > 6)
            icon.src = "images/animated/day.svg";
        else
            icon.src = "images/animated/night.svg";
    } else if (weather_code <= 2) {
        // partly cloudy
        if (hour < 20 && hour > 6)
            icon.src = "images/animated/cloudy-day-1.svg";
        else
            icon.src = "images/animated/cloudy-night-1.svg";

    } else if (weather_code <= 48) {
        // fog
        icon.src = "images/animated/cloudy.svg";
    } else if (weather_code <= 57) {
        // drizzle
        icon.src = "images/animated/rainy-4.svg";
    } else if (weather_code <= 67) {
        // rain
        icon.src = "images/animated/rainy-5.svg";
    } else if (weather_code <= 77) {
        // snow
        icon.src = "images/animated/snowy-5.svg";
    } else if (weather_code <= 82) {
        // rain showers
        icon.src = "images/animated/rainy-6.svg";
    } else if (weather_code <= 86) {
        // snow showers
        icon.src = "images/animated/snowy-6.svg";
    } else {
        // thunderstorm
        icon.src = "images/animated/thunder.svg";
    }
    // patio is open if it's open, temp > 50, and it is cloudy at worst.
    let patio = document.getElementById("patio-status");
    if(isOpen && temp > 50 && weather_code <= 57) {
        patio.textContent = "Patio is Open!"
        patio.style.color = "rgb(47, 180, 51)";
    }
    else {
        patio.textContent = "Patio is Closed"
        patio.style.color = "rgb(172, 67, 49)";
    }
}
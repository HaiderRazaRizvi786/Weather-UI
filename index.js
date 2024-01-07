// fetching elements

const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// assigning variables

let currentTab = userTab;
const apiKey = "801d2f359c02eca706a3ec0519b8eb1d";
currentTab.classList.add("current-tab"); 
getFromSessionStorage();

function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

// to get our location coordinates

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

// to render the wearther details on the page

function renderWeatherInfo(weatherInfo){
    // fetching variables
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weather-desc]");
    const weatherIcon = document.querySelector("[data-weather-Icon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // assigning values
    cityName.innerText = weatherInfo?.name ;  
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`  ;  
    desc.innerText = weatherInfo?.weather?.[0]?.description ;  
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`  ;  
    temp.innerText = `${weatherInfo?.main?.temp} ° F`  ;  
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`  ;  
    humidity.innerText = `${weatherInfo?.main?.humidity}%`  ;  
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`  ;  

}


// function for fetching weather information

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;

    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);

    }
    catch(e){
        loadingScreen.classList.remove("active");
    }
}

// function getting coordinates

function getFromSessionStorage(){
    let localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

// function for switching

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab"); 

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");

            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click",() => {
    switchTab(userTab);
} )

searchTab.addEventListener("click",() => {
    switchTab(searchTab);
})

// to fetch data while submit the city in search

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessButton.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } 
    catch (error) {
        loadingScreen.classList.remove("active");
    }
}

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let city = searchInput.value;
    if(city ===""){
        return;
    }
    fetchSearchWeatherInfo(city);
})
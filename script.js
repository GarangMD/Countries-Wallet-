// ===================================
// COUNTRY INFORMATION FINDER
// Developed by Garang Deng
// ===================================


const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
const darkBtn = document.getElementById("darkBtn");
const voiceBtn = document.getElementById("voiceBtn");
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const weatherCard = document.getElementById("weatherCard");

// const response = await fetch(
    `${API_URL}${encodeURIComponent(country)}?fullText=false`
);


// Elements
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");
...
const result = document.getElementById("result");
const loading = document.getElementById("loading");
const weatherCard = document.getElementById("weatherCard");

// Event Listeners
searchBtn.addEventListener("click", searchCountry);

countryInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchCountry();
    }
});

// ========================
// DARK MODE
// ========================

darkBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const currentTheme =
        document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("theme", currentTheme);

});

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
}

// ========================
// SEARCH COUNTRY
// ========================

async function searchCountry(){

    const country = countryInput.value.trim();

    if(!country){
        alert("Please enter a country name.");
        return;
    }

    loading.style.display = "block";

    result.innerHTML = "";
    weatherCard.innerHTML = "";

    try{

        const response =
            await fetch(API_URL + country);

        if(!response.ok){
            throw new Error("Country not found");
        }

        const data =
            await response.json();

        if (!data || data.length === 0) {
    throw new Error("Country not found");
}

const c = data[0];

        const languages =
            c.languages
            ? Object.values(c.languages).join(", ")
            : "N/A";

        const currencies =
            c.currencies
            ? Object.values(c.currencies)
                .map(cur => cur.name)
                .join(", ")
            : "N/A";

        const capital =
            c.capital
            ? c.capital[0]
            : "N/A";

        const dialingCode =
            c.idd
            ? `${c.idd.root || ""}${c.idd.suffixes ? c.idd.suffixes[0] : ""}`
            : "N/A";

        const domain =
            c.tld
            ? c.tld.join(", ")
            : "N/A";

        result.innerHTML = `

        <div class="card">

            <img
            src="${c.flags.png}"
            class="flag"
            alt="Flag">

            <h2>${c.name.common}</h2>

            ${c.coatOfArms?.png
                ? `<img src="${c.coatOfArms.png}" class="coat" alt="Coat of Arms">`
                : ""
            }

            <p><strong>Official Name:</strong> ${c.name.official}</p>

            <p><strong>Capital:</strong> ${capital}</p>

            <p><strong>Region:</strong> ${c.region}</p>

            <p><strong>Subregion:</strong> ${c.subregion || "N/A"}</p>

            <p><strong>Population:</strong>
            ${c.population.toLocaleString()}</p>

            <p><strong>Area:</strong>
            ${c.area.toLocaleString()} km²</p>

            <p><strong>Languages:</strong>
            ${languages}</p>

            <p><strong>Currencies:</strong>
            ${currencies}</p>

            <p><strong>Time Zones:</strong>
            ${c.timezones.join(", ")}</p>

            <p><strong>UN Member:</strong>
            ${c.unMember ? "Yes" : "No"}</p>

            <p><strong>Calling Code:</strong>
            ${dialingCode}</p>

            <p><strong>Internet Domain:</strong>
            ${domain}</p>

            <p>
            <strong>Google Maps:</strong>

            <a href="${c.maps.googleMaps}"
               target="_blank">

               Open Map

            </a>

            </p>

            <button
            onclick="saveFavorite('${c.name.common}')">

            ❤️ Add to Favorites

            </button>

            <button
            onclick="copyInfo()">

            📋 Copy Info

            </button>

        </div>

        `;

        saveHistory(c.name.common);

        getWeather(capital);

        if(c.latlng){
            showMap(
                c.latlng[0],
                c.latlng[1]
            );
        }

    }

    catch(error){

        result.innerHTML = `

        <div class="card">

        <h2>❌ Country Not Found</h2>

        <p>
        Please check the spelling
        and try again.
        </p>

        </div>

        `;

    }

    finally{

        loading.style.display = "none";

    }

}

// ===================================
// PART 2
// Weather, Map, History, Favorites,
// Voice Search
// ===================================

// ---------- WEATHER ----------
async function getWeather(city){

    if(city === "N/A") return;

    try{

        const response =
        await fetch(`https://wttr.in/${city}?format=j1`);

        const data = await response.json();

        const weather = data.current_condition[0];

        weatherCard.innerHTML = `

        <div class="card">

        <h2>🌤 Current Weather</h2>

        <p><strong>Temperature:</strong>
        ${weather.temp_C} °C</p>

        <p><strong>Condition:</strong>
        ${weather.weatherDesc[0].value}</p>

        <p><strong>Humidity:</strong>
        ${weather.humidity}%</p>

        <p><strong>Wind Speed:</strong>
        ${weather.windspeedKmph} km/h</p>

        <p><strong>Feels Like:</strong>
        ${weather.FeelsLikeC} °C</p>

        </div>

        `;

    }

    catch(error){

        weatherCard.innerHTML = `
        <div class="card">
        <p>Unable to load weather information.</p>
        </div>
        `;

    }

}

// ---------- MAP ----------

let map;

function showMap(lat,lng){

    if(map){
        map.remove();
    }

    map = L.map("map").setView([lat,lng],5);

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:"© OpenStreetMap"

        }

    ).addTo(map);

    L.marker([lat,lng])

    .addTo(map)

    .bindPopup("Selected Country")

    .openPopup();

}

// ---------- SEARCH HISTORY ----------

function saveHistory(country){

    let history =

    JSON.parse(

        localStorage.getItem("history")

    ) || [];

    history = history.filter(item => item !== country);

    history.unshift(country);

    if(history.length > 8){

        history.pop();

    }

    localStorage.setItem(

        "history",

        JSON.stringify(history)

    );

    localStorage.setItem(

        "lastCountry",

        country

    );

    loadHistory();

}

function loadHistory(){

    const historyList =

    document.getElementById("historyList");

    historyList.innerHTML = "";

    const history =

    JSON.parse(

        localStorage.getItem("history")

    ) || [];

    history.forEach(country=>{

        const li = document.createElement("li");

        li.textContent = "🌍 " + country;

        li.onclick = ()=>{

            countryInput.value = country;

            searchCountry();

        };

        historyList.appendChild(li);

    });

}

// ---------- FAVORITES ----------

function saveFavorite(country){

    let favorites =

    JSON.parse(

        localStorage.getItem("favorites")

    ) || [];

    if(!favorites.includes(country)){

        favorites.push(country);

    }

    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );

    loadFavorites();

    alert(country + " added to favorites.");

}

function loadFavorites(){

    const favoriteList =

    document.getElementById("favoriteList");

    favoriteList.innerHTML = "";

    const favorites =

    JSON.parse(

        localStorage.getItem("favorites")

    ) || [];

    favorites.forEach(country=>{

        const li = document.createElement("li");

        li.textContent = "❤️ " + country;

        li.onclick = ()=>{

            countryInput.value = country;

            searchCountry();

        };

        favoriteList.appendChild(li);

    });

}

// ---------- VOICE SEARCH ----------

if(

'webkitSpeechRecognition' in window ||

'SpeechRecognition' in window

){

const SpeechRecognition =

window.SpeechRecognition ||

window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";

voiceBtn.addEventListener("click",()=>{

recognition.start();

});

recognition.onresult = (event)=>{

const spoken =

event.results[0][0].transcript;

countryInput.value = spoken;

searchCountry();

};

}


// ===================================
// PART 3
// Final Functions & App Initialization
// ===================================

// ---------- COPY COUNTRY INFORMATION ----------
function copyInfo() {

    const text = document.getElementById("result").innerText;

    navigator.clipboard.writeText(text)
        .then(() => {
            alert("✅ Country information copied to clipboard.");
        })
        .catch(() => {
            alert("❌ Unable to copy.");
        });

}

// ---------- LOAD LAST SEARCH ----------
function loadLastCountry() {

    const lastCountry = localStorage.getItem("lastCountry");

    if (lastCountry) {

        countryInput.value = lastCountry;

        searchCountry();

    }

}

// ---------- CLEAR SEARCH ----------
function clearSearch() {

    countryInput.value = "";

    result.innerHTML = "";

    weatherCard.innerHTML = "";

    if (map) {
        map.remove();
        map = null;
    }

}

// ---------- AUTO COMPLETE COUNTRIES ----------
async function loadCountries() {

    try {

        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name"
        );

        const countries = await response.json();

        const list = document.createElement("datalist");
        list.id = "countries";

        countries
            .sort((a, b) =>
                a.name.common.localeCompare(b.name.common)
            )
            .forEach(country => {

                const option = document.createElement("option");

                option.value = country.name.common;

                list.appendChild(option);

            });

        document.body.appendChild(list);

        countryInput.setAttribute("list", "countries");

    } catch (error) {

        console.log("Unable to load country list.");

    }

}

// ---------- APP STARTUP ----------
window.onload = function () {

    loadHistory();

    loadFavorites();

    loadLastCountry();

    loadCountries();

};

// ---------- OPTIONAL: REFRESH DATA EVERY 10 MINUTES ----------
setInterval(() => {

    if (countryInput.value.trim() !== "") {

        searchCountry();

    }

}, 600000);








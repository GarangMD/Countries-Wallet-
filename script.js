// Toggle dark mode
function toggleDark() {
    document.body.classList.toggle("dark-mode");
}

// Search for a country using REST Countries API
async function searchCountry() {
    const country = document.getElementById("countryInput").value.trim();
    const resultDiv = document.getElementById("result");

    if (country === "") {
        alert("Please type a country name.");
        return;
    }

    resultDiv.innerHTML = "<p>Loading...</p>";

    try {
        const res = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.status === 404) {
            resultDiv.innerHTML = "<p>Country not found.</p>";
            return;
        }

        const c = data[0];

        const name = c.name.common;
        const capital = c.capital ? c.capital[0] : "Not available";
        const population = c.population.toLocaleString();
        const region = c.region;
        const flag = c.flags.png;
        const currency = c.currencies ? Object.values(c.currencies)[0].name : "Not available";
        const languages = c.languages ? Object.values(c.languages).join(", ") : "Not available";

        resultDiv.innerHTML = `
            <h2>${name}</h2>
            <img src="${flag}" alt="Flag of ${name}">
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Continent:</strong> ${region}</p>
            <p><strong>Currency:</strong> ${currency}</p>
            <p><strong>Languages:</strong> ${languages}</p>
        `;

    } catch (error) {
        resultDiv.innerHTML = "<p>Error retrieving data. Please check your internet connection.</p>";
        console.error(error);
    }
}

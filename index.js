// Fetch Weather Alerts
async function fetchWeatherAlerts(state) {
    try {
        const response = await fetch(
            `https://api.weather.gov/alerts/active?area=${state}`
        );

        // Handle HTTP errors
        if (!response.ok) {
            throw new Error(`Unable to fetch alerts (${response.status})`);
        }

        const data = await response.json();

        console.log("Weather API response:", data);

        return data;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
}
//Display Alerts
function displayAlerts(data, stateName = "Selected State") {
    const container = document.getElementById("alerts");

    // Clear previous results
    container.innerHTML = "";

    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = "";
    errorDiv.style.display = "none";

    const features = data.features || [];

    // Summary
    const summary = document.createElement("h2");
    summary.textContent =
        `Current watches, warnings, and advisories for ${stateName}: ${features.length}`;
    container.appendChild(summary);

    // No alerts case
    if (features.length === 0) {
        const noAlerts = document.createElement("p");
        noAlerts.textContent = "No active alerts for this state.";
        container.appendChild(noAlerts);
        return;
    }

    // List alerts
    const list = document.createElement("ul");

    features.forEach(feature => {
        const headline = feature?.properties?.headline;

        if (headline) {
            const li = document.createElement("li");
            li.textContent = headline;
            list.appendChild(li);
        }
    });

    container.appendChild(list);
}

// UI and Error Handling

document.getElementById("fetch-btn").addEventListener("click", async () => {
    const input = document.getElementById("state-input");
    const state = input.value.trim().toUpperCase();

    const errorDiv = document.getElementById("error-message");
    const container = document.getElementById("alerts");

    // Reset UI every time
    errorDiv.textContent = "";
    errorDiv.style.display = "none";
    container.innerHTML = "";

    try {
        // Validate input
        if (!state || state.length !== 2) {
            throw new Error("Please enter a valid 2-letter state code.");
        }

        // Fetch data
        const data = await fetchWeatherAlerts(state);

        // Display data
        displayAlerts(data, state);

    } catch (error) {
        console.log(error.message);

        errorDiv.textContent = error.message;
        errorDiv.style.display = "block";

    } finally {
        // Always clear input
        input.value = "";
    }
});
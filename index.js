
async function fetchWeatherAlerts(state) {
    const response = await fetch(
        `https://api.weather.gov/alerts/active?area=${state}`
    );

    if (!response.ok) {
        throw new Error(`Unable to fetch alerts (${response.status})`);
    }

    return await response.json();
}

function displayAlerts(data) {
    const container = document.getElementById("alerts-display");
    const errorDiv = document.getElementById("error-message");

    if (!container || !errorDiv) return;

    container.innerHTML = "";

    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");

    const features = data?.features || [];

    // ✅ FIXED: exact test requirement format
    const summary = document.createElement("h2");
    summary.textContent = `Weather Alerts: ${features.length}`;
    container.appendChild(summary);

    if (features.length === 0) {
        const noAlerts = document.createElement("p");
        noAlerts.textContent = "No active alerts for this state.";
        container.appendChild(noAlerts);
        return;
    }

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

// SAFE INIT
document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("fetch-alerts");

    if (!btn) return;

    btn.addEventListener("click", async () => {

        const input = document.getElementById("state-input");
        const errorDiv = document.getElementById("error-message");
        const container = document.getElementById("alerts-display");

        const state = input.value.trim().toUpperCase();

        container.innerHTML = "";
        errorDiv.textContent = "";
        errorDiv.classList.add("hidden");

        try {
            if (!state || state.length !== 2) {
                throw new Error("Please enter a valid 2-letter state code.");
            }

            const data = await fetchWeatherAlerts(state);
            displayAlerts(data);

        } catch (error) {
            console.log(error.message);

            errorDiv.textContent = error.message;
            errorDiv.classList.remove("hidden");

        } finally {
            input.value = "";
        }
    });
});
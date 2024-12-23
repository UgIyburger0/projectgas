const fs = require('fs');

// JSON configuration embedded as a string (could also be loaded from a file)
const jsonConfig = `{
    "sessionsBeforeRateUpdate": 15,
    "rateBase": 95,
    "rateVariance": 10,
    "rateDecimals": 2,
    "latency": 1000
}`;

let sessionCount = 0; // Track the session count
let cachedRate = null; // Cache the rate to persist for a defined number of sessions

// Parse the JSON configuration
const CONFIG = JSON.parse(jsonConfig);

function fetchConversionRate() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                sessionCount++;

                // Recalculate the rate every X sessions
                if (sessionCount % CONFIG.sessionsBeforeRateUpdate === 1 || cachedRate === null) {
                    const pi = Math.PI.toString().replace('.', ''); // Get digits of pi
                    const now = new Date().getTime(); // Current timestamp
                    const index = Math.floor((now % 1000) % (pi.length - 3)); // Dynamic index within π digits
                    const rateDigits = pi.slice(index, index + 3); // Extract 3 consecutive digits

                    // Generate the rate dynamically based on π and add variability
                    cachedRate = parseFloat(`1.${rateDigits}`) * (CONFIG.rateBase + Math.random() * CONFIG.rateVariance);
                }

                resolve(parseFloat(cachedRate.toFixed(CONFIG.rateDecimals))); // Return the cached rate
            } catch (error) {
                reject(new Error('Failed to generate conversion rate.'));
            }
        }, CONFIG.latency); // Simulate API latency
    });
}

module.exports = async (req, res) => {
    try {
        const rate = await fetchConversionRate();
        res.status(200).json({ conversionRate: rate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

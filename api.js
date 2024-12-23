let sessionCount = 0; // Track the session count
let cachedRate = null; // Cache the rate to persist for a defined number of sessions

// JSON configuration embedded as an object
const CONFIG = {
    sessionsBeforeRateUpdate: 15, // How many sessions before recalculating the rate
    rateBase: 95, // The base rate
    rateVariance: 10, // Variability in the rate
    rateDecimals: 2, // Number of decimals for the rate
    latency: 1000 // Simulated API latency in milliseconds
};

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
                reject({
                    error: 'Failed to generate conversion rate.',
                    details: error.message,
                    config: CONFIG
                });
            }
        }, CONFIG.latency); // Simulate API latency
    });
}

module.exports = async (req, res) => {
    try {
        const rate = await fetchConversionRate();
        res.status(200).json({
            conversionRate: rate,
            config: CONFIG
        });
    } catch (error) {
        res.status(500).json({
            error: error.error,
            details: error.details,
            config: error.config // Include the config in case of an error to help with debugging
        });
    }
};

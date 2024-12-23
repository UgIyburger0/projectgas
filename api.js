let sessionCount = 0; // Track the session count
let cachedRate = null; // Cache the rate to persist for 15 sessions

function fetchConversionRate() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                sessionCount++;

                // Recalculate the rate every 15 sessions
                if (sessionCount % 15 === 1 || cachedRate === null) {
                    const pi = Math.PI.toString().replace('.', '');
                    const now = new Date().getTime(); // Current timestamp
                    const index = Math.floor((now % 1000) % (pi.length - 3)); // Dynamic index within π digits
                    const rateDigits = pi.slice(index, index + 3); // Extract 3 consecutive digits

                    // Generate the rate dynamically based on π and add variability
                    cachedRate = parseFloat(`1.${rateDigits}`) * (95 + Math.random() * 10); // Base rate ~95-105
                }

                resolve(parseFloat(cachedRate.toFixed(2))); // Return the cached rate
            } catch (error) {
                reject(new Error('Failed to generate conversion rate.'));
            }
        }, 1000); // Simulate API latency
    });
}

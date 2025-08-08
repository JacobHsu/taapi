// Configuration example file
// Copy this file to config.js and set your actual API key

const CONFIG = {
    // Replace with your actual Taapi.io API key
    TAAPI_API_KEY: 'YOUR_TAAPI_API_KEY',
    
    // API settings
    SYMBOL: 'ETH/USDT',
    INTERVAL: '1h',
    BACKTRACKS: 10, // Number of hours to fetch
    
    // Cache settings
    CACHE_DURATION_HOURS: 1, // How long to keep data before refreshing
    
    // Display settings
    DECIMAL_PLACES: 2
};

// Export configuration
window.CONFIG = CONFIG;
// Configuration file for frontend application
// ⚠️ SECURITY NOTE: This is a client-side application
// Your API key will be visible in browser source code

const CONFIG = {
    // 🔑 API Key Configuration (multiple options):
    // Option 1: Direct assignment (for local development)
    // TAAPI_API_KEY: 'your_actual_api_key_here',
    
    // Option 2: Environment variable injection (for Vercel/Netlify)
    // This will be replaced during build process if TAAPI_API_KEY env var exists
    TAAPI_API_KEY: 'YOUR_TAAPI_API_KEY_HERE',
    
    // Option 3: User input (fallback for GitHub Pages)
    // Users will be prompted to enter their API key in the browser
    
    // API settings
    SYMBOL: 'ETH/USDT',
    INTERVAL: '1h', 
    BACKTRACKS: 10,
    API_DELAY_MS: 15000, // Delay between API calls in milliseconds (15 seconds)
    
    // Cache settings
    CACHE_DURATION_HOURS: 1,
    
    // Display settings
    DECIMAL_PLACES: 2
};

// Export configuration
window.CONFIG = CONFIG;
#!/usr/bin/env node

// Build script to inject environment variables into config.js
// Usage: TAAPI_API_KEY=your_key node build.js

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.TAAPI_API_KEY;

if (!API_KEY) {
    console.log('ℹ️  No TAAPI_API_KEY environment variable found.');
    console.log('📝 Users will be prompted to enter API key in browser.');
    process.exit(0);
}

const configTemplate = `// Configuration file for frontend application
// 🔑 API key injected from environment variable during build

const CONFIG = {
    // Environment variable injected API key
    TAAPI_API_KEY: '${API_KEY}',
    
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
`;

fs.writeFileSync(path.join(__dirname, 'config.js'), configTemplate);

console.log('✅ config.js generated with environment variable');
console.log('🔑 API key injected successfully');
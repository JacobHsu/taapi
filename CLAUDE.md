# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **pure frontend** cryptocurrency technical indicator dashboard that displays ETH/USDT KDJ, RSI, and MACD data from Taapi.io API.

## Development Commands

### No Build Required
This is a static frontend project - simply open `index.html` in a browser to run.

### Configuration Setup
Copy `config.example.js` to `config.js` and set your TAAPI_API_KEY.

## Architecture Overview

Pure frontend architecture with smart caching and API rate limiting strategies.

### Key Components

- **Main App**: `script.js` - Coordinates UI, storage, and API client with smart update logic
- **API Client**: `api-client-bulk.js` - TaapiClientBulk class handles rate-limited sequential API calls for KDJ, RSI, MACD
- **Storage**: `indexeddb-storage.js` - Smart caching with hourly update detection and cumulative data storage
- **Configuration**: Simple `config.js` file with API key and settings

### Smart Update System

#### Hourly Update Detection
- Checks if current time has crossed into a new hour since last update
- Only fetches new data when crossing hour boundaries
- Avoids unnecessary API calls within the same hour

#### Cumulative Data Storage
- **Initial Load**: Fetches 5 historical data points
- **Incremental Updates**: Fetches only 1 new data point per hour
- **Data Persistence**: All data accumulates over time (not overwritten)

#### API Flow
1. **KDJ** (stoch endpoint) → 15s delay → **RSI** → 15s delay → **MACD**
2. Data merged by timestamp and processed for technical analysis
3. Stored cumulatively in IndexedDB with unique timestamp IDs

### Technical Analysis Features
- **KDJ**: Golden cross (K>D), death cross (K<D) detection
- **RSI**: Overbought (≥70), oversold (≤30), bullish/bearish signals
- **MACD**: Signal line crossovers and trend analysis

### Configuration
- `API_DELAY_MS`: Delay between API calls (default: 15000ms)
- `TAAPI_API_KEY`: Required Taapi.io API key
- `CACHE_DURATION_HOURS`: Not used (replaced by hourly detection)

### Security Notes
- Client-side API key visible in browser source
- Recommend using restricted API keys and monitoring usage
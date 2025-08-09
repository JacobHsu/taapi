// Bulk API client for fetching multiple indicators in one request
class TaapiClientBulk {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.taapi.io';
    }

    // Fetch initial historical data (5 records)
    async fetchInitialData(symbol = 'ETH/USDT', interval = '1h', progressCallback = null) {
        return this.fetchIndicatorsWithBacktracks(symbol, interval, 5, progressCallback);
    }

    // Fetch latest data only (1 record)
    async fetchLatestData(symbol = 'ETH/USDT', interval = '1h', progressCallback = null) {
        return this.fetchIndicatorsWithBacktracks(symbol, interval, 1, progressCallback);
    }

    // Legacy method - now calls fetchLatestData
    async fetchAllIndicators(symbol = 'ETH/USDT', interval = '1h', progressCallback = null) {
        return this.fetchLatestData(symbol, interval, progressCallback);
    }

    // Core method to fetch data with specified backtracks
    async fetchIndicatorsWithBacktracks(symbol = 'ETH/USDT', interval = '1h', backtracks = 1, progressCallback = null) {
        try {
            const totalSteps = 5; // Price, KDJ, RSI, MACD, Squeeze
            let currentStep = 0;
            
            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching price data...');
            console.log('Fetching price data...');
            const priceResponse = await fetch(`${this.baseUrl}/price?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!priceResponse.ok) {
                const errorText = await priceResponse.text();
                if (priceResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching price failed: ${priceResponse.status} - ${errorText}`);
            }
            const priceData = await priceResponse.json();
            console.log('Price Response:', priceData);

            // Wait for a configurable delay
            const delay = window.CONFIG?.API_DELAY_MS || 15000;
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching KDJ data...');
            console.log('Fetching KDJ data...');
            const kdjResponse = await fetch(`${this.baseUrl}/stoch?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!kdjResponse.ok) {
                const errorText = await kdjResponse.text();
                if (kdjResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching KDJ failed: ${kdjResponse.status} - ${errorText}`);
            }
            const kdjData = await kdjResponse.json();
            console.log('KDJ Response:', kdjData);

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching RSI data...');
            console.log('Fetching RSI data...');
            const rsiResponse = await fetch(`${this.baseUrl}/rsi?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!rsiResponse.ok) {
                const errorText = await rsiResponse.text();
                if (rsiResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching RSI failed: ${rsiResponse.status} - ${errorText}`);
            }
            const rsiData = await rsiResponse.json();

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching MACD data...');
            console.log('Fetching MACD data...');
            const macdResponse = await fetch(`${this.baseUrl}/macd?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!macdResponse.ok) {
                const errorText = await macdResponse.text();
                if (macdResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching MACD failed: ${macdResponse.status} - ${errorText}`);
            }
            const macdData = await macdResponse.json();

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching Squeeze data...');
            console.log('Fetching Squeeze data...');
            const squeezeResponse = await fetch(`${this.baseUrl}/squeeze?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!squeezeResponse.ok) {
                const errorText = await squeezeResponse.text();
                if (squeezeResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching Squeeze failed: ${squeezeResponse.status} - ${errorText}`);
            }
            const squeezeData = await squeezeResponse.json();
            console.log('Squeeze Response:', squeezeData);

            // Construct the final object for processing
            const finalBulkResponse = {
                data: [
                    { id: 'price', result: priceData },
                    { id: 'kdj', result: kdjData },
                    { id: 'rsi', result: rsiData },
                    { id: 'macd', result: macdData },
                    { id: 'squeeze', result: squeezeData }
                ]
            };

            if (progressCallback) progressCallback(totalSteps, totalSteps, 'Processing data...');
            console.log('Parsed sequential API response:', finalBulkResponse);
            return this.processBulkData(finalBulkResponse);

        } catch (error) {
            console.error('Error fetching indicators data sequentially:', error);
            throw error;
        }
    }

    // Process bulk API response by merging data based on timestamps
    processBulkData(bulkResponse) {
        console.log('Processing combined data:', bulkResponse);

        const priceData = bulkResponse.data?.find(item => item.id === 'price')?.result || [];
        const kdjData = bulkResponse.data?.find(item => item.id === 'kdj')?.result || [];
        const rsiData = bulkResponse.data?.find(item => item.id === 'rsi')?.result || [];
        const macdData = bulkResponse.data?.find(item => item.id === 'macd')?.result || [];
        const squeezeData = bulkResponse.data?.find(item => item.id === 'squeeze')?.result || [];

        console.log('Extracted Price data:', priceData);
        console.log('Extracted KDJ data:', kdjData);
        console.log('Extracted RSI data:', rsiData);
        console.log('Extracted MACD data:', macdData);
        console.log('Extracted Squeeze data:', squeezeData);

        if (priceData.length === 0 && kdjData.length === 0 && rsiData.length === 0 && macdData.length === 0 && squeezeData.length === 0) {
            throw new Error('No indicator data found in response');
        }

        const dataMap = new Map();

        // Helper to initialize a map entry
        const initDataPoint = (timestamp) => ({
            timestamp: timestamp,
            backtrack: 0,
            price: 0,
            kValue: 0, dValue: 0, jValue: 0,
            rsiValue: 0,
            macdValue: 0, signalValue: 0, histValue: 0,
            squeeze: false
        });

        // Process Price data - ensure it's an array
        const priceArray = Array.isArray(priceData) ? priceData : (priceData ? [priceData] : []);
        priceArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.price = item.value || item.price || 0;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process KDJ data - ensure it's an array
        const kdjArray = Array.isArray(kdjData) ? kdjData : (kdjData ? [kdjData] : []);
        kdjArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            // Stochastic uses different field names
            point.kValue = item.valueK || item.value || item.k || 0;
            point.dValue = item.valueD || item.valueSlowD || item.d || 0;
            point.jValue = item.valueJ || item.j || (3 * (item.valueK || item.value || 0) - 2 * (item.valueD || item.valueSlowD || 0)) || 0;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process RSI data - ensure it's an array
        const rsiArray = Array.isArray(rsiData) ? rsiData : (rsiData ? [rsiData] : []);
        rsiArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.rsiValue = item.value || 0;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process MACD data - ensure it's an array
        const macdArray = Array.isArray(macdData) ? macdData : (macdData ? [macdData] : []);
        macdArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.macdValue = item.valueMACD || item.value || 0;
            point.signalValue = item.valueMACDSignal || item.signal || 0;
            point.histValue = item.valueMACDHist || item.hist || 0;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process Squeeze data - ensure it's an array
        const squeezeArray = Array.isArray(squeezeData) ? squeezeData : (squeezeData ? [squeezeData] : []);
        squeezeArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.squeeze = item.squeeze || item.value || false;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Convert map to array and sort by timestamp descending (newest first)
        let combinedData = Array.from(dataMap.values()).sort((a, b) => b.timestamp - a.timestamp);

        // Perform analysis on the combined data
        const processedData = [];
        for (let i = 0; i < combinedData.length; i++) {
            const item = combinedData[i];
            const previous = i > 0 ? processedData[i - 1] : null; // Use the previously processed item for trend analysis

            const kdjAnalysis = this.analyzeKDJ(item.kValue, item.dValue, item.jValue, previous, kdjArray.length > 0);
            const rsiAnalysis = this.analyzeRSI(item.rsiValue, rsiArray.length > 0);
            const macdAnalysis = this.analyzeMacd(item.macdValue, item.signalValue, previous, macdArray.length > 0);

            processedData.push({
                timestamp: item.timestamp,
                backtrack: item.backtrack,
                // Price value
                price: parseFloat(item.price) || 0,
                // KDJ values (J value calculated but not displayed)
                kValue: parseFloat(item.kValue) || 0,
                dValue: parseFloat(item.dValue) || 0,
                jValue: parseFloat(item.jValue) || 0,
                kdjDescription: kdjAnalysis.description,
                kdjTrend: kdjAnalysis.trend,
                // RSI values
                rsiValue: parseFloat(item.rsiValue) || 0,
                rsiDescription: rsiAnalysis.description,
                rsiTrend: rsiAnalysis.trend,
                // MACD values
                macdValue: parseFloat(item.macdValue) || 0,
                signalValue: parseFloat(item.signalValue) || 0,
                histValue: parseFloat(item.histValue) || 0,
                macdDescription: macdAnalysis.description,
                macdTrend: macdAnalysis.trend,
                // Squeeze value
                squeeze: item.squeeze || false
            });
        }

        console.log('Final combined processed data:', processedData);
        return processedData;
    }

    // Analyze KDJ indicator
    analyzeKDJ(k, d, j, previous, hasData) {
        if (!hasData) {
            return { description: 'KDJ數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';

        if (previous && previous.kValue !== 0) {
            const prevK = previous.kValue;
            const prevD = previous.dValue;

            if (prevK <= prevD && k > d) {
                description = 'KDJ金叉 (K線上穿D線)';
                trend = 'bullish';
            } else if (prevK >= prevD && k < d) {
                description = 'KDJ死叉 (K線下穿D線)';
                trend = 'bearish';
            } else if (k > d) {
                description = 'KDJ多頭持續 (K>D)';
                trend = 'bullish';
            } else if (k < d) {
                description = 'KDJ空頭持續 (K<D)';
                trend = 'bearish';
            } else {
                description = 'KDJ盤整 (K≈D)';
                trend = 'neutral';
            }
        } else {
            if (k > d) {
                description = 'KDJ多頭 (K>D)';
                trend = 'bullish';
            } else if (k < d) {
                description = 'KDJ空頭 (K<D)';
                trend = 'bearish';
            } else {
                description = 'KDJ中性';
                trend = 'neutral';
            }
        }

        return { description, trend };
    }

    // Analyze KDJ indicator
    analyzeKDJ(k, d, j, previous, hasData) {
        if (!hasData) {
            return { description: 'KDJ數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';

        if (previous && previous.kValue !== 0) {
            const prevK = previous.kValue;
            const prevD = previous.dValue;

            if (prevK <= prevD && k > d) {
                description = 'KDJ金叉 (K線上穿D線)';
                trend = 'bullish';
            } else if (prevK >= prevD && k < d) {
                description = 'KDJ死叉 (K線下穿D線)';
                trend = 'bearish';
            } else if (k > d) {
                description = 'KDJ多頭持續 (K>D)';
                trend = 'bullish';
            } else if (k < d) {
                description = 'KDJ空頭持續 (K<D)';
                trend = 'bearish';
            } else {
                description = 'KDJ盤整 (K≈D)';
                trend = 'neutral';
            }
        } else {
            if (k > d) {
                description = 'KDJ多頭 (K>D)';
                trend = 'bullish';
            } else if (k < d) {
                description = 'KDJ空頭 (K<D)';
                trend = 'bearish';
            } else {
                description = 'KDJ中性';
                trend = 'neutral';
            }
        }

        return { description, trend };
    }

    // Analyze RSI indicator
    analyzeRSI(rsi, hasData) {
        if (!hasData) {
            return { description: 'RSI數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';

        if (rsi >= 70) {
            description = 'RSI超買 (≥70)';
            trend = 'overbought';
        } else if (rsi <= 30) {
            description = 'RSI超賣 (≤30)';
            trend = 'oversold';
        } else if (rsi > 50) {
            description = 'RSI偏多 (>50)';
            trend = 'bullish';
        } else if (rsi < 50) {
            description = 'RSI偏空 (<50)';
            trend = 'bearish';
        } else {
            description = 'RSI中性 (≈50)';
            trend = 'neutral';
        }

        return { description, trend };
    }

    // Analyze MACD indicator
    analyzeMacd(macd, signal, previous, hasData) {
        if (!hasData) {
            return { description: 'MACD數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';

        if (previous && previous.macdValue !== 0) {
            const prevMacd = previous.macdValue;
            const prevSignal = previous.signalValue;

            if (prevMacd <= prevSignal && macd > signal) {
                description = 'MACD金叉 (MACD上穿Signal)';
                trend = 'bullish';
            } else if (prevMacd >= prevSignal && macd < signal) {
                description = 'MACD死叉 (MACD下穿Signal)';
                trend = 'bearish';
            } else if (macd > signal) {
                description = 'MACD多頭持續 (MACD>Signal)';
                trend = 'bullish';
            } else if (macd < signal) {
                description = 'MACD空頭持續 (MACD<Signal)';
                trend = 'bearish';
            } else {
                description = 'MACD盤整 (MACD≈Signal)';
                trend = 'neutral';
            }
        } else {
            if (macd > signal) {
                description = 'MACD多頭 (MACD>Signal)';
                trend = 'bullish';
            } else if (macd < signal) {
                description = 'MACD空頭 (MACD<Signal)';
                trend = 'bearish';
            } else {
                description = 'MACD中性';
                trend = 'neutral';
            }
        }

        return { description, trend };
    }
}

// Export for use in other files
window.TaapiClientBulk = TaapiClientBulk;
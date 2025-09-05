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
            const totalSteps = 12; // Price, KDJ, RSI, MACD, BBands, Keltner Channels, Squeeze, PSAR, Supertrend, MFI, ATR, DMI
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

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching BBands data...');
            console.log('Fetching BBands data...');
            const bbandsResponse = await fetch(`${this.baseUrl}/bbands?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!bbandsResponse.ok) {
                const errorText = await bbandsResponse.text();
                if (bbandsResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching BBands failed: ${bbandsResponse.status} - ${errorText}`);
            }
            const bbandsData = await bbandsResponse.json();
            console.log('BBands Response:', bbandsData);

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching Keltner Channels data...');
            console.log('Fetching Keltner Channels data...');
            const keltnerResponse = await fetch(`${this.baseUrl}/keltnerchannels?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!keltnerResponse.ok) {
                const errorText = await keltnerResponse.text();
                if (keltnerResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching Keltner Channels failed: ${keltnerResponse.status} - ${errorText}`);
            }
            const keltnerData = await keltnerResponse.json();
            console.log('Keltner Channels Response:', keltnerData);

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

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching PSAR data...');
            console.log('Fetching PSAR data...');
            const psarResponse = await fetch(`${this.baseUrl}/sar?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!psarResponse.ok) {
                const errorText = await psarResponse.text();
                if (psarResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching PSAR failed: ${psarResponse.status} - ${errorText}`);
            }
            const psarData = await psarResponse.json();
            console.log('PSAR Response:', psarData);

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching Supertrend data...');
            console.log('Fetching Supertrend data...');
            const supertrendResponse = await fetch(`${this.baseUrl}/supertrend?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!supertrendResponse.ok) {
                const errorText = await supertrendResponse.text();
                if (supertrendResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching Supertrend failed: ${supertrendResponse.status} - ${errorText}`);
            }
            const supertrendData = await supertrendResponse.json();
            console.log('Supertrend Response:', supertrendData);

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching MFI data...');
            console.log('Fetching MFI data...');
            const mfiResponse = await fetch(`${this.baseUrl}/mfi?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!mfiResponse.ok) {
                const errorText = await mfiResponse.text();
                if (mfiResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching MFI failed: ${mfiResponse.status} - ${errorText}`);
            }
            const mfiData = await mfiResponse.json();
            console.log('MFI Response:', mfiData);

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching ATR data...');
            console.log('Fetching ATR data...');
            const atrResponse = await fetch(`${this.baseUrl}/atr?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!atrResponse.ok) {
                const errorText = await atrResponse.text();
                if (atrResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching ATR failed: ${atrResponse.status} - ${errorText}`);
            }
            const atrData = await atrResponse.json();
            console.log('ATR Response:', atrData);

            // Wait for a configurable delay
            console.log(`Waiting ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));

            if (progressCallback) progressCallback(++currentStep, totalSteps, 'Fetching DMI data...');
            console.log('Fetching DMI data...');
            const dmiResponse = await fetch(`${this.baseUrl}/dmi?secret=${this.apiKey}&exchange=binance&symbol=${symbol}&interval=${interval}&backtracks=${backtracks}&addResultTimestamp=true`);
            if (!dmiResponse.ok) {
                const errorText = await dmiResponse.text();
                if (dmiResponse.status === 429) {
                    throw new Error(`API 調用頻率限制，請稍後再試: ${errorText}`);
                }
                throw new Error(`Fetching DMI failed: ${dmiResponse.status} - ${errorText}`);
            }
            const dmiData = await dmiResponse.json();
            console.log('DMI Response:', dmiData);

            // Construct the final object for processing
            const finalBulkResponse = {
                data: [
                    { id: 'price', result: priceData },
                    { id: 'kdj', result: kdjData },
                    { id: 'rsi', result: rsiData },
                    { id: 'macd', result: macdData },
                    { id: 'bbands', result: bbandsData },
                    { id: 'keltner', result: keltnerData },
                    { id: 'squeeze', result: squeezeData },
                    { id: 'psar', result: psarData },
                    { id: 'supertrend', result: supertrendData },
                    { id: 'mfi', result: mfiData },
                    { id: 'atr', result: atrData },
                    { id: 'dmi', result: dmiData }
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
        const bbandsData = bulkResponse.data?.find(item => item.id === 'bbands')?.result || [];
        const keltnerData = bulkResponse.data?.find(item => item.id === 'keltner')?.result || [];
        const squeezeData = bulkResponse.data?.find(item => item.id === 'squeeze')?.result || [];
        const psarData = bulkResponse.data?.find(item => item.id === 'psar')?.result || [];
        const supertrendData = bulkResponse.data?.find(item => item.id === 'supertrend')?.result || [];
        const mfiData = bulkResponse.data?.find(item => item.id === 'mfi')?.result || [];
        const atrData = bulkResponse.data?.find(item => item.id === 'atr')?.result || [];
        const dmiData = bulkResponse.data?.find(item => item.id === 'dmi')?.result || [];

        console.log('Extracted Price data:', priceData);
        console.log('Extracted KDJ data:', kdjData);
        console.log('Extracted RSI data:', rsiData);
        console.log('Extracted MACD data:', macdData);
        console.log('Extracted BBands data:', bbandsData);
        console.log('Extracted Keltner data:', keltnerData);
        console.log('Extracted Squeeze data:', squeezeData);
        console.log('Extracted PSAR data:', psarData);
        console.log('Extracted Supertrend data:', supertrendData);
        console.log('Extracted MFI data:', mfiData);
        console.log('Extracted ATR data:', atrData);
        console.log('Extracted DMI data:', dmiData);

        if (priceData.length === 0 && kdjData.length === 0 && rsiData.length === 0 && macdData.length === 0 && bbandsData.length === 0 && keltnerData.length === 0 && squeezeData.length === 0 && psarData.length === 0 && supertrendData.length === 0 && mfiData.length === 0 && atrData.length === 0 && dmiData.length === 0) {
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
            bbandsUpper: 0, bbandsMiddle: 0, bbandsLower: 0,
            keltnerUpper: 0, keltnerMiddle: 0, keltnerLower: 0,
            squeeze: false,
            psarValue: 0,
            supertrendAdvice: '',
            mfiValue: 0,
            atrValue: 0,
            adxValue: 0, pdiValue: 0, mdiValue: 0
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

        // Process BBands data - ensure it's an array
        const bbandsArray = Array.isArray(bbandsData) ? bbandsData : (bbandsData ? [bbandsData] : []);
        bbandsArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.bbandsUpper = item.valueUpperBand || item.upper || 0;
            point.bbandsMiddle = item.valueMiddleBand || item.middle || 0;
            point.bbandsLower = item.valueLowerBand || item.lower || 0;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process Keltner Channels data - ensure it's an array
        const keltnerArray = Array.isArray(keltnerData) ? keltnerData : (keltnerData ? [keltnerData] : []);
        keltnerArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.keltnerUpper = item.valueUpperBand || item.upper || 0;
            point.keltnerMiddle = item.valueMiddleBand || item.middle || 0;
            point.keltnerLower = item.valueLowerBand || item.lower || 0;
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

        // Process PSAR data - ensure it's an array
        const psarArray = Array.isArray(psarData) ? psarData : (psarData ? [psarData] : []);
        psarArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.psarValue = item.value || 0;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process Supertrend data - ensure it's an array
        const supertrendArray = Array.isArray(supertrendData) ? supertrendData : (supertrendData ? [supertrendData] : []);
        supertrendArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.supertrendAdvice = item.valueAdvice || item.advice || '';
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process MFI data - ensure it's an array
        const mfiArray = Array.isArray(mfiData) ? mfiData : (mfiData ? [mfiData] : []);
        mfiArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.mfiValue = item.value || 0;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process ATR data - ensure it's an array
        const atrArray = Array.isArray(atrData) ? atrData : (atrData ? [atrData] : []);
        atrArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.atrValue = item.value || 0;
            point.backtrack = item.backtrack !== undefined ? item.backtrack : point.backtrack;
            dataMap.set(item.timestamp, point);
        });

        // Process DMI data - ensure it's an array
        const dmiArray = Array.isArray(dmiData) ? dmiData : (dmiData ? [dmiData] : []);
        dmiArray.forEach(item => {
            if (!item.timestamp) return;
            const point = dataMap.get(item.timestamp) || initDataPoint(item.timestamp);
            point.adxValue = item.adx || 0;
            point.pdiValue = item.pdi || 0;
            point.mdiValue = item.mdi || 0;
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
            const macdAnalysis = this.analyzeMacd(item.macdValue, item.signalValue, item.histValue, previous, macdArray.length > 0);
            const bbandsAnalysis = this.analyzeBBands(item.bbandsUpper, item.bbandsMiddle, item.bbandsLower, item.price, bbandsArray.length > 0);
            const keltnerAnalysis = this.analyzeKeltnerChannels(item.keltnerUpper, item.keltnerMiddle, item.keltnerLower, item.price, keltnerArray.length > 0);
            const psarAnalysis = this.analyzePSAR(item.psarValue, item.price, previous, psarArray.length > 0);
            const mfiAnalysis = this.analyzeMFI(item.mfiValue, mfiArray.length > 0);
            const atrAnalysis = this.analyzeATR(item.atrValue, atrArray.length > 0);
            const dmiAnalysis = this.analyzeDMI(item.adxValue, item.pdiValue, item.mdiValue, dmiArray.length > 0);

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
                // BBands values
                bbandsUpper: parseFloat(item.bbandsUpper) || 0,
                bbandsMiddle: parseFloat(item.bbandsMiddle) || 0,
                bbandsLower: parseFloat(item.bbandsLower) || 0,
                bbandsDescription: bbandsAnalysis.description,
                bbandsTrend: bbandsAnalysis.trend,
                // Keltner Channels values
                keltnerUpper: parseFloat(item.keltnerUpper) || 0,
                keltnerMiddle: parseFloat(item.keltnerMiddle) || 0,
                keltnerLower: parseFloat(item.keltnerLower) || 0,
                keltnerDescription: keltnerAnalysis.description,
                keltnerTrend: keltnerAnalysis.trend,
                // Squeeze value
                squeeze: item.squeeze || false,
                // PSAR values
                psarValue: parseFloat(item.psarValue) || 0,
                psarDescription: psarAnalysis.description,
                psarTrend: psarAnalysis.trend,
                // Supertrend advice
                supertrendAdvice: item.supertrendAdvice || '',
                // MFI values
                mfiValue: parseFloat(item.mfiValue) || 0,
                mfiDescription: mfiAnalysis.description,
                mfiTrend: mfiAnalysis.trend,
                // ATR values
                atrValue: parseFloat(item.atrValue) || 0,
                atrDescription: atrAnalysis.description,
                atrTrend: atrAnalysis.trend,
                // DMI values
                adxValue: parseFloat(item.adxValue) || 0,
                pdiValue: parseFloat(item.pdiValue) || 0,
                mdiValue: parseFloat(item.mdiValue) || 0,
                dmiDescription: dmiAnalysis.description,
                dmiTrend: dmiAnalysis.trend
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
        const kStr = k.toFixed(2);
        const dStr = d.toFixed(2);

        if (previous && previous.kValue !== 0) {
            const prevK = previous.kValue;
            const prevD = previous.dValue;

            if (prevK <= prevD && k > d) {
                description = `KDJ金叉 (K線上穿D線)(${kStr}>${dStr})`;
                trend = 'bullish';
            } else if (prevK >= prevD && k < d) {
                description = `KDJ死叉 (K線下穿D線)(${kStr}<${dStr})`;
                trend = 'bearish';
            } else if (k > d) {
                description = `KDJ多頭持續 (K>D)(${kStr}>${dStr})`;
                trend = 'bullish';
            } else if (k < d) {
                description = `KDJ空頭持續 (K<D)(${kStr}<${dStr})`;
                trend = 'bearish';
            } else {
                description = `KDJ盤整 (K≈D)(${kStr}≈${dStr})`;
                trend = 'neutral';
            }
        } else {
            if (k > d) {
                description = `KDJ多頭 (K>D)(${kStr}>${dStr})`;
                trend = 'bullish';
            } else if (k < d) {
                description = `KDJ空頭 (K<D)(${kStr}<${dStr})`;
                trend = 'bearish';
            } else {
                description = `KDJ中性 (${kStr}≈${dStr})`;
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
        const rsiInt = Math.round(rsi);

        if (rsi >= 70) {
            description = `RSI超買(>${rsiInt})`;
            trend = 'overbought';
        } else if (rsi <= 30) {
            description = `RSI超賣(<${rsiInt})`;
            trend = 'oversold';
        } else if (rsi > 50) {
            description = `RSI偏多(>${rsiInt})`;
            trend = 'bullish';
        } else if (rsi < 50) {
            description = `RSI偏空(<${rsiInt})`;
            trend = 'bearish';
        } else {
            description = `RSI中性(≈${rsiInt})`;
            trend = 'neutral';
        }

        return { description, trend };
    }

    // Analyze MACD indicator
    analyzeMacd(macd, signal, hist, previous, hasData) {
        if (!hasData) {
            return { description: 'MACD數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';
        const macdStr = macd.toFixed(2);
        const signalStr = signal.toFixed(2);
        const histStr = hist.toFixed(2);

        if (previous && previous.macdValue !== 0) {
            const prevMacd = previous.macdValue;
            const prevSignal = previous.signalValue;

            if (prevMacd <= prevSignal && macd > signal) {
                description = `MACD金叉 (${macdStr}>${signalStr}) Hist:${histStr}`;
                trend = 'bullish';
            } else if (prevMacd >= prevSignal && macd < signal) {
                description = `MACD死叉 (${macdStr}<${signalStr}) Hist:${histStr}`;
                trend = 'bearish';
            } else if (macd > signal) {
                description = `MACD多頭持續 (${macdStr}>${signalStr}) Hist:${histStr}`;
                trend = 'bullish';
            } else if (macd < signal) {
                description = `MACD空頭持續 (${macdStr}<${signalStr}) Hist:${histStr}`;
                trend = 'bearish';
            } else {
                description = `MACD盤整 (${macdStr}≈${signalStr}) Hist:${histStr}`;
                trend = 'neutral';
            }
        } else {
            if (macd > signal) {
                description = `MACD多頭 (${macdStr}>${signalStr}) Hist:${histStr}`;
                trend = 'bullish';
            } else if (macd < signal) {
                description = `MACD空頭 (${macdStr}<${signalStr}) Hist:${histStr}`;
                trend = 'bearish';
            } else {
                description = `MACD中性 (${macdStr}≈${signalStr}) Hist:${histStr}`;
                trend = 'neutral';
            }
        }

        return { description, trend };
    }

    // Analyze Bollinger Bands indicator
    analyzeBBands(upper, middle, lower, price, hasData) {
        if (!hasData || !price || !upper || !lower || !middle) {
            return { description: 'BBands數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';
        const priceStr = Math.round(price).toString();
        const upperStr = Math.round(upper).toString();
        const lowerStr = Math.round(lower).toString();
        const middleStr = Math.round(middle).toString();

        // Calculate position relative to bands
        const upperDistance = ((price - upper) / upper * 100).toFixed(2);
        const lowerDistance = ((price - lower) / lower * 100).toFixed(2);
        const middleDistance = ((price - middle) / middle * 100).toFixed(2);

        if (price > upper) {
            description = `上軌上方 (${priceStr}>${upperStr}) (+${upperDistance}%)`;
            trend = 'upper_breakout';
        } else if (price < lower) {
            description = `下軌下方 (${priceStr}<${lowerStr}) (${lowerDistance}%)`;
            trend = 'lower_breakout';
        } else if (price > middle) {
            description = `中軌上方 (${priceStr}>${middleStr}) (+${middleDistance}%)`;
            trend = 'above_middle';
        } else if (price < middle) {
            description = `中軌下方 (${priceStr}<${middleStr}) (${middleDistance}%)`;
            trend = 'below_middle';
        } else {
            description = `中軌附近 (${priceStr}≈${middleStr})`;
            trend = 'at_middle';
        }

        return { description, trend };
    }

    // Analyze Keltner Channels indicator
    analyzeKeltnerChannels(upper, middle, lower, price, hasData) {
        if (!hasData || !price || !upper || !lower || !middle) {
            return { description: 'Keltner數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';
        const priceStr = Math.round(price).toString();
        const upperStr = Math.round(upper).toString();
        const lowerStr = Math.round(lower).toString();
        const middleStr = Math.round(middle).toString();

        // Calculate position relative to channels
        const upperDistance = ((price - upper) / upper * 100).toFixed(2);
        const lowerDistance = ((price - lower) / lower * 100).toFixed(2);
        const middleDistance = ((price - middle) / middle * 100).toFixed(2);

        if (price > upper) {
            description = `上軌上方 (${priceStr}>${upperStr}) (+${upperDistance}%)`;
            trend = 'upper_breakout';
        } else if (price < lower) {
            description = `下軌下方 (${priceStr}<${lowerStr}) (${lowerDistance}%)`;
            trend = 'lower_breakout';
        } else if (price > middle) {
            description = `中軌上方 (${priceStr}>${middleStr}) (+${middleDistance}%)`;
            trend = 'above_middle';
        } else if (price < middle) {
            description = `中軌下方 (${priceStr}<${middleStr}) (${middleDistance}%)`;
            trend = 'below_middle';
        } else {
            description = `中軌附近 (${priceStr}≈${middleStr})`;
            trend = 'at_middle';
        }

        return { description, trend };
    }

    // Analyze PSAR indicator
    analyzePSAR(psar, price, previous, hasData) {
        if (!hasData || !price || !psar) {
            return { description: 'PSAR數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';
        const psarStr = Math.round(psar).toString();
        const priceStr = Math.round(price).toString();

        // Determine if price is above or below PSAR
        const isAbovePSAR = price > psar;
        
        if (previous && previous.psarValue !== 0 && previous.price !== 0) {
            const wasPreviousAbovePSAR = previous.price > previous.psarValue;
            
            // Check for reversal
            if (wasPreviousAbovePSAR && !isAbovePSAR) {
                description = `PSAR反轉 (轉空頭) (${priceStr}<${psarStr})`;
                trend = 'bearish_reversal';
            } else if (!wasPreviousAbovePSAR && isAbovePSAR) {
                description = `PSAR反轉 (轉多頭) (${priceStr}>${psarStr})`;
                trend = 'bullish_reversal';
            } else if (isAbovePSAR) {
                description = `上漲趨勢 (${priceStr}>${psarStr})`;
                trend = 'bullish';
            } else {
                description = `下跌趨勢 (${priceStr}<${psarStr})`;
                trend = 'bearish';
            }
        } else {
            if (isAbovePSAR) {
                description = `上漲趨勢 (${priceStr}>${psarStr})`;
                trend = 'bullish';
            } else {
                description = `下跌趨勢 (${priceStr}<${psarStr})`;
                trend = 'bearish';
            }
        }

        return { description, trend };
    }

    // Analyze MFI indicator
    analyzeMFI(mfi, hasData) {
        if (!hasData) {
            return { description: 'MFI數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';
        const mfiStr = mfi.toFixed(2);

        if (mfi >= 80) {
            description = `MFI超買 (≥80)(${mfiStr})`;
            trend = 'overbought';
        } else if (mfi <= 20) {
            description = `MFI超賣 (≤20)(${mfiStr})`;
            trend = 'oversold';
        } else if (mfi > 50) {
            description = `MFI偏多 (>50)(${mfiStr})`;
            trend = 'bullish';
        } else if (mfi < 50) {
            description = `MFI偏空 (<50)(${mfiStr})`;
            trend = 'bearish';
        } else {
            description = `MFI中性 (≈50)(${mfiStr})`;
            trend = 'neutral';
        }

        return { description, trend };
    }

    // Analyze ATR indicator
    analyzeATR(atr, hasData) {
        if (!hasData) {
            return { description: 'ATR數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';
        const atrStr = atr.toFixed(2);

        // ATR is a volatility indicator, higher values indicate higher volatility
        if (atr > 100) {
            description = `高波動 (ATR:${atrStr})`;
            trend = 'high_volatility';
        } else if (atr > 50) {
            description = `中等波動 (ATR:${atrStr})`;
            trend = 'medium_volatility';
        } else {
            description = `低波動 (ATR:${atrStr})`;
            trend = 'low_volatility';
        }

        return { description, trend };
    }

    // Analyze DMI indicator
    analyzeDMI(adx, pdi, mdi, hasData) {
        if (!hasData) {
            return { description: 'DMI數據未獲取', trend: 'neutral' };
        }

        let description = '';
        let trend = 'neutral';
        const adxStr = adx.toFixed(2);
        const pdiStr = pdi.toFixed(2);
        const mdiStr = mdi.toFixed(2);

        // Determine trend strength based on ADX value
        let strength = '';
        if (adx >= 50) {
            strength = '極強';
        } else if (adx >= 25) {
            strength = '強勢';
        } else if (adx >= 20) {
            strength = '中等';
        } else {
            strength = '弱勢';
        }

        // Determine trend direction based on PDI and MDI
        if (pdi > mdi) {
            description = `上漲${strength} ADX:${adxStr} (PDI:${pdiStr}>MDI:${mdiStr})`;
            if (adx >= 25) {
                trend = 'strong_bullish';
            } else {
                trend = 'weak_bullish';
            }
        } else if (mdi > pdi) {
            description = `下跌${strength} ADX:${adxStr} (MDI:${mdiStr}>PDI:${pdiStr})`;
            if (adx >= 25) {
                trend = 'strong_bearish';
            } else {
                trend = 'weak_bearish';
            }
        } else {
            description = `盤整${strength} ADX:${adxStr} (PDI:${pdiStr}≈MDI:${mdiStr})`;
            trend = 'sideways';
        }

        return { description, trend };
    }
}

// Export for use in other files
window.TaapiClientBulk = TaapiClientBulk;
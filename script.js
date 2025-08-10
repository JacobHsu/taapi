// Dynamic API key management
let storage;
let apiClient;

function getApiKey() {
    // Check localStorage first, then config.js
    const savedKey = localStorage.getItem('taapi_api_key');
    if (savedKey && savedKey !== 'YOUR_TAAPI_API_KEY_HERE') {
        return savedKey;
    }
    
    const configKey = window.CONFIG ? window.CONFIG.TAAPI_API_KEY : 'YOUR_TAAPI_API_KEY_HERE';
    if (configKey && configKey !== 'YOUR_TAAPI_API_KEY_HERE') {
        return configKey;
    }
    
    return null;
}

function showApiKeyPanel() {
    const panel = document.getElementById('api-key-panel');
    const controls = document.querySelector('.controls');
    panel.style.display = 'block';
    controls.style.display = 'none';
}

function hideApiKeyPanel() {
    const panel = document.getElementById('api-key-panel');
    const controls = document.querySelector('.controls');
    panel.style.display = 'none';
    controls.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', async () => {
    const dataContainer = document.getElementById('data-container');
    const refreshButton = document.getElementById('refresh-button');
    const lastUpdateElement = document.getElementById('last-update');
    
    // Setup API key input handlers
    const apiKeyInput = document.getElementById('api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    
    saveApiKeyBtn.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (apiKey) {
            localStorage.setItem('taapi_api_key', apiKey);
            apiClient = new TaapiClientBulk(apiKey);
            hideApiKeyPanel();
            loadAndDisplayData();
        }
    });
    
    // Check if API key is available
    const apiKey = getApiKey();
    if (!apiKey) {
        showApiKeyPanel();
        return;
    }

    // Initialize storage and API client
    storage = new MACDStorage();
    apiClient = new TaapiClientBulk(apiKey);
    
    

    try {
        await storage.init();
        await loadAndDisplayData();
        
        // Set up refresh button
        refreshButton.addEventListener('click', async () => {
            refreshButton.disabled = true;
            refreshButton.textContent = '更新中...';
            
            try {
                await fetchAndStoreData();
                await loadAndDisplayData();
            } catch (error) {
                console.error('Error refreshing data:', error);
                hideProgressBar();
                if (error.message.includes('rate-limit') || error.message.includes('429')) {
                    showError(`API 調用頻率限制，請稍後再試: ${error.message}`);
                } else {
                    showError(`更新數據失敗: ${error.message}`);
                }
            } finally {
                refreshButton.disabled = false;
                refreshButton.textContent = '一鍵更新所有指標 (使用 Bulk API)';
            }
        });

        

    } catch (error) {
        console.error('Error initializing application:', error);
        showError(`初始化失敗: ${error.message}`);
    }

    // Setup auto-update timer
    setupAutoUpdate();
});

// Auto-update function - checks every 5 minutes if new hourly data is needed
function setupAutoUpdate() {
    console.log('🔄 自動更新系統已啟動，每5分鐘檢查一次');
    
    setInterval(async () => {
        try {
            const needsUpdate = await storage.needsHourlyUpdate();
            if (needsUpdate) {
                console.log('🕐 檢測到新的整點時間，自動獲取最新數據...');
                
                // Show auto-update notification
                const dataContainer = document.getElementById('data-container');
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #007bff;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                    z-index: 1000;
                    font-size: 14px;
                `;
                notification.textContent = '🔄 自動更新中...';
                document.body.appendChild(notification);
                
                // Perform update
                await loadAndDisplayData();
                
                // Remove notification after 3 seconds
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 3000);
                
                console.log('✅ 自動更新完成');
            }
        } catch (error) {
            console.error('❌ 自動更新失敗:', error);
        }
    }, 5 * 60 * 1000); // Check every 5 minutes
}

async function loadAndDisplayData() {
    const dataContainer = document.getElementById('data-container');
    const lastUpdateElement = document.getElementById('last-update');

    try {
        // Get all existing data first
        let allData = await storage.getData();
        allData = allData.filter(item => item.id !== 'lastUpdate');

        // Check if we need to fetch new hourly data
        const needsUpdate = await storage.needsHourlyUpdate();
        
        if (needsUpdate) {
            // Need to fetch new data for current hour
            dataContainer.innerHTML = '<p class="loading">檢測到新的整點時間，正在獲取最新數據...</p>';
            
            try {
                await fetchAndStoreData();
                // Refresh data after fetching
                allData = await storage.getData();
                allData = allData.filter(item => item.id !== 'lastUpdate');
            } catch (error) {
                if (allData.length > 0) {
                    // Use existing data if available
                    console.warn('Failed to fetch new data, using existing data:', error);
                    if (error.message.includes('rate-limit') || error.message.includes('429')) {
                        showWarning('API 調用頻率限制，顯示現有數據');
                    } else {
                        showWarning('無法獲取最新數據，顯示現有數據');
                    }
                } else {
                    throw error;
                }
            }
        } else {
            console.log('數據是最新的，無需更新');
        }

        if (allData.length === 0) {
            dataContainer.innerHTML = '<p class="loading">沒有可用的數據。</p>';
            return;
        }

        // Sort by timestamp descending (newest first) and display all data
        allData.sort((a, b) => b.timestamp - a.timestamp);
        displayTable(allData);
        
        // Update last update time and data count
        const lastUpdate = await storage.getLastUpdate();
        if (lastUpdate) {
            const updateDate = new Date(lastUpdate * 1000);
            lastUpdateElement.textContent = `最後更新: ${updateDate.toLocaleString('zh-TW')} (共${allData.length}筆數據)`;
        }

    } catch (error) {
        console.error('Error loading data:', error);
        showError(`載入數據失敗: ${error.message}`);
    }
}

async function fetchAndStoreData() {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error('Please set your Taapi.io API key first');
    }

    console.log('Fetching data with API key:', apiKey.substring(0, 20) + '...'); // Debug log
    console.log('Using config:', window.CONFIG); // Debug log
    console.log('Using API client:', apiClient.constructor.name); // Debug log
    
    // Show progress bar
    showProgressBar();
    
    try {
        // Check if this is initial load (no existing data) or incremental update
        const existingData = await storage.getData();
        const hasExistingData = existingData.filter(item => item.id !== 'lastUpdate').length > 0;
        
        let processedData;
        if (hasExistingData) {
            // Incremental update - fetch only latest data
            console.log('Fetching incremental update (1 record)...');
            processedData = await apiClient.fetchLatestData('ETH/USDT', '1h', updateProgress);
        } else {
            // Initial load - fetch historical data
            console.log('Initial load - fetching historical data (5 records)...');
            processedData = await apiClient.fetchInitialData('ETH/USDT', '1h', updateProgress);
        }

        // --- DEBUG --- Check the data right after processing
        console.log('Data received from apiClient before storing:', JSON.stringify(processedData, null, 2));
        // --- END DEBUG ---
        
        console.log('Received processed data:', processedData); // Debug log
        
        if (!processedData || processedData.length === 0) {
            throw new Error('No data received from API - check console for details');
        }
        
        await storage.storeData(processedData);
        await storage.setLastUpdate();
        console.log('Data stored successfully, count:', processedData.length); // Debug log
        
        // Hide progress bar
        hideProgressBar();
    } catch (error) {
        // Hide progress bar on error
        hideProgressBar();
        throw error; // Re-throw the error for upper level handling
    }
}

function displayTable(macdData) {
    const dataContainer = document.getElementById('data-container');
    
    // Create table
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Table header - Time, Price, KDJ, RSI, MACD, BBands, Keltner Channels, Squeeze, PSAR, Supertrend order
    const headerRow = document.createElement('tr');
    ['時間', '價格', 'KDJ說明', 'RSI說明', 'MACD說明', 'PSAR', 'BBands', 'Keltner', 'Squeeze', 'Supertrend'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    macdData.forEach(item => {
        const row = document.createElement('tr');
        const date = new Date(item.timestamp * 1000);
        
        // Format date to a readable string
        const formattedDate = date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        // Create cells with trend-based coloring
        const cells = [
            { text: formattedDate, trend: null },
            { text: (typeof item.price === 'number' ? '$' + item.price.toFixed(2) : '載入中...'), trend: null },
            { text: item.kdjDescription || 'KDJ中性', trend: item.kdjTrend },
            { text: item.rsiDescription || 'RSI中性', trend: item.rsiTrend },
            { text: item.macdDescription || 'MACD中性', trend: item.macdTrend },
            { text: item.psarDescription || 'PSAR中性', trend: item.psarTrend },
            { text: item.bbandsDescription || 'BBands中性', trend: item.bbandsTrend },
            { text: item.keltnerDescription || 'Keltner中性', trend: item.keltnerTrend },
            { text: item.squeeze ? 'True' : 'False', trend: item.squeeze ? 'squeeze' : null },
            { text: item.supertrendAdvice || '無', trend: item.supertrendAdvice ? 'supertrend' : null }
        ];

        cells.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell.text;
            
            // Special color handling for specific KDJ signals
            if (cell.text.includes('KDJ金叉 (K線上穿D線)')) {
                td.style.color = '#FFD700'; // Gold color for golden cross
                td.style.fontWeight = 'bold';
            } else if (cell.text.includes('KDJ死叉 (K線下穿D線)')) {
                td.style.color = '#000000'; // Black color for death cross
                td.style.fontWeight = 'bold';
            }
            // Special color handling for PSAR reversal signals
            else if (cell.text.includes('PSAR反轉')) {
                if (cell.text.includes('轉多頭')) {
                    td.style.color = '#FFD700'; // Gold for bullish reversal
                    td.style.fontWeight = 'bold';
                    td.style.textDecoration = 'underline'; // Special highlighting for reversal
                } else if (cell.text.includes('轉空頭')) {
                    td.style.color = '#FF1493'; // Deep pink for bearish reversal
                    td.style.fontWeight = 'bold';
                    td.style.textDecoration = 'underline'; // Special highlighting for reversal
                }
            }
            // Apply color based on trend for other cases
            else if (cell.trend) {
                // BBands and Keltner Channels specific styling (same logic)
                if (cell.trend === 'upper_breakout') {
                    td.style.color = '#28a745'; // Green for upper band breakout
                    td.style.fontWeight = 'bold';
                } else if (cell.trend === 'lower_breakout') {
                    td.style.color = '#dc3545'; // Red for lower band breakout
                    td.style.fontWeight = 'bold';
                } else if (cell.trend === 'above_middle') {
                    td.style.color = '#28a745'; // Green for above middle band
                    td.style.fontWeight = 'normal';
                } else if (cell.trend === 'below_middle') {
                    td.style.color = '#dc3545'; // Red for below middle band
                    td.style.fontWeight = 'normal';
                } else if (cell.trend === 'at_middle') {
                    td.style.color = '#6c757d'; // Gray for at middle band
                    td.style.fontWeight = 'normal';
                }
                // General trend styling
                else if (cell.trend === 'bullish') {
                    td.style.color = '#28a745'; // Green for bullish
                    td.style.fontWeight = 'bold';
                } else if (cell.trend === 'bearish') {
                    td.style.color = '#dc3545'; // Red for bearish
                    td.style.fontWeight = 'bold';
                } else if (cell.trend === 'overbought') {
                    td.style.color = '#fd7e14'; // Orange for overbought
                    td.style.fontWeight = 'bold';
                } else if (cell.trend === 'oversold') {
                    td.style.color = '#6f42c1'; // Purple for oversold
                    td.style.fontWeight = 'bold';
                } else if (cell.trend === 'squeeze') {
                    td.style.color = '#17a2b8'; // Cyan for squeeze
                    td.style.fontWeight = 'bold';
                } else if (cell.trend === 'supertrend') {
                    // Color based on Supertrend advice
                    if (cell.text.toLowerCase().includes('buy') || cell.text.toLowerCase().includes('long')) {
                        td.style.color = '#28a745'; // Green for buy signals
                        td.style.fontWeight = 'bold';
                    } else if (cell.text.toLowerCase().includes('sell') || cell.text.toLowerCase().includes('short')) {
                        td.style.color = '#dc3545'; // Red for sell signals
                        td.style.fontWeight = 'bold';
                    } else {
                        td.style.color = '#6c757d'; // Gray for neutral
                        td.style.fontWeight = 'bold';
                    }
                }
            }
            
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    dataContainer.innerHTML = '';
    dataContainer.appendChild(table);
}

function showError(message) {
    const dataContainer = document.getElementById('data-container');
    dataContainer.innerHTML = `<p class="error">${message}</p>`;
}

function showWarning(message) {
    const dataContainer = document.getElementById('data-container');
    const warning = document.createElement('p');
    warning.className = 'warning';
    warning.textContent = message;
    dataContainer.insertBefore(warning, dataContainer.firstChild);
}

// Progress bar functions
function showProgressBar() {
    const progressContainer = document.getElementById('progress-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressContainer.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = '準備載入...';
}

function hideProgressBar() {
    const progressContainer = document.getElementById('progress-container');
    setTimeout(() => {
        progressContainer.style.display = 'none';
    }, 1000); // Hide after 1 second to show completion
}

function updateProgress(currentStep, totalSteps, message) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    const percentage = Math.round((currentStep / totalSteps) * 100);
    progressFill.style.width = percentage + '%';
    progressText.textContent = `${message} (${currentStep}/${totalSteps})`;
}



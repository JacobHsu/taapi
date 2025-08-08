// IndexedDB storage utility for MACD data
class MACDStorage {
    constructor() {
        this.dbName = 'MACDDatabase';
        this.dbVersion = 1;
        this.storeName = 'macdData';
        this.db = null;
    }

    // Initialize IndexedDB
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                reject(new Error('Failed to open IndexedDB'));
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object store if it doesn't exist
                if (!db.objectStoreNames.contains(this.storeName)) {
                    const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    // Store data cumulatively (merge with existing data)
    async storeData(data) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);

            // Add/update new data without clearing existing data
            const addPromises = data.map((item, index) => {
                return new Promise((addResolve, addReject) => {
                    // Use timestamp as unique ID for data points
                    const dataWithId = { ...item, id: item.timestamp || `data-${index}` };
                    const addRequest = store.put(dataWithId); // Use put to overwrite if ID exists
                    
                    addRequest.onsuccess = () => addResolve();
                    addRequest.onerror = () => addReject(addRequest.error);
                });
            });

            Promise.all(addPromises)
                .then(() => resolve())
                .catch(reject);

            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Retrieve all MACD data
    async getData() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => {
                // Sort by timestamp
                const data = request.result.sort((a, b) => a.timestamp - b.timestamp);
                resolve(data);
            };

            request.onerror = () => reject(request.error);
        });
    }

    // Check if we need to fetch new data based on hourly intervals
    async needsHourlyUpdate() {
        try {
            const data = await this.getData();
            if (data.length === 0) return true; // No data, need initial fetch

            // Get latest data timestamp
            const latestTimestamp = Math.max(...data.filter(item => item.id !== 'lastUpdate').map(item => item.timestamp));
            
            // Calculate current hour mark and latest data hour mark
            const now = Math.floor(Date.now() / 1000);
            const currentHourMark = Math.floor(now / 3600) * 3600; // Current hour start
            const latestDataHourMark = Math.floor(latestTimestamp / 3600) * 3600; // Latest data hour start
            
            console.log('Current hour mark:', new Date(currentHourMark * 1000));
            console.log('Latest data hour mark:', new Date(latestDataHourMark * 1000));
            console.log('Needs update:', latestDataHourMark < currentHourMark);
            
            // Need update if we've crossed into a new hour
            return latestDataHourMark < currentHourMark;
        } catch (error) {
            console.error('Error checking hourly update need:', error);
            return true; // Default to updating on error
        }
    }

    // Get the latest data timestamp
    async getLatestTimestamp() {
        try {
            const data = await this.getData();
            const dataOnly = data.filter(item => item.id !== 'lastUpdate');
            if (dataOnly.length === 0) return 0;
            
            return Math.max(...dataOnly.map(item => item.timestamp));
        } catch (error) {
            console.error('Error getting latest timestamp:', error);
            return 0;
        }
    }

    // Legacy method for backward compatibility
    async hasRecentData() {
        return !(await this.needsHourlyUpdate());
    }

    // Store last update timestamp
    async setLastUpdate() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            
            const updateInfo = {
                id: 'lastUpdate',
                timestamp: Math.floor(Date.now() / 1000)
            };

            const request = store.put(updateInfo);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Get last update timestamp
    async getLastUpdate() {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.get('lastUpdate');

            request.onsuccess = () => {
                resolve(request.result ? request.result.timestamp : null);
            };

            request.onerror = () => reject(request.error);
        });
    }
}

// Export for use in other files
window.MACDStorage = MACDStorage;
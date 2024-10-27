/**
 * kando-storage - 1.0.0
 * @author A.S Nasseri
 * @license The MIT License (MIT)
 * @copyright Copyright (c) 2022 A.S Nasseri
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * */
;(function (global) {
    const storageMap = new Map();
    let cleanupInterval = null;

    // Test if localStorage/sessionStorage is available
    const isAvailable = (type) => {
        try {
            const storage = type === 'local' ? localStorage : sessionStorage;
            const testKey = '__storage_test__';
            storage.setItem(testKey, testKey);
            storage.removeItem(testKey);
            return true;
        } catch {
            return false;
        }
    };

    // Parse storage type and namespace path
    const parseStorageType = (typePath) => {
        const [type, ...pathParts] = typePath.split('.');
        return { type, path: pathParts.join('.') };
    };

    // Choose storage (local, session, or Map fallback)
    const getStorage = (type) => {
        if (type === 'local' && isAvailable('local')) return localStorage;
        if (type === 'session' && isAvailable('session')) return sessionStorage;
        return storageMap;
    };

    // Get nested value in an object, handles array indices
    const getNestedValue = (obj, path) => path.split('.').reduce((acc, key) => {
        if (acc == null) return;
        const arrayMatch = key.match(/(.+)\[(\d+)\]/);
        return arrayMatch ? acc[arrayMatch[1]]?.[arrayMatch[2]] : acc[key];
    }, obj);

    // Set nested value in an object, supporting array indices
    const setNestedValue = (obj, path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((acc, key) => {
            const arrayMatch = key.match(/(.+)\[(\d+)\]/);
            if (arrayMatch) {
                acc[arrayMatch[1]] = acc[arrayMatch[1]] || [];
                return acc[arrayMatch[1]][arrayMatch[2]] = acc[arrayMatch[1]][arrayMatch[2]] || {};
            }
            return acc[key] = acc[key] || {};
        }, obj);

        const arrayMatch = lastKey.match(/(.+)\[(\d+)\]/);
        if (arrayMatch) {
            target[arrayMatch[1]] = target[arrayMatch[1]] || [];
            target[arrayMatch[1]][arrayMatch[2]] = value;
        } else {
            target[lastKey] = value;
        }
    };

    // Remove nested value in an object, supporting array indices
    const removeNestedValue = (obj, path) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const parent = keys.reduce((acc, key) => {
            const arrayMatch = key.match(/(.+)\[(\d+)\]/);
            return arrayMatch ? acc[arrayMatch[1]]?.[arrayMatch[2]] : acc[key];
        }, obj);

        if (parent) {
            const arrayMatch = lastKey.match(/(.+)\[(\d+)\]/);
            if (arrayMatch) parent[arrayMatch[1]].splice(arrayMatch[2], 1);
            else delete parent[lastKey];
        }
    };

    // Helper to remove a namespace completely, including the root key
    const clearNamespace = (storage, rootKey) => {
        storage.removeItem(rootKey);
    };

    // Handle session expiration logic
    const isExpired = (expiresAt) => expiresAt && Date.now() > expiresAt;

    // Session storage cleanup
    const sessionCleanup = () => {
        const storage = getStorage('session');
        let hasExpirations = false;

        Array.from({ length: storage.length }, (_, i) => storage.key(i))
            .filter((key) => key && key.endsWith('.expires'))
            .forEach((key) => {
                const mainKey = key.replace('.expires', '');
                const expiresAt = parseInt(storage.getItem(key), 10);
                if (isExpired(expiresAt)) {
                    storage.removeItem(mainKey);  
                    storage.removeItem(key);      
                } else {
                    hasExpirations = true;
                }
            });

        if (!hasExpirations && cleanupInterval) {
            clearInterval(cleanupInterval);
            cleanupInterval = null;
        }
    };

    // Start the cleanup interval when needed
    const startCleanup = () => {
        if (!cleanupInterval) cleanupInterval = setInterval(sessionCleanup, 30000);
    };

    // check for expiration and remove session from storage
    const handleExpiration = (storage, rootKey, expiration) => {
        if (expiration) {
            const expiresAt = Date.now() + expiration * 1000;
            storage.setItem(`${rootKey}.expires`, expiresAt);
            startCleanup();
        }
    };

    // Core storage function
    const kando = (typePath, data = undefined, expiration = null) => {
        const { type, path } = parseStorageType(typePath);
        const storage = getStorage(type);
        const rootKey = path.split('.')[0];
        const rootData = JSON.parse(storage.getItem(rootKey) || '{}');

        if (type === 'session' && data === undefined) {
            const expiresAt = parseInt(storage.getItem(`${rootKey}.${path}.expires`), 10);
            if (isExpired(expiresAt)) {
                removeNestedValue(rootData, path);
                storage.setItem(rootKey, JSON.stringify(rootData));
                storage.removeItem(`${rootKey}.${path}.expires`);
                return undefined;
            }
            return getNestedValue(rootData, path);
        }

        if (data === undefined) return getNestedValue(rootData, path);

        if (data === null) {
            path === rootKey ? clearNamespace(storage, rootKey) : removeNestedValue(rootData, path);
            storage.setItem(rootKey, JSON.stringify(rootData));
        } else {
            setNestedValue(rootData, path, data);
            storage.setItem(rootKey, JSON.stringify(rootData));
            if (type === 'session') handleExpiration(storage, rootKey, expiration);
        }
    };

    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = kando;
    } else {
        global.kando = kando;
    }
})(this);

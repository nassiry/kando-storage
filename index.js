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
        return storageMap; // Fallback for unsupported environments or types
    };

    // Get nested value in an object
    const getNestedValue = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);

    // Set nested value in an object
    const setNestedValue = (obj, path, value) => {
        const keys = path.split('.');
        keys.slice(0, -1).reduce((acc, key) => acc[key] = acc[key] || {}, obj)[keys.pop()] = value;
    };

    // Remove nested value in an object
    const removeNestedValue = (obj, path) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const parent = keys.reduce((acc, key) => acc?.[key], obj);
        if (parent) delete parent[lastKey];
    };

    // Helper to remove a namespace completely, including the root key
    const clearNamespace = (storage, rootKey) => {
        storage.removeItem(rootKey); // Remove the entire root key from storage
    };

    // Core storage function
    const kando = (typePath, data = undefined, expiration = null) => {
        const { type, path } = parseStorageType(typePath);
        const storage = getStorage(type);
        const rootKey = path.split('.')[0];
        const rootData = JSON.parse(storage.getItem(rootKey) || '{}');

        // Get operation
        if (data === undefined) return getNestedValue(rootData, path);

        // Remove operation (null data clears namespace or specific key)
        if (data === null) {
            if (path === rootKey) {
                clearNamespace(storage, rootKey); // Remove entire namespace
            } else {
                removeNestedValue(rootData, path); // Remove specific nested key
                storage.setItem(rootKey, JSON.stringify(rootData));
            }
        } else {
            // Set/update operation
            setNestedValue(rootData, path, data);
            storage.setItem(rootKey, JSON.stringify(rootData));
            if (expiration && type === 'session') storage.setItem(`${path}.expires`, Date.now() + expiration * 1000);
        }
    };


    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = kando;
    } else {
        global.kando = kando;
    }
})(this);

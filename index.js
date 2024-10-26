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
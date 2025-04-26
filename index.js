/**
 Copyright (c) 2024 A.S Nasseri
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @see https://github.com/nassiry/kando-storage
 */
(function (global) {
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

  // Extract array match (key[index]) using regex
  const extractArrayMatch = (key) => {
    const match = key.match(/(.+)\[(\d+)\]/);
    return match ? { baseKey: match[1], index: parseInt(match[2], 10) } : null;
  };

  // Get the appropriate storage (local, session, or Map fallback)
  const getStorage = (type) => {
    if (type === 'local' && isAvailable('local')) return localStorage;
    if (type === 'session' && isAvailable('session')) return sessionStorage;

    return {
      getItem: (key) => (storageMap.has(key) ? storageMap.get(key) : null),
      setItem: (key, value) => storageMap.set(key, value),
      removeItem: (key) => storageMap.delete(key),
      clear: () => storageMap.clear(),
      key: (index) => Array.from(storageMap.keys())[index] || null,
      get length() {
        return storageMap.size;
      },
    };
  };

  // Retrieve nested value from an object (supports array indices)
  const getValues = (obj, path) =>
    path.split('.').reduce((acc, key) => {
      if (acc == null) return;
      const match = extractArrayMatch(key);
      return match ? acc[match.baseKey]?.[match.index] : acc[key];
    }, obj);

  //Set nested value in an object (supports array indices)
  const setValues = (obj, path, value) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => {
      const match = extractArrayMatch(key);
      if (match) {
        acc[match.baseKey] = acc[match.baseKey] || [];
        return (acc[match.baseKey][match.index] =
          acc[match.baseKey][match.index] || {});
      }
      return (acc[key] = acc[key] || {});
    }, obj);

    const match = extractArrayMatch(lastKey);
    if (match) {
      target[match.baseKey] = target[match.baseKey] || [];
      target[match.baseKey][match.index] = value;
    } else {
      target[lastKey] = value;
    }
  };

  // Remove nested value from an object (supports array indices)
  const removeValues = (obj, path) => {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const parent = keys.reduce((acc, key) => {
      const match = extractArrayMatch(key);
      return match ? acc[match.baseKey]?.[match.index] : acc[key];
    }, obj);

    if (parent) {
      const match = extractArrayMatch(lastKey);
      if (match) parent[match.baseKey].splice(match.index, 1);
      else delete parent[lastKey];
    }
  };

  // Clear a namespace from storage
  const clearNamespace = (storage, rootKey) => storage.removeItem(rootKey);

  // Check if a session key has expired
  const isExpired = (expiresAt) => expiresAt && Date.now() > expiresAt;

  // Cleanup expired session keys
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

  // Start session cleanup interval
  const startCleanup = () => {
    if (!cleanupInterval) cleanupInterval = setInterval(sessionCleanup, 15000);
  };

  // Handle session expiration logic
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
      const expiresAt = parseInt(
        storage.getItem(`${rootKey}.${path}.expires`),
        10,
      );
      if (isExpired(expiresAt)) {
        removeValues(rootData, path);
        storage.setItem(rootKey, JSON.stringify(rootData));
        storage.removeItem(`${rootKey}.${path}.expires`);
        return undefined;
      }
      return getValues(rootData, path);
    }

    if (data === undefined) return getValues(rootData, path);

    if (data === null) {
      if (path === rootKey) {
        clearNamespace(storage, rootKey);
      } else {
        removeValues(rootData, path);
        if (Object.keys(rootData).length === 0) {
          clearNamespace(storage, rootKey);
        } else {
          storage.setItem(rootKey, JSON.stringify(rootData));
        }
      }
    } else {
      setValues(rootData, path, data);
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

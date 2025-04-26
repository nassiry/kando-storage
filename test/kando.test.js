/**
 Copyright (c) 2024 A.S Nasseri
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @see https://github.com/nassiry/kando-storage
 */

global.localStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (i) => Object.keys(store)[i] || null,
  };
})();

global.sessionStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (i) => Object.keys(store)[i] || null,
  };
})();

const kando = require('../index');

test('sets and gets a simple value', () => {
  kando('local.appSettings.theme', 'dark');
  expect(kando('local.appSettings.theme')).toBe('dark');
});

test('sets and gets an object', () => {
  kando('local.user.profile', { name: 'Alice', age: 30 });
  expect(kando('local.user.profile')).toEqual({ name: 'Alice', age: 30 });
});

test('updates a nested property', () => {
  kando('local.user.profile.name', 'Alice Johnson');
  expect(kando('local.user.profile')).toEqual({
    name: 'Alice Johnson',
    age: 30,
  });
});

test('removes a nested key', () => {
  kando('local.user.profile.name', null);
  expect(kando('local.user.profile')).toEqual({ age: 30 });
});

test('handles arrays', () => {
  kando('local.user.permissions', ['read', 'write', 'delete']);
  kando('local.user.permissions[1]', 'view');
  expect(kando('local.user.permissions')).toEqual(['read', 'view', 'delete']);
  kando('local.user.permissions[1]', null);
  expect(kando('local.user.permissions')).toEqual(['read', 'delete']);
});

test('clears namespace', () => {
  kando('local.user', null);
  expect(kando('local.user')).toBe(undefined);
});

test('uses fallback memory storage when localStorage is not available', () => {
  const original = global.localStorage;
  delete global.localStorage;

  // Clear the require cache to reload with new global
  jest.resetModules();
  const kandoFallback = require('../index');

  kandoFallback('local.fallbackTest', 'value');
  expect(kandoFallback('local.fallbackTest')).toBe('value');

  global.localStorage = original;
});

test('returns undefined for deeply invalid path', () => {
  expect(kando('local.some.deep.path.that.does.not.exist')).toBe(undefined);
});

test('handles non-existing array index gracefully', () => {
  kando('local.example.array', ['a', 'b']);
  expect(kando('local.example.array[5]')).toBe(undefined);
});

test('clears expired session key manually', () => {
  kando('session.expiringKey', 'willExpire', 1);
  const expiresKey = 'expiringKey.tempKey.expires';
  const rootKey = 'expiringKey';
  sessionStorage.setItem(
    `${rootKey}.tempKey.expires`,
    (Date.now() - 5000).toString(),
  );

  expect(kando('session.expiringKey.tempKey')).toBe(undefined);
});

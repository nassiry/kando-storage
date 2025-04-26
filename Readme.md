<div align="center">

# Kando

[![Codecov](https://codecov.io/gh/nassiry/kando-storage/branch/main/graph/badge.svg)](https://codecov.io/gh/nassiry/kando-storage)
![Tests](https://github.com/nassiry/kando-storage/actions/workflows/test.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/kando-storage.svg)
![Total Downloads](https://img.shields.io/npm/dt/kando-storage.svg)
![License](https://img.shields.io/npm/l/kando-storage.svg)

</div>

**Kando** is a versatile and lightweight `2kb` gzip storage utility that simplifies data management in both `localStorage` and `sessionStorage`. Unlike other storage packages, **Kando** offers an intuitive API that enables effortless manipulation of `single values`, `arrays`, and `objects`, while providing robust support for nested paths, namespaces, and data expiration in session storage. Designed for compatibility with both browser and `Node.js` environments, Kando includes an `in-memory` fallback for situations where storage `APIs` are not available. Whether you're building a simple web application or a complex `Node.js` project, Kando enhances your storage experience with its flexible and user-friendly approach.

- **Cross-Environment Support:** Use in both browser and Node.js environments, with an automatic `Map` fallback.
- **Namespace Management:** Organize storage by namespaces, simplifying data retrieval and removal.
- **Nested Path Access:** Access deeply nested properties with dot notation.
- **Data Expiration:** Set expiration times for session data.
- **Flexible Storage:** Supports single `values`, `arrays`, and `objects`.
- **TypeScript Support:** Fully typed API with definitions included for great IDE experience and type safety.

## Table Of Contents

1. [Installation](#installation)
   - [Node.js (CommonJS / TypeScript)](#1-nodejs-commonjs--typescript)
   - [Browser](#2-browser)
2. [Basic Usage](#basic-usage)
   - [Node.js (CommonJS)](#nodejs-commonjs)
   - [Node.js (TypeScript)](#nodejs-typescript)
3. [Setting and Retrieving Data](#setting-and-retrieving-data)
   - [Single Values](#2-single-values)
   - [Objects and Arrays](#2-objects-and-arrays)
   - [Nested Properties](#3-nested-properties)
4. [Clearing Data Examples](#clearing-data-examples)
   - [Removing Specific Keys](#1-removing-specific-keys)
   - [Clearing an Entire Namespace](#2-clearing-an-entire-namespace)
5. [Session Storage with Expiration](#session-storage-with-expiration)
6. [Advanced Examples](#advanced-examples)
   - [Namespaced Data with Nested Objects and Arrays](#1-namespaced-data-with-nested-objects-and-arrays)
7. [Using Kando with Storage Fallback](#using-kando-with-storage-fallback)
8. [API Reference](#api-reference)
   - [Parameters](#parameters)
   - [Return Value](#return-value)
9. [Compatibility Check](#compatibility-check)
   - [Browser/Nodejs Support](#browsernodejs-support)
10. [Contributing](#contributing)
11. [Changelog](#changelog)
12. [License](#license)

## Installation

- ### 1. Node.js (CommonJS / TypeScript)

  Install with npm:

  ```bash
  npm install kando-storage
  ```

- ### 2. Browser
  ```html
  <script src="path/to/kando.js"></script>
  <!-- Access via global kando -->
  ```

## Basic Usage

Kando offers flexible functions for setting, retrieving, and deleting data, all with dot notation for accessing deeply nested properties.

- ### Node.js (CommonJS)

  ```javascript
  const kando = require('kando-storage');
  ```

- ### Node.js (TypeScript)
  ```javascript
  import kando from 'kando-storage';
  ```

## Setting and Retrieving Data

### 2. Single Values

```javascript
// Set a single value in local storage
kando('local.appSettings.theme', 'dark');

// Retrieve a single value
const theme = kando('local.appSettings.theme'); // 'dark'
```

### 2. Objects and Arrays

```javascript
// Set an object
kando('local.user.profile', { name: 'Alice', age: 30 });

// Retrieve an object
const profile = kando('local.user.profile'); // { name: 'Alice', age: 30 }

// Set an array
kando('local.user.permissions', ['read', 'write']);

// Retrieve an array
const permissions = kando('local.user.permissions'); // ['read', 'write']
```

### 3. Nested Properties

```javascript
// Update a nested property within an object
kando('local.user.profile.name', 'Alice Johnson');

// Retrieve the updated profile
const updatedProfile = kando('local.user.profile'); // { name: 'Alice Johnson', age: 30 }
```

## Clearing Data Examples

Kando allows you to remove specific keys or entire namespaces with ease.

### 1. Removing Specific Keys

```javascript
// Remove a specific key
kando('local.user.profile.name', null); // Only removes 'name' from profile

// Example array: ['read', 'write', 'delete']
kando('local.user.permissions', ['read', 'write', 'delete']);

// Example update/replace array key
kando('local.user.permissions[1]', 'view');

// Remove an element from the array
kando('local.user.permissions[1]', null); // Now permissions will be ['read', 'delete']
```

### 2. Clearing an Entire Namespace

```javascript
// Remove all data under the 'user' namespace
kando('local.user', null);
```

## Session Storage with Expiration

For session storage, Kando supports setting an expiration time in seconds.

```javascript
// Store a session value with a 60-second expiration
kando('session.tempData', 'Temporary Data', 60);

// Retrieve it before expiration
const tempData = kando('session.tempData'); // 'Temporary Data'

// After 60 seconds, it will no longer be available
```

## Advanced Examples

### 1. Namespaced Data with Nested Objects and Arrays

```javascript
// Store a namespaced object with arrays
kando('local.appConfig', {
  theme: 'dark',
  languages: ['en', 'es', 'fr'],
  settings: { notifications: true, autoSave: false },
});

// Access nested array item
const languages = kando('local.appConfig.languages'); // ['en', 'es', 'fr']

// Update a setting within the nested object
kando('local.appConfig.settings.notifications', false);

// Add a new language to the languages array
kando('local.appConfig.languages[3]', 'de'); // ['en', 'es', 'fr', 'de']
```

## Using Kando with Storage Fallback

If `localStorage` or `sessionStorage` is unsupported (such as in certain `Node.js` environments), Kando automatically falls back to an in-memory `Map`.

```javascript
// This will use the Map if storage APIs are unavailable
kando('local.userData', { id: 1, name: 'Bob' });
const userData = kando('local.userData'); // { id: 1, name: 'Bob' }
```

# API Reference

`kando(typePath, data = undefined, expiration = null)`
The core Kando function for all storage operations. Allows setting, retrieving, and removing data with support for namespaces and expiration.

### Parameters

- `typePath` (`string`): A string that specifies the storage type (`local` or `session`) and the key path, separated by dots.
  - **Examples:** `'local.appSettings.theme'`, `'session.user.preferences.language'`.
- `data` (`any`, optional): The value to set at the specified path. Options include:
  - `undefined:` Retrieves the current value at the path.
  - `null:` Deletes the specified key or namespace.
  - **Any value:** Sets or updates data at the path.
- `expiration` (`number`, optional): Expiration time in seconds, only applicable for `sessionStorage`.

### Return Value

- **Retrieving Data:** Returns the current `value` if data is not provided.
- **Setting Data:** Returns `true` upon successful set or update.
- **Removing Data:** Returns `null` if the key or namespace does not exist.

## Compatibility Check

Kando internally verifies storage compatibility with `localStorage` and `sessionStorage`. If compatibility isn’t met, it defaults to an in-memory `Map`.

### Browser/Nodejs Support

| Chrome    | Firefox   | Safari    | Opera     | Edge      | Nodejs    |
| --------- | --------- | --------- | --------- | --------- | --------- |
| Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |

### Contributing

We welcome contributions! Please read the [Contributions Guid](CONTRIBUTING.md) to learn how to contribute.


## Changelog

See [Changelog](CHANGELOG.md) for release details.

### License

This package is open-source software licensed under the [MIT license](LICENSE).

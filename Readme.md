![npm](https://img.shields.io/npm/v/kando-storage.svg)
![Downloads](https://img.shields.io/npm/dm/kando-storage.svg)
![License](https://img.shields.io/npm/l/kando-storage.svg)
# Kando

**Kando** is a versatile and lightweight `2kb` gzip storage utility that simplifies data management in both `localStorage` and `sessionStorage`. Unlike other storage packages, **Kando** offers an intuitive API that enables effortless manipulation of single values, arrays, and objects, while providing robust support for nested paths, namespaces, and data expiration in session storage. Designed for compatibility with both browser and `Node.js` environments, Kando includes an `in-memory` fallback for situations where storage `APIs` are not available. Whether you're building a simple web application or a complex `Node.js` project, Kando enhances your storage experience with its flexible and user-friendly approach.

## Why Use Kando?

- **Cross-Environment Support**: Use in both browser and Node.js environments, with an automatic `Map` fallback.
- **Namespace Management**: Organize storage by namespaces, simplifying data retrieval and removal.
- **Nested Path Access**: Access deeply nested properties with dot notation.
- **Data Expiration**: Set expiration times for session data.
- **Flexible Storage**: Supports single `values`, `arrays`, and `objects`.

---

## Installation

### Node.js

Install Kando with npm:

```bash
npm install kando-storage
```
## Browser
```bash
<script src="path/to/kando.js"></script>
```
## Examples:
### Nodejs
```bash
const kando = require('kando-storage');
```

## Basic Usage Examples
Kando offers flexible functions for setting, retrieving, and deleting data, all with dot notation for accessing deeply nested properties.
### Setting and Retrieving Data
### Single Values
```bash
// Set a single value in local storage
kando('local.appSettings.theme', 'dark');

// Retrieve a single value
const theme = kando('local.appSettings.theme'); // 'dark'
```
### Objects and Arrays
```bash
// Set an object
kando('local.user.profile', { name: 'Alice', age: 30 });

// Retrieve an object
const profile = kando('local.user.profile'); // { name: 'Alice', age: 30 }

// Set an array
kando('local.user.permissions', ['read', 'write']);

// Retrieve an array
const permissions = kando('local.user.permissions'); // ['read', 'write']
```
### Nested Properties
```bash
// Update a nested property within an object
kando('local.user.profile.name', 'Alice Johnson');

// Retrieve the updated profile
const updatedProfile = kando('local.user.profile'); // { name: 'Alice Johnson', age: 30 }
```
## Clearing Data Examples
Kando allows you to remove specific keys or entire namespaces with ease.
### Removing Specific Keys
```bash
// Remove a specific key
kando('local.user.profile.name', null); // Only removes 'name' from profile

// Example array: ['read', 'write', 'delete']
kando('local.user.permissions', ['read', 'write', 'delete']);

// Example update/replace array key
kando('local.user.permissions[1]', 'view');

// Remove an element from the array
kando('local.user.permissions[1]', null); // Now permissions will be ['read', 'delete']

```
### Clearing an Entire Namespace
```bash
// Remove all data under the 'user' namespace
kando('local.user', null);
```
## Session Storage with Expiration
For session storage, Kando supports setting an expiration time in seconds.
```bash
// Store a session value with a 60-second expiration
kando('session.tempData', 'Temporary Data', 60);

// Retrieve it before expiration
const tempData = kando('session.tempData'); // 'Temporary Data'

// After 60 seconds, it will no longer be available
```
## Advanced Examples
### Namespaced Data with Nested Objects and Arrays
```bash
// Store a namespaced object with arrays
kando('local.appConfig', {
  theme: 'dark',
  languages: ['en', 'es', 'fr'],
  settings: { notifications: true, autoSave: false }
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
```bash
// This will use the Map if storage APIs are unavailable
kando('local.userData', { id: 1, name: 'Bob' });
const userData = kando('local.userData'); // { id: 1, name: 'Bob' }
```
# API Reference
`
kando(typePath, data = undefined, expiration = null)
`
The core Kando function for all storage operations. Allows setting, retrieving, and removing data with support for namespaces and expiration.
### Parameters
* `typePath` (`string`): A string that specifies the storage type (`local` or `session`) and the key path, separated by dots.
    * **Examples:** `'local.appSettings.theme'`, `'session.user.preferences.language'`.
* `data` (`any`, optional): The value to set at the specified path. Options include:
    * `undefined:` Retrieves the current value at the path.
    * `null:` Deletes the specified key or namespace.
    * **Any value:** Sets or updates data at the path.
* `expiration` (`number`, optional): Expiration time in seconds, only applicable for `sessionStorage`.
### Return Value
* **Retrieving Data:** Returns the current `value` if data is not provided.
* **Setting Data:** Returns `true` upon successful set or update.
* **Removing Data:** Returns `null` if the key or namespace does not exist.

## Compatibility Check
Kando internally verifies storage compatibility with `localStorage` and `sessionStorage`. If compatibility isn’t met, it defaults to an in-memory `Map`.

### Browser/Nodejs Support

Chrome | Firefox | Safari | Opera | Edge | Nodejs
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔


## License
The MIT License (MIT). Please see [License File](LICENSE.md) for more information.

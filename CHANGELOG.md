# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.


## [4.0.0] - 2025-04-26

### Added

- Fallback memory storage improvement for environments without `localStorage` or `sessionStorage`
- TypeScript support with improved type inference (`<T>` generic return)
- `CONTRIBUTING.md` file for contributors
- Linting and formatting scripts (`eslint`, `prettier`)
- New tests for edge cases, expiration logic, and nested data manipulation

### Changed

- Improved session expiration handling and internal cleanup logic
- Restructured test suite for better clarity and separation of concerns
- Updated internal storage handler for stricter key path evaluation

### Removed

- Dropped unnecessary or unreliable timer-based tests in favor of real browser behavior

> This release improves type safety, Node.js support, and maintainability. Great for both browser and server-side use cases.



## [3.0.0] - 2025-01-27

### Changed

- Adjusted session cleanup interval timing for better performance (`interval time changed`)
- Refined and updated documentation (`Updated Readme`, `Updated Read`)
- Prepared and published version 3 (`Update version 3`, `Update package for new version`)

> Note: This version focused primarily on documentation cleanup and minor performance tuning.

---

## [2.0.0] - 2024-11-29

### Added

- Support for deeply nested paths using dot notation (`user.profile.name`)
- Array index access in paths (`cart[0].item`)
- Expiration logic for `sessionStorage` keys with auto-cleanup

---

## [1.0.0] - 2024-11-24

### Initial

- `kando(typePath, data, expiration)` function with unified local/session storage handling
- Fallback to in-memory storage if browser storage is unavailable

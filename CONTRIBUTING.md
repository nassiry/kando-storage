
# Contributing to Kando

Thanks for your interest in contributing to **Kando**! 🎉  
This guide will help you set up your environment, follow the coding style, and submit useful contributions.

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/nassiry/kando-storage.git
cd kando-storage
```

### 2. Install dependencies

```bash
npm install
```

### Available Scripts

- `npm test` Run tests with [Jest](https://jestjs.io/)
- `npm run lint` Check for lint issues with ESLint
- `npm run lint:fix` Auto-fix linting issues
- `npm run format` Format code using Prettier 
- `npx jest --coverage` For test coverage

### Code Style
We use ESLint and Prettier to enforce code quality and formatting.

Run before committing:

```bash
npm run lint
npm run format
```
> Use a code editor with ESLint & Prettier plugins for auto-formatting on save.

### Writing Tests

- All tests live in the `test/` directory.
- We use Jest for unit testing.
- Cover new features or changes with appropriate tests.
- Run this to view your coverage:

```bash
npx jest --coverage
```
Aim to maintain or increase coverage where possible.

### Commit Guidelines.

Please follow clear and descriptive commit messages:

- `feat: add session expiration support`
- `fix: handle fallback storage error`
- `test: cover nested array edge cases`
- `chore: format files with Prettier`

### Best Practices

- Keep PRs focused and minimal.
- Use the in-memory fallback only in test environments.
- Make sure `npm test` and `npm run lint` pass before pushing.
- If changing a public interface, update usage examples if needed.

### Thank You!
Your contribution big or small helps improve this project.
If you're not sure where to start, feel free to open a [discussion or issue](https://github.com/nassiry/kando-storage/issues).
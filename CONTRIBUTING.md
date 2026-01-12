# Contributing to html-fixer

Thank you for your interest in contributing! 🎉

## 🛠️ Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhishekpanda0620/html-fixer.git
   cd html-fixer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run dev  # Watch mode - rebuilds on changes
   ```

4. **Run tests**
   ```bash
   npm test           # Run all tests
   npm run test:watch # Watch mode
   npm run test:coverage # With coverage report
   ```

## 📝 Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning. Your commit messages must follow this format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation only | None |
| `style` | Code style (formatting, etc.) | None |
| `refactor` | Code refactoring | None |
| `perf` | Performance improvement | Patch |
| `test` | Adding/updating tests | None |
| `chore` | Maintenance tasks | None |

### Examples

```bash
# Feature (minor bump: 1.0.0 → 1.1.0)
git commit -m "feat: add support for Vue files"

# Bug fix (patch bump: 1.0.0 → 1.0.1)
git commit -m "fix: handle empty files correctly"

# Breaking change (major bump: 1.0.0 → 2.0.0)
git commit -m "feat!: change default mode to extended"

# With scope
git commit -m "feat(cli): add --config flag"

# With body
git commit -m "fix: prevent double-escaping

Previously, already-escaped entities like &amp; would be
escaped again to &amp;amp;. This fix uses placeholder
substitution to preserve existing entities."
```

## 🧪 Testing Guidelines

- Write tests for all new features and bug fixes
- Use the shared fixtures in `tests/fixtures.ts` for test data
- Follow the existing test structure with `describe` and `it` blocks
- Use `it.each` for parameterized tests

## 📁 Project Structure

```
src/
├── index.ts          # Public API exports
├── cli.ts            # CLI entry point
├── core/
│   ├── entities.ts   # Entity mappings
│   ├── escaper.ts    # Core escaping logic
│   └── processor.ts  # File processing
└── utils/
    └── logger.ts     # Console output utilities

tests/
├── fixtures.ts       # Shared test data
├── escaper.test.ts   # Escaper unit tests
├── entities.test.ts  # Entity tests
└── processor.test.ts # Integration tests
```

## 🚀 Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes with proper commit messages
4. Ensure all tests pass: `npm test`
5. Ensure linting passes: `npm run lint`
6. Push and create a Pull Request

## 📋 Code Style

- Use TypeScript with strict mode
- Follow the existing code style (enforced by ESLint + Prettier)
- Run `npm run lint:fix` to auto-fix issues
- Run `npm run format` to format code

## ❓ Questions?

Open an issue with the `question` label and we'll be happy to help!

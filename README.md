# html-entity-fixer

[![npm version](https://img.shields.io/npm/v/html-entity-fixer.svg)](https://www.npmjs.com/package/html-entity-fixer)
[![Website](https://img.shields.io/badge/Website-html--entity--fixer-blue?style=flat&logo=github)](https://abhishekpanda0620.github.io/html-entity-fixer/)
[![npm downloads](https://img.shields.io/npm/dm/html-entity-fixer.svg)](https://www.npmjs.com/package/html-entity-fixer)
[![CI](https://github.com/abhishekpanda0620/html-entity-fixer/actions/workflows/ci.yml/badge.svg)](https://github.com/abhishekpanda0620/html-entity-fixer/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with GitHub Actions](https://img.shields.io/badge/Built%20with-GitHub%20Actions-2088FF?logo=github-actions&logoColor=white)](https://github.com/abhishekpanda0620/html-entity-fixer/actions)

> 🔧 Fast, safe CLI tool for escaping unescaped HTML entities in modern web projects

## ✨ Features

- **🧠 Smart Tag Detection** - Distinguishes between valid HTML/XML tags and text
- **⚛️ Component Support** - Works with React components, custom elements, and XML
- **🚀 Fast** - Optimized for large codebases and monorepos
- **🔒 Safe** - Never double-escapes already-escaped entities
- **📁 Glob support** - Process multiple files with patterns like `src/**/*.jsx`
- **👀 Dry-run mode** - Preview changes before applying
- **🎛️ Configurable** - Essential or extended escaping modes
- **📦 Lightweight** - ~15KB package size, minimal dependencies

## 📦 Installation

```bash
# Global installation
npm install -g html-entity-fixer

# Local installation (recommended)
npm install --save-dev html-entity-fixer
```

## 🚀 Quick Start

```bash
# Fix all JSX files in src directory
html-entity-fixer "src/**/*.jsx"

# Preview changes without modifying files
html-entity-fixer "src/**/*.{jsx,tsx}" --dry-run

# Use extended mode for additional entities
html-entity-fixer "src/**/*.html" --mode extended
```

## 📖 Usage

```bash
html-entity-fixer <patterns...> [options]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `patterns` | Glob patterns for files to process (e.g., `"src/**/*.jsx"`) |

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--dry-run` | `-d` | Preview changes without modifying files | `false` |
| `--mode` | `-m` | Escaping mode: `essential` or `extended` | `essential` |
| `--verbose` | `-v` | Show detailed output | `false` |
| `--quiet` | `-q` | Suppress all output except errors | `false` |
| `--version` | | Show version number | |
| `--help` | | Show help | |

## 🎯 Escaping Modes

### Essential Mode (default)

Escapes the 5 critical HTML entities:

| Character | Entity |
|-----------|--------|
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `'` | `&#39;` |

### Extended Mode

Includes essential entities plus:

Includes essential entities plus common content writing symbols:

- **Typography**: `©` (&copy;), `®` (&reg;), `™` (&trade;), `—` (&mdash;), `–` (&ndash;), `…` (&hellip;), `§` (&sect;), `¶` (&para;), `°` (&deg;)
- **Currency**: `€` (&euro;), `£` (&pound;), `¥` (&yen;), `¢` (&cent;)
- **Fractions**: `½` (&frac12;), `¼` (&frac14;), `¾` (&frac34;)
- **Math**: `×` (&times;), `÷` (&divide;), `±` (&plusmn;), `∞` (&infin;), `≠` (&ne;), `≈` (&asymp;), `≤` (&le;), `≥` (&ge;)
- **Arrows**: `←` (&larr;), `→` (&rarr;), `↑` (&uarr;), `↓` (&darr;)
- **Spacing**: Non-breaking space (&nbsp;)

## 🔧 Programmatic API

```typescript
import { escapeHtml, processFiles } from 'html-entity-fixer';

// Escape a string
const result = escapeHtml("It's a <test>", 'essential');
console.log(result.content); // "It&#39;s a &lt;test&gt;"
console.log(result.escapedCount); // 3

// Process files
const summary = await processFiles(['src/**/*.jsx'], {
  mode: 'essential',
  dryRun: true,
});
console.log(`Found ${summary.totalEntitiesEscaped} entities to fix`);
```

## 🔄 CI/CD Integration

Use `--dry-run` in your CI pipeline to fail builds with unescaped entities:

```yaml
# .github/workflows/lint.yml
- name: Check HTML entities
  run: npx html-entity-fixer "src/**/*.{jsx,tsx}" --dry-run
```

The command exits with code `1` if changes would be made.

## 📝 Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/) and [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning.

| Commit Type | Version Bump | Example |
|-------------|--------------|---------|
| `fix:` | Patch (0.0.x) | `fix: handle edge case` |
| `feat:` | Minor (0.x.0) | `feat: add extended mode` |
| `feat!:` or `BREAKING CHANGE:` | Major (x.0.0) | `feat!: change API` |

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development setup and guidelines.

## 📄 License

MIT © [Abhishek Panda](https://github.com/abhishekpanda0620)

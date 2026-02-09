# Contributing to XWUI

Thank you for your interest in contributing to XWUI! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Clear and descriptive title**
- **Steps to reproduce the issue**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment information** (OS, browser, Node.js version, etc.)
- **Component version** (if applicable)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear and descriptive title**
- **Detailed description of the enhancement**
- **Use case** - Why is this enhancement useful?
- **Possible implementation** (if you have ideas)

### Pull Requests

1. **Fork the repository** and create your branch from `main`.
2. **Follow the coding standards** - See [Development Guide](docs/guides/GUIDE_DEV_TS_XWUI.md)
3. **Write or update tests** - Ensure all tests pass
4. **Update documentation** - Keep documentation up to date
5. **Commit your changes** - Use clear, descriptive commit messages
6. **Push to your fork** and submit a pull request

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/exonware/xwui.git
cd xwui
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Build the project:
```bash
npm run build
```

### Component Development

When creating or modifying components:

1. **Follow the component structure** - See [Component Development Guide](docs/guides/GUIDE_DEV_TS_XWUI.md)
2. **Extend XWUIComponent** - All components must extend the base class
3. **Create JSON schema** - Each component needs a schema file
4. **Add testers** - Create HTML tester files in `testers/` folder
5. **Use CSS variables** - Never hardcode colors or theme values
6. **Follow accessibility guidelines** - Implement ARIA attributes and keyboard navigation

### Coding Standards

- **TypeScript** - Use TypeScript for all new code
- **ESLint** - Follow ESLint rules (if configured)
- **Naming conventions** - Use PascalCase for components, camelCase for functions
- **Documentation** - Add JSDoc comments for public APIs
- **Testing** - Write tests for new features

### Commit Messages

Use clear, descriptive commit messages:

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- First line should be 50 characters or less
- Reference issues and pull requests when applicable

Example:
```
Add Tailwind integration support

- Implement token mapping system
- Create Tailwind preset
- Add class hooks to component base class
- Update documentation

Closes #123
```

### License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing, please:
- Open an issue for discussion
- Check existing documentation
- Review the [Development Guide](docs/guides/GUIDE_DEV_TS_XWUI.md)

Thank you for contributing to XWUI!

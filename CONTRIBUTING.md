# Contributing to Dutch Tax Box 3 Calculator

We appreciate your interest in contributing! Please follow these guidelines.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install`

## Development

```bash
# Build the project
npm run build

# Run tests
npm run test

# Check code style
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

## Before Submitting

- Ensure all tests pass: `npm run test`
- Ensure code is formatted: `npm run format`
- Ensure types are correct: `npm run type-check`
- Update relevant documentation
- Add a changeset: `npm exec changeset`

## Changeset

We use [Changesets](https://github.com/changesets/changesets) to manage versioning. When you make changes:

1. Run `npm exec changeset` to create a changeset file
2. Follow the prompts to describe your changes
3. Commit the `.changeset/*.md` file with your PR

## Pull Request Process

1. Create a descriptive pull request with a clear title and description
2. Reference any related issues
3. Ensure CI checks pass
4. Request review from maintainers
5. Address review feedback

## Code Style

- Use 2-space indentation
- Use TypeScript for type safety
- Write clear, descriptive variable and function names
- Add comments for complex logic
- Follow existing code patterns

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
